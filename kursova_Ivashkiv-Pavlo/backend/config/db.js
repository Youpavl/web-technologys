import mongoose from 'mongoose';

// Підключаюся до MongoDB (адреса бази - у .env)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB підключено: ${conn.connection.host}`);
  } catch (error) {
    // Не достукався до бази - далі немає сенсу, виходжу
    console.error(`Помилка підключення до MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
