import Book from '../models/Book.js';

export const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books); 
  } catch (error) {
    res.status(500).json({ error: 'فشل جلب الكتب' });
  }
};
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ version: '1.0.0', data: book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};