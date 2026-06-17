import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware для перевірки авторизації користувача
export const protect = async (req, res, next) => {
  try {
    // Дістаємо заголовок Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Немає токену авторизації' });
    }

    // Витягуємо токен
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Невалідний токен' });
    }

    // Шукаємо користувача
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Помилка авторизації' });
  }
};
