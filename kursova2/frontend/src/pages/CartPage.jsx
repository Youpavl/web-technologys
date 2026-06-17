import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import api from '../api/axios';

// Проста перевірка телефону: щонайменше 10 цифр
const countDigits = (s) => (s.match(/\d/g) || []).length;

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Дані доставки
  const [shipping, setShipping] = useState({ fullName: '', phone: '', city: '', address: '' });
  const [payment, setPayment] = useState('Оплата при отриманні');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [saveDefaults, setSaveDefaults] = useState(false);
  const [errors, setErrors] = useState({});

  // Підставляємо збережені дані користувача
  useEffect(() => {
    if (user) {
      setShipping({
        fullName: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const setField = (field, value) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Форматування полів картки
  const setCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCard((prev) => ({ ...prev, number: formatted }));
    setErrors((prev) => ({ ...prev, cardNumber: undefined }));
  };
  const setCardExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setCard((prev) => ({ ...prev, expiry: formatted }));
    setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
  };
  const setCardCvv = (value) => {
    setCard((prev) => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 3) }));
    setErrors((prev) => ({ ...prev, cardCvv: undefined }));
  };

  const validate = () => {
    const e = {};
    if (shipping.fullName.trim().length < 2) e.fullName = "Вкажіть ім'я отримувача";
    if (countDigits(shipping.phone) < 10) e.phone = 'Вкажіть коректний номер телефону';
    if (!shipping.city.trim()) e.city = 'Вкажіть місто';
    if (shipping.address.trim().length < 5) e.address = 'Вкажіть адресу (відділення або вулицю)';

    if (payment === 'Картка онлайн') {
      if (card.number.replace(/\s/g, '').length !== 16) e.cardNumber = 'Номер картки — 16 цифр';
      const m = /^(\d{2})\/(\d{2})$/.exec(card.expiry);
      if (!m || +m[1] < 1 || +m[1] > 12) {
        e.cardExpiry = 'Термін у форматі MM/YY';
      } else {
        const exp = new Date(2000 + +m[2], +m[1]); // перше число наступного місяця
        if (exp <= new Date()) e.cardExpiry = 'Термін дії картки минув';
      }
      if (card.cvv.length !== 3) e.cardCvv = 'CVV — 3 цифри';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!validate()) {
      showToast('Перевірте правильність заповнення форми', 'error');
      return;
    }

    setOrdering(true);
    try {
      const items = cartItems.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
      }));

      await api.post('/orders', {
        items,
        shipping: {
          fullName: shipping.fullName,
          phone: shipping.phone,
          city: shipping.city,
          address: shipping.address,
        },
        paymentMethod: payment,
      });

      if (saveDefaults) {
        try {
          await updateProfile({
            phone: shipping.phone,
            city: shipping.city,
            address: shipping.address,
          });
        } catch { /* збереження дефолтів не критичне */ }
      }

      clearCart();
      setOrderSuccess(true);
      showToast('Замовлення успішно оформлено! 🎉', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Помилка оформлення замовлення', 'error');
    } finally {
      setOrdering(false);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete === 'all') {
      clearCart();
      showToast('Кошик очищено', 'info');
    } else if (confirmDelete) {
      removeFromCart(confirmDelete);
      showToast('Товар видалено з кошика', 'info');
    }
    setConfirmDelete(null);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center fade-in-up">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-3">Замовлення оформлено!</h2>
        <p className="text-slate-400 mb-8 text-lg">Дякуємо за покупку. Ви можете переглянути статус у профілі.</p>
        <div className="flex justify-center gap-4">
          <Link to="/profile" className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all shadow-lg shadow-amber-500/25 font-medium">
            Мої замовлення
          </Link>
          <Link to="/" className="px-8 py-3.5 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl transition-all border border-white/[0.1] font-medium">
            До каталогу
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center fade-in-up">
        <div className="text-7xl mb-6 opacity-80">🛒</div>
        <h2 className="text-3xl font-bold text-white mb-3">Кошик порожній</h2>
        <p className="text-slate-400 mb-8 text-lg">Ви ще не додали жодної книги до кошика.</p>
        <Link to="/" className="px-8 py-3.5 bg-white text-black hover:bg-amber-500 hover:text-slate-900 rounded-xl transition-all font-bold tracking-wide inline-block shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  const inputBase = "w-full px-4 py-3 bg-white/[0.05] border text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 transition-all";
  const fieldClass = (name) => `${inputBase} ${errors[name]
    ? 'border-rose-500/60 focus:ring-rose-500/40'
    : 'border-white/[0.12] focus:ring-amber-400/50 focus:border-amber-400/50'}`;

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in-up">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <span>🛒</span> Ваш кошик
      </h1>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/[0.08] text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.02]">
          <div className="col-span-6">Товар</div>
          <div className="col-span-3 text-center">Кількість</div>
          <div className="col-span-2 text-right">Сума</div>
          <div className="col-span-1 text-right"></div>
        </div>

        {cartItems.map((item) => {
          const finalPrice = item.book.discount > 0
            ? Math.round(item.book.price * (1 - item.book.discount / 100))
            : item.book.price;

          return (
            <div key={item.book._id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
              {/* Зображення та інфо */}
              <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                <img
                  src={item.book.image || 'https://placehold.co/80x120/0e1730/f59e0b?text=Без+фото'}
                  alt={item.book.title}
                  className="w-16 h-24 object-cover rounded-lg shadow-md"
                />
                <div>
                  <p className="text-xs text-amber-400 font-medium mb-1">{item.book.author}</p>
                  <Link to={`/books/${item.book._id}`} className="font-bold text-white hover:text-amber-300 text-lg line-clamp-2 transition-colors">
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-slate-500 mt-1">{finalPrice} грн/шт.</p>
                </div>
              </div>

              {/* Кількість */}
              <div className="col-span-1 sm:col-span-3 flex items-center justify-start sm:justify-center gap-3">
                <button
                  onClick={() => updateQuantity(item.book._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 flex items-center justify-center disabled:opacity-30 transition-all"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold text-white text-lg">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.book._id, item.quantity + 1)}
                  className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 flex items-center justify-center transition-all"
                >
                  +
                </button>
              </div>

              {/* Сума */}
              <div className="col-span-1 sm:col-span-2 text-left sm:text-right">
                <p className="font-bold text-white text-xl">{finalPrice * item.quantity} <span className="text-sm text-slate-400 font-normal">грн</span></p>
              </div>

              {/* Видалити */}
              <div className="col-span-1 sm:col-span-1 text-right sm:text-center mt-2 sm:mt-0">
                <button
                  onClick={() => setConfirmDelete(item.book._id)}
                  className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition-all"
                  title="Видалити"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

        {/* Підсумок */}
        <div className="p-6 bg-gradient-to-r from-white/[0.02] to-white/[0.05] border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">Загальна сума до сплати</p>
            <div className="text-3xl font-black text-white">
              {getTotal()} <span className="text-xl font-medium text-slate-400">грн</span>
            </div>
          </div>

          <button
            onClick={() => setConfirmDelete('all')}
            className="px-6 py-3 bg-transparent hover:bg-white/[0.05] text-slate-400 rounded-xl transition-all text-sm font-medium border border-white/[0.1]"
          >
            Очистити кошик
          </button>
        </div>
      </div>

      {/* Оформлення замовлення */}
      {user ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Дані доставки */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span>🚚</span> Дані доставки
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Отримувач</label>
                <input
                  value={shipping.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  className={fieldClass('fullName')}
                  placeholder="Прізвище та ім'я"
                />
                {errors.fullName && <p className="text-rose-400 text-xs mt-1.5">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Телефон</label>
                <input
                  value={shipping.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className={fieldClass('phone')}
                  placeholder="+380 __ ___ __ __"
                />
                {errors.phone && <p className="text-rose-400 text-xs mt-1.5">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Місто</label>
                <input
                  value={shipping.city}
                  onChange={(e) => setField('city', e.target.value)}
                  className={fieldClass('city')}
                  placeholder="Київ"
                />
                {errors.city && <p className="text-rose-400 text-xs mt-1.5">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Адреса / відділення</label>
                <input
                  value={shipping.address}
                  onChange={(e) => setField('address', e.target.value)}
                  className={fieldClass('address')}
                  placeholder="Відділення №12 або вул. Хрещатик, 1"
                />
                {errors.address && <p className="text-rose-400 text-xs mt-1.5">{errors.address}</p>}
              </div>
              <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer select-none mt-1">
                <input
                  type="checkbox"
                  checked={saveDefaults}
                  onChange={(e) => setSaveDefaults(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                Зберегти дані для наступних замовлень
              </label>
            </div>
          </div>

          {/* Оплата */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span>💳</span> Спосіб оплати
            </h2>

            <div className="flex flex-col gap-3">
              {['Оплата при отриманні', 'Картка онлайн'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    payment === method
                      ? 'bg-amber-500/15 border-amber-400/50 text-white'
                      : 'bg-white/[0.03] border-white/[0.1] text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${payment === method ? 'border-amber-400 bg-amber-400' : 'border-slate-500'}`} />
                  <span className="font-medium">{method === 'Оплата при отриманні' ? '💵 Готівкою при отриманні' : '💳 Карткою онлайн'}</span>
                </button>
              ))}
            </div>

            {payment === 'Картка онлайн' && (
              <div className="mt-5 flex flex-col gap-4 fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Номер картки</label>
                  <input
                    value={card.number}
                    onChange={(e) => setCardNumber(e.target.value)}
                    inputMode="numeric"
                    className={fieldClass('cardNumber')}
                    placeholder="0000 0000 0000 0000"
                  />
                  {errors.cardNumber && <p className="text-rose-400 text-xs mt-1.5">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Термін</label>
                    <input
                      value={card.expiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      inputMode="numeric"
                      className={fieldClass('cardExpiry')}
                      placeholder="MM/YY"
                    />
                    {errors.cardExpiry && <p className="text-rose-400 text-xs mt-1.5">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">CVV</label>
                    <input
                      value={card.cvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      inputMode="numeric"
                      type="password"
                      className={fieldClass('cardCvv')}
                      placeholder="•••"
                    />
                    {errors.cardCvv && <p className="text-rose-400 text-xs mt-1.5">{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleOrder}
              disabled={ordering}
              className="w-full py-3.5 mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all font-bold tracking-wide disabled:opacity-50 shadow-lg shadow-amber-500/25 btn-glow"
            >
              {ordering ? 'Обробка...' : `ОФОРМИТИ ЗАМОВЛЕННЯ · ${getTotal()} грн`}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-lg mx-auto">
          <p className="text-slate-300 mb-4">
            Для оформлення замовлення потрібно увійти в акаунт
          </p>
          <Link to="/login" className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-amber-500/25">
            Увійти та оформити
          </Link>
        </div>
      )}

      {/* Модалка підтвердження */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        title={confirmDelete === 'all' ? 'Очистити кошик?' : 'Видалити товар?'}
        message={confirmDelete === 'all' ? 'Всі товари будуть видалені з кошика.' : 'Цей товар буде видалено з вашого кошика.'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

export default CartPage;
