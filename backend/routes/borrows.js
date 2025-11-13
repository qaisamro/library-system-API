import express from 'express';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ],
      order: [['borrowDate', 'DESC']]
    });
    res.json({ version: '1.0.0', data: borrows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, authorize('member', 'librarian'), async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: 'الكتاب غير موجود' });
    if (book.availableCopies <= 0) return res.status(400).json({ error: 'لا توجد نسخ متاحة' });

    const existing = await Borrow.findOne({
      where: { userId, bookId, status: 'borrowed' }
    });
    if (existing) return res.status(400).json({ error: 'لقد استعرت هذا الكتاب مسبقًا' });

    const borrow = await Borrow.create({ userId, bookId });

    res.status(201).json({ version: '1.0.0', data: borrow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id/return', protect, authorize('member', 'librarian'), async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) return res.status(404).json({ error: 'الإعارة غير موجودة' });

    if (borrow.status === 'returned') {
      return res.status(400).json({ error: 'تم إرجاع الكتاب مسبقًا' });
    }

    if (req.user.role === 'member' && borrow.userId !== req.user.id) {
      return res.status(403).json({ error: 'غير مصرح لك بإرجاع هذا الكتاب' });
    }

    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    res.json({ version: '1.0.0', data: borrow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, attributes: ['id', 'title', 'author'] }],
      order: [['borrowDate', 'DESC']]
    });
    res.json({ version: '1.0.0', data: borrows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;