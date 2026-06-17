import Book from '../models/Book.js';

// Значення мають збігатися з селектом сортування на фронтенді
const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  title_asc: { title: 1 },
  title_desc: { title: -1 },
};

// GET /api/books - список книг: пошук, фільтр, сортування, пагінація
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = (req.query.search || '').trim();
    const category = req.query.category || '';
    const sort = SORT_OPTIONS[req.query.sort] || SORT_OPTIONS.newest;

    const filter = {};

    // Шукаю одразу по назві, опису й категорії (i - без урахування регістру)
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      filter.$or = [{ title: regex }, { description: regex }, { category: regex }];
    }

    if (category) {
      filter.category = category;
    }

    const total = await Book.countDocuments(filter);
    const pages = Math.ceil(total / limit) || 1;

    // skip + limit - оце і є пагінація
    const books = await Book.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ books, page, pages, total });
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання книг', error: error.message });
  }
};

// GET /api/books/:id - одна книга
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання книги', error: error.message });
  }
};

// POST /api/books - створити книгу
export const createBook = async (req, res) => {
  try {
    const { title, description, price, discount, stock, image, category } = req.body;
    const book = await Book.create({ title, description, price, discount, stock, image, category });
    res.status(201).json(book);
  } catch (error) {
    // 400 - якщо схема не пропустила дані
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/books/:id - оновити книгу
export const updateBook = async (req, res) => {
  try {
    const { title, description, price, discount, stock, image, category } = req.body;
    // new: true - повертаю оновлену книгу; runValidators - щоб перевірки спрацювали й при оновленні
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, description, price, discount, stock, image, category },
      { new: true, runValidators: true }
    );
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/books/:id - видалити книгу
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });
    res.json({ message: 'Книгу видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка видалення книги', error: error.message });
  }
};
