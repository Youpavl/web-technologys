const express = require('express');
const app = express();
const PORT = 3000;

// Middleware для зчитування JSON запитів від клієнта
app.use(express.json());

// Налаштовуємо Express для обслуговування статичних файлів з папки 'public'
app.use(express.static('public'));

// Тимчасові тестові заглушки маршрутів на бекенді, щоб клієнт отримував відповіді
app.get('/product/list', (req, res) => res.json({ message: "List of products is empty" }));
app.post('/product/create', (req, res) => res.json({ message: "Product created", data: req.body }));
app.put('/product/:id', (req, res) => res.json({ message: `Price of product ${req.params.id} updated`, data: req.body }));
app.delete('/product/:id', (req, res) => res.json({ message: `Product ${req.params.id} deleted` }));

// Прослуховуємо запити на вказаному порті
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});