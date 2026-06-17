import Book from '../models/Book.js';

// Отримати список книг (з пагінацією, пошуком, фільтрацією)
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Формуємо фільтр
    let filter = {};

    // Пошук по назві (регулярний вираз, регістронезалежний)
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Фільтрація по категорії
    if (category) {
      filter.category = category;
    }

    // Підрахунок загальної кількості
    const total = await Book.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    // Отримання книг з пагінацією
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ books, page, pages, total });
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання книг', error: error.message });
  }
};

// Отримати одну книгу по ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання книги', error: error.message });
  }
};

// Створити нову книгу (тільки адмін)
export const createBook = async (req, res) => {
  try {
    const { title, description, price, discount, stock, image, category, author, publisher, pages } = req.body;
    const book = await Book.create({ title, description, price, discount, stock, image, category, author, publisher, pages });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: 'Помилка створення книги', error: error.message });
  }
};

// Оновити книгу (тільки адмін)
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Помилка оновлення книги', error: error.message });
  }
};

// Видалити книгу (тільки адмін)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }
    res.json({ message: 'Книгу успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення книги', error: error.message });
  }
};
