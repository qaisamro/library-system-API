import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(13),
    unique: true,
    allowNull: true
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  hooks: {
    beforeCreate: (book) => {
      book.availableCopies = book.totalCopies;
    },
    beforeUpdate: (book) => {
      if (book.changed('totalCopies')) {
        const diff = book.totalCopies - book.previous('totalCopies');
        book.availableCopies += diff;
        if (book.availableCopies < 0) book.availableCopies = 0;
      }
    }
  }
});

export default Book;