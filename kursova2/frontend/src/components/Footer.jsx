import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-8 mt-auto">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Logo size={22} textClass="text-sm" />
            <p className="text-xs text-slate-500 mt-1">Книжковий онлайн-магазин © 2026</p>
          </div>
          <nav className="flex gap-6">
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">Каталог</Link>
            <Link to="/cart" className="text-xs text-slate-400 hover:text-white transition-colors">Кошик</Link>
            <a href="mailto:support@litera.ua" className="text-xs text-slate-400 hover:text-white transition-colors">Контакти</a>
          </nav>
          <p className="text-xs text-slate-500">Курсова робота Івашківа П.В.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
