import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (error) {
        console.error('Помилка завантаження замовлень:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColors = {
    'В обробці': 'bg-yellow-500/20 text-yellow-400',
    'Передано в службу доставки': 'bg-blue-500/20 text-blue-400',
    'Доставлено': 'bg-emerald-500/20 text-emerald-400',
    'Скасовано': 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-white mb-6">📦 Мої замовлення</h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-slate-400 mb-6">У вас ще немає замовлень</p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25"
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-colors rounded-xl p-5">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                  <div>
                    <span className="font-bold text-white text-lg">Замовлення #{orders.length - index}</span>
                    <span className="text-sm text-slate-400 ml-3">
                      {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white text-lg">{order.totalAmount} грн</span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${statusColors[order.status] || 'bg-white/[0.1] text-slate-300'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Товари */}
                <div className="border-t border-white/[0.08] pt-3">
                  <p className="text-sm font-medium text-slate-400 mb-2">Товари:</p>
                  <div className="text-sm text-slate-300">
                    {order.items.map((item, i) => (
                      <span key={i} className="inline-block mr-4 mb-1">
                        {item.book?.title || 'Видалена книга'} <span className="text-slate-500">× {item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Доставка та оплата */}
                {order.shipping && (
                  <div className="border-t border-white/[0.08] pt-3 mt-3 text-sm text-slate-400 flex flex-wrap gap-x-6 gap-y-1">
                    <span>🚚 {order.shipping.city}, {order.shipping.address}</span>
                    <span>📞 {order.shipping.phone}</span>
                    {order.paymentMethod && <span>💳 {order.paymentMethod}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
