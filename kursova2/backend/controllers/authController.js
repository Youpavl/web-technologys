import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

// Реєстрація нового користувача
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Валідація
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Ім'я, email та пароль є обов'язковими" });
    }

    // Перевірка чи існує користувач
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }

    // Створення користувача
    const user = await User.create({ name, email, password, role: 'user' });

    // Генерація токенів
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при реєстрації', error: error.message });
  }
};

// Вхід користувача
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email та пароль є обов'язковими" });
    }

    // Пошук користувача
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    // Перевірка паролю
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    // Генерація токенів
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при вході', error: error.message });
  }
};

// Оновлення access token через refresh token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token є обов'язковим" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Невалідний refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    // Генерація нових токенів
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення токена', error: error.message });
  }
};

// Вихід
export const logout = async (req, res) => {
  try {
    res.json({ message: 'Успішний вихід' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при виході' });
  }
};

// Отримання даних поточного користувача
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка отримання даних' });
  }
};

// Оновлення профілю (ім'я + дані доставки за замовчуванням)
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Ім'я не може бути порожнім" });
      }
      user.name = name.trim();
    }
    if (phone !== undefined) user.phone = phone.trim();
    if (city !== undefined) user.city = city.trim();
    if (address !== undefined) user.address = address.trim();

    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Помилка оновлення профілю', error: error.message });
  }
};
