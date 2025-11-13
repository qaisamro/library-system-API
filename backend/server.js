import 'dotenv/config'; 
import express from 'express';
import { expressjwt } from 'express-jwt'; 
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import borrowRoutes from './routes/borrows.js';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

import passport from './config/passport.js';
import jwt from 'jsonwebtoken'; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/borrows', borrowRoutes);

app.use(passport.initialize()); 


app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
   
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET);

  
    res.redirect(`http://localhost:3000/login?token=${token}`);
});


const swaggerDocument = JSON.parse(readFileSync(join(__dirname, 'openapi.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(
  '/graphql',
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false, 
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return { user };
    } catch {
return { user: req.auth }; 
    }
  }
});
await server.start();
server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`Login: POST /api/v1/auth/login`);
  });
});