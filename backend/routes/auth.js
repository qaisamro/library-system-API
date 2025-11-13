import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

const users = [
  { id: 1, email: "admin@lib.ps", password: "123456", role: "admin" },
  { id: 2, email: "librarian@lib.ps", password: "123456", role: "librarian" },
  { id: 3, email: "user@lib.ps", password: "123456", role: "member" }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "بيانات الاعتماد غير صحيحة" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,     
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

export default router;