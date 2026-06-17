import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Ім'я не може бути порожнім", 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(form);
      showToast('Дані профілю збережено', 'success');
      setEditing(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Помилка збереження', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all";

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      {/* Профіль */}
      <div className="glass-card p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">👤 Мій профіль</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 px-4 py-2 rounded-lg transition-all border border-white/[0.1]"
            >
              Редагувати
            </button>
          )}
        </div>

        {!editing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Ім'я</p>
                <p className="font-bold text-white text-lg">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                <p className="font-bold text-white text-lg break-all">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Роль</p>
                <p className="font-bold text-amber-400 text-lg">
                  {user?.role === 'admin' ? 'Адміністратор' : 'Користувач'}
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-sm font-semibold text-slate-300 mb-3">🚚 Дані доставки за замовчуванням</p>
              {user?.phone || user?.city || user?.address ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Телефон</p>
                    <p className="text-white">{user.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Місто</p>
                    <p className="text-white">{user.city || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Адреса</p>
                    <p className="text-white">{user.address || '—'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  Ще не вказані. Натисніть «Редагувати», щоб додати — вони підставляться під час оформлення замовлення.
                </p>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Ім'я</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ваше ім'я" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Телефон</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+380 __ ___ __ __" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Місто</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} placeholder="Київ" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Адреса / відділення</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Відділення №12 або вул. Хрещатик, 1" />
            </div>
            <div className="sm:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-amber-500/25">
                {saving ? 'Збереження...' : 'Зберегти'}
              </button>
              <button type="button" onClick={() => { setEditing(false); setForm({ name: user.name || '', phone: user.phone || '', city: user.city || '', address: user.address || '' }); }} className="px-6 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 rounded-xl font-medium transition-all border border-white/[0.1]">
                Скасувати
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Замовлення */}
      <Link
        to="/orders"
        className="glass-card p-6 flex items-center justify-between gap-4 group"
      >
        <div>
          <h2 className="text-xl font-bold text-white">📦 Мої замовлення</h2>
          <p className="text-sm text-slate-400 mt-1">Переглянути історію та статус замовлень</p>
        </div>
        <span className="text-slate-400 group-hover:text-amber-400 transition-colors text-2xl">→</span>
      </Link>
    </div>
  );
}

export default ProfilePage;
