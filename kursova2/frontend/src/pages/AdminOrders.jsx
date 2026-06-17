import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const statuses = ['В обробці', 'Передано в службу доставки', 'Доставлено', 'Скасовано'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Помилка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Статус змінено на "${newStatus}"`, 'success');
      fetchOrders();
    } catch (error) {
      showToast('Помилка зміни статусу', 'error');
    }
  };

  const statusColors = {
    'В обробці': 'bg-yellow-500/20 text-yellow-400',
    'Передано в службу доставки': 'bg-blue-500/20 text-blue-400',
    'Доставлено': 'bg-emerald-500/20 text-emerald-400',
    'Скасовано': 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <h1 className="text-2xl font-bold text-white mb-6">📦 Управління замовленнями</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-500">Замовлень ще немає</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={order._id} className="glass-card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-white">Замовлення #{orders.length - index}</h3>
                  <p className="text-sm text-slate-400">
                    {order.user?.name || 'Невідомий'} — {order.user?.email || ''}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString('uk-UA')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{order.totalAmount} грн</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`mt-1 text-sm font-medium px-3 py-1 rounded-lg border-0 cursor-pointer bg-white/[0.08] text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Доставка та оплата */}
              {order.shipping && (
                <div className="border-t border-white/[0.08] pt-3 mb-3 text-sm text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  <span>👤 {order.shipping.fullName}</span>
                  <span>📞 {order.shipping.phone}</span>
                  <span>🚚 {order.shipping.city}, {order.shipping.address}</span>
                  {order.paymentMethod && <span>💳 {order.paymentMethod}</span>}
                </div>
              )}

              {/* Товари */}
              <div className="border-t border-white/[0.08] pt-3">
                <p className="text-sm font-medium text-slate-400 mb-2">Товари:</p>
                <div className="text-sm text-slate-500 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.book?.title || 'Видалена книга'} × {item.quantity}</span>
                      <span className="text-slate-400">{item.price * item.quantity} грн</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
