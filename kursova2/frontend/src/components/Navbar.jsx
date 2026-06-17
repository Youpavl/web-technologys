import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import Logo from './Logo';

function Navbar() {
  const { user, logout } = useAuth();
  const { getCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="w-full bg-black/60 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Десктоп меню */}
          <div className="hidden min-[550px]:flex items-center gap-4 lg:gap-6">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors font-medium">
              Каталог
            </Link>

            {user && (
              <Link to="/orders" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">
                Мої замовлення
              </Link>
            )}

            {user?.role === 'admin' && (
              <>
                <Link to="/admin/books" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">
                  Книги
                </Link>
                <Link to="/admin/orders" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">
                  Замовлення
                </Link>
              </>
            )}

            {/* Кошик */}
            <Link to="/cart" className="relative text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {getCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                  {getCount()}
                </span>
              )}
            </Link>

            {/* Авторизація */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="text-slate-400 hover:text-white transition-colors font-medium text-sm">
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 px-3 py-1.5 rounded-lg transition-all border border-white/[0.08]"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-slate-400 hover:text-white font-medium transition-colors">
                  Увійти
                </Link>
                <Link to="/register" className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-amber-500/25">
                  Реєстрація
                </Link>
              </div>
            )}
          </div>

          {/* Мобільна кнопка */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="min-[550px]:hidden text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобільне меню */}
        {menuOpen && (
          <div className="min-[550px]:hidden pb-4 border-t border-white/[0.08] pt-4 flex flex-col gap-3">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Каталог</Link>
            <Link to="/cart" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
              Кошик ({getCount()})
            </Link>
            {user && (
              <Link to="/orders" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                Мої замовлення
              </Link>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/books" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Управління книгами</Link>
                <Link to="/admin/orders" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Замовлення</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/profile" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>{user.name}</Link>
                <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition-colors">Вийти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Увійти</Link>
                <Link to="/register" className="text-amber-400 font-medium hover:text-amber-300 transition-colors" onClick={() => setMenuOpen(false)}>Реєстрація</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
