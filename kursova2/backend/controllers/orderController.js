import Order from '../models/Order.js';
import Book from '../models/Book.js';

// Створити замовлення (авторизований користувач)
export const createOrder = async (req, res) => {
  try {
    const { items, shipping, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Кошик порожній' });
    }

    // Перевірка даних доставки
    const required = { fullName: "Ім'я отримувача", phone: 'Телефон', city: 'Місто', address: 'Адреса' };
    const missing = Object.keys(required).filter((f) => !shipping?.[f]?.trim());
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Заповніть дані доставки: ${missing.map((f) => required[f]).join(', ')}`
      });
    }

    const validPayments = ['Оплата при отриманні', 'Картка онлайн'];
    const payment = validPayments.includes(paymentMethod) ? paymentMethod : 'Оплата при отриманні';

    // Обробка кожного товару в замовленні
    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Книгу з ID ${item.book} не знайдено` });
      }

      // Перевірка наявності на складі
      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Недостатньо копій "${book.title}" на складі. Доступно: ${book.stock}`
        });
      }

      // Розрахунок ціни зі знижкою
      const price = book.discount > 0
        ? Math.round(book.price * (1 - book.discount / 100))
        : book.price;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: price
      });

      totalAmount += price * item.quantity;

      // Зменшення кількості на складі
      book.stock -= item.quantity;
      await book.save();
    }

    // Створення замовлення
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shipping: {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        city: shipping.city.trim(),
        address: shipping.address.trim()
      },
      paymentMethod: payment
    });

    // Популяція даних книг для відповіді
    const populatedOrder = await Order.findById(order._id)
      .populate('items.book', 'title image price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Помилка створення замовлення', error: error.message });
  }
};

// Отримати замовлення поточного користувача
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book', 'title image price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання замовлень', error: error.message });
  }
};

// Отримати всі замовлення (тільки адмін)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.book', 'title price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання замовлень', error: error.message });
  }
};

// Змінити статус замовлення (тільки адмін)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['В обробці', 'Передано в службу доставки', 'Доставлено', 'Скасовано'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Невалідний статус замовлення' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
     .populate('items.book', 'title price');

    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення статусу', error: error.message });
  }
};
