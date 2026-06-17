import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';

dotenv.config();

const app = express();

connectDB();

// Інакше фронтенд (він на іншому порту) не дістанеться до сервера
app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));

app.use(express.json());

app.use('/api/books', bookRoutes);

// Перевірка, що сервер живий
app.get('/', (req, res) => {
  res.json({ message: '📚 Litera API працює!', books: '/api/books' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
