require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Success: Connected to MongoDB (Atlas)'))
    .catch(err => console.error('Error connecting to DB:', err));
    
app.get('/product/list', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching product list' });
    }
});

app.post('/product/create', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: 'Error validating or creating product' });
    }
});

app.put('/product/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { price: req.body.price },
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data for updating price' });
    }
});

app.delete('/product/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product successfully deleted', id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});