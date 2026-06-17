import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Завантаження змінних середовища
dotenv.config();

const app = express();

// Підключення до MongoDB
connectDB();

// CORS — дозволяємо запити з фронтенду (будь-який localhost-порт від Vite)
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  credentials: true
}));

// Middleware для парсингу JSON
app.use(express.json());

// Роути API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

// Головний роут
app.get('/', (req, res) => {
  res.json({
    message: '📚 Litera API працює!',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      orders: '/api/orders'
    }
  });
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Щось пішло не так!' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
