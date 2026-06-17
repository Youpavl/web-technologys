import mongoose from 'mongoose';

// Категорії - фіксований список (такий самий у фільтрі на фронтенді)
export const CATEGORIES = [
  'Художня література',
  'Наукова література',
  'Дитячі книги',
  'Комікси',
  'Навчальна література',
];

// Схема книги: 7 полів за завданням. Тут же перевірки, щоб у базу не потрапило сміття
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Назва є обов'язковою"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Опис є обов'язковим"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Ціна є обов'язковою"],
      min: [0, "Ціна не може бути від'ємною"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Знижка не може бути від'ємною"],
      max: [100, 'Знижка не може перевищувати 100%'],
    },
    stock: {
      type: Number,
      required: [true, 'Кількість на складі є обов\'язковою'],
      min: [0, "Кількість не може бути від'ємною"],
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, "Категорія є обов'язковою"],
      enum: {
        values: CATEGORIES,
        message: 'Недопустима категорія',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
