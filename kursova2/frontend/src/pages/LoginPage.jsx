import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Введіть email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Некоректний email';
    if (!password) e.password = 'Введіть пароль';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Дані форми навмисно НЕ очищуються, щоб користувач міг виправити
      setError(err.response?.data?.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) => `w-full px-4 py-3 bg-white/[0.05] border text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 transition-all ${
    errors[name]
      ? 'border-rose-500/60 focus:ring-rose-500/40'
      : 'border-white/[0.1] focus:ring-amber-400/50 focus:border-amber-400/50'
  }`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 fade-in-up">
      <div className="glass-card p-8 w-full max-w-md border border-white/[0.08] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">З поверненням</h1>
          <p className="text-slate-400">Увійдіть до свого акаунту</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              className={fieldClass('email')}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              className={fieldClass('password')}
              placeholder="••••••"
            />
            {errors.password && <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-bold tracking-wide transition-all disabled:opacity-50 shadow-lg shadow-amber-500/25 btn-glow"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Немає акаунту? <Link to="/register" className="text-amber-400 hover:text-amber-300 hover:underline font-medium ml-1">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
