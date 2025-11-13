import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';



export default {
  Query: {
    books: async () => {
      return await Book.findAll();
    },

    book: async (_, { id }) => {
      return await Book.findByPk(id);
    },

    myBorrows: async (_, __, { user }) => {
      if (!user) throw new Error('غير مصرح');
      return await Borrow.findAll({
        where: { userId: user.id },
        include: [{ model: Book }]
      });
    }
  },

  Mutation: {
addBook: async (_, args, { user }) => {
  if (!user || !['admin', 'librarian'].includes(user.role)) {
    throw new Error('غير مصرح: يجب أن تكون مديرًا أو أمين مكتبة');
  }

  const book = await Book.create({
    ...args,
    availableCopies: args.totalCopies
  });

  return book;
},

borrowBook: async (_, { bookId }, { user }) => {
  if (!user) throw new Error('غير مصرح');

  return await sequelize.transaction(async (t) => {
    const book = await Book.findByPk(bookId, { lock: t.LOCK.UPDATE, transaction: t });
    if (!book) throw new Error('الكتاب غير موجود');
    if (book.availableCopies <= 0) throw new Error('لا توجد نسخ متاحة');

    const existing = await Borrow.findOne({
      where: { userId: user.id, bookId, status: 'borrowed' },
      transaction: t
    });
    if (existing) throw new Error('لقد استعرت هذا الكتاب مسبقًا');

    const borrow = await Borrow.create({
      userId: user.id,
      bookId
    }, { transaction: t });

    await book.update({
      availableCopies: book.availableCopies - 1
    }, { transaction: t });

    return borrow;
  });
},
    returnBook: async (_, { borrowId }, { user }) => {
      if (!user) throw new Error('غير مصرح');

      const borrow = await Borrow.findByPk(borrowId, {
        include: [Book]
      });

      if (!borrow) throw new Error('الإعارة غير موجودة');
      if (borrow.status === 'returned') throw new Error('تم إرجاع الكتاب مسبقًا');
      if (borrow.userId !== user.id && user.role !== 'librarian' && user.role !== 'member') {
        throw new Error('غير مصرح لك بإرجاع هذا الكتاب');
      }

      borrow.status = 'returned';
      borrow.returnDate = new Date();
      await borrow.save();

      await borrow.book.increment('availableCopies');
      return borrow;
    }
  },

  Borrow: {
    book: async (borrow) => {
      return await Book.findByPk(borrow.bookId);
    }
  }
};