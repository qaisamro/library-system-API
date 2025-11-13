import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

const Borrow = sequelize.define('Borrow', {
  borrowDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned'),
    defaultValue: 'borrowed'
  }
});

User.hasMany(Borrow);
Borrow.belongsTo(User);

Book.hasMany(Borrow);
Borrow.belongsTo(Book);

Borrow.addHook('afterCreate', async (borrow) => {
  const book = await Book.findByPk(borrow.bookId);
  if (book && book.availableCopies > 0) {
    book.availableCopies -= 1;
    await book.save();
  }
});

Borrow.addHook('beforeCreate', async (borrow, options) => {
  const book = await Book.findByPk(borrow.bookId, { transaction: options.transaction });
  if (book && book.availableCopies > 0) {
    book.availableCopies -= 1;
    await book.save({ transaction: options.transaction }); 
  }
});

export default Borrow;