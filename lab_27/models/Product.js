const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, required: true, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    brand: { type: String, default: "No Brand" },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);