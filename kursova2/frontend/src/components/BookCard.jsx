import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function BookCard({ book }) {
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();

  const isInCart = cartItems.some((item) => item.book._id === book._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    showToast(`"${book.title}" додано в кошик`, 'success');
  };

  const finalPrice = book.discount > 0
    ? Math.round(book.price * (1 - book.discount / 100))
    : book.price;

  return (
    <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl flex flex-row sm:flex-col group overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.16] hover:shadow-2xl hover:-translate-y-1 h-full w-full flex-1 relative">
      {/* Обкладинка */}
      <Link to={`/books/${book._id}`} className="relative block overflow-hidden sm:aspect-[4/5] w-[90px] sm:w-full shrink-0 bg-white/[0.02]">
        <img
          src={book.image || 'https://placehold.co/300x450/0e1730/f59e0b?text=Без+фото'}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-80 hidden sm:block" />
        
        {book.discount > 0 && (
          <span className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-amber-500 text-slate-900 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-lg">
            -{book.discount}%
          </span>
        )}
      </Link>

      {/* Інформація */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 relative bg-gradient-to-b sm:from-[#0b1120] to-transparent">
        <div className="mb-auto">
          {/* Автор */}
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 mb-1 line-clamp-1">
            {book.author || 'Невідомий автор'}
          </p>

          {/* Назва */}
          <Link to={`/books/${book._id}`} className="block">
            <h3 className="font-semibold text-white text-base sm:text-lg leading-snug line-clamp-2 mb-2 sm:mb-3 hover:text-amber-400 transition-colors">
              {book.title}
            </h3>
          </Link>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white/5 text-slate-400 line-clamp-1">
              {book.category}
            </span>
            {book.pages > 0 && (
              <span className="hidden sm:inline-block text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-400">
                {book.pages} стор.
              </span>
            )}
          </div>
        </div>

        {/* Нижня частина */}
        <div className="mt-2">
          <div className="flex items-end justify-between gap-2 mb-3 sm:mb-4">
            <div className="flex flex-col leading-tight">
              {book.discount > 0 && (
                <span className="text-xs text-slate-500 line-through mb-0.5">{book.price} грн</span>
              )}
              <span className="text-lg sm:text-xl font-bold text-white">
                {finalPrice} <span className="text-xs sm:text-sm font-normal text-slate-400">грн</span>
              </span>
            </div>
            <span className={`shrink-0 whitespace-nowrap text-right text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide ${book.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {book.stock > 0 ? 'В наявності' : 'Немає'}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
              isInCart
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.05] hover:border-white/[0.15]'
            }`}
          >
            {book.stock === 0 ? 'РОЗПРОДАНО' : isInCart ? '✓ В КОШИКУ' : 'В КОШИК'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
