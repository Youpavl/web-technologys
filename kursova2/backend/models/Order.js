import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
  },
  paymentMethod: {
    type: String,
    enum: ['Оплата при отриманні', 'Картка онлайн'],
    default: 'Оплата при отриманні'
  },
  status: {
    type: String,
    enum: ['В обробці', 'Передано в службу доставки', 'Доставлено', 'Скасовано'],
    default: 'В обробці'
  }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
