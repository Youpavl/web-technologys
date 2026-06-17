import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ім'я є обов'язковим"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email є обов'язковим"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Пароль є обов'язковим"],
    minlength: [6, 'Пароль має бути не менше 6 символів']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Збережені дані доставки за замовчуванням (підставляються при оформленні)
  phone: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  address: { type: String, default: '', trim: true }
}, { timestamps: true });

// Хешування паролю перед збереженням
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод порівняння паролів
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Не повертати пароль у JSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', UserSchema);
