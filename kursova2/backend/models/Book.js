import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Назва є обов'язковою"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Опис є обов'язковим"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Ціна є обов'язковою"],
    min: [0, "Ціна не може бути від'ємною"]
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Знижка не може бути від'ємною"],
    max: [100, 'Знижка не може перевищувати 100%']
  },
  stock: {
    type: Number,
    required: [true, "Кількість на складі є обов'язковою"],
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, "Категорія є обов'язковою"],
    enum: ['Художня література', 'Наукова література', 'Дитячі книги', 'Комікси', 'Навчальна література']
  },
  author: {
    type: String,
    default: 'Невідомий автор'
  },
  publisher: {
    type: String,
    default: 'Невідоме видавництво'
  },
  pages: {
    type: Number,
    default: 0
  },
  previewPages: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Віртуальне поле — ціна зі знижкою
BookSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Індекс для текстового пошуку
BookSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Book', BookSchema);
