import express from 'express';
import { getBooks, createBook } from '../controllers/bookController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', protect, authorize('admin', 'librarian'), createBook);

export default router;