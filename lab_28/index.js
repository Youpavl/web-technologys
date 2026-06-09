require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const auth = require('./middleware/auth');
const authAdmin = require('./middleware/authAdmin');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

const generateTokens = (userId, role) => {
    const accessToken = jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const tokens = generateTokens(user._id, user.role);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.json({ message: 'Login successful', accessToken: tokens.accessToken });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Token refresh
app.post('/api/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user._id, user.role);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.cookie('accessToken', tokens.accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.json({ accessToken: tokens.accessToken });
    } catch (e) {
        res.status(403).json({ message: 'Validation error' });
    }
});

// Logout
app.post('/api/logout', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
            await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout successful' });
    } catch (e) {
        res.status(500).json({ message: 'Error occurred during logout' });
    }
});

// Saved route for user info
app.get('/api/user-info', auth, async (req, res) => {
    const user = await User.findById(req.user.userId).select('-password -refreshToken');
    res.json(user);
});

// Saved route for admin info
app.get('/api/admin', auth, authAdmin, (req, res) => {
    res.json({ message: 'Secret admin panel', user: req.user });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));