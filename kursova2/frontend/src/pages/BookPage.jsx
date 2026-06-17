import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
      } catch (error) {
        showToast('Книгу не знайдено', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!book) return null;

  const isInCart = cartItems.some((item) => item.book._id === book._id);
  
  const handleAddToCart = () => {
    addToCart(book);
    showToast(`"${book.title}" додано в кошик`, 'success');
  };

  const finalPrice = book.discount > 0
    ? Math.round(book.price * (1 - book.discount / 100))
    : book.price;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Ліва колонка: Обкладинка (editorial style) */}
        <div className="md:col-span-5 relative group perspective-[1000px] flex justify-center">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative book-3d w-[80%] max-w-[320px] aspect-[2/3] z-10 transition-transform duration-700 group-hover:rotate-y-[-10deg]">
            <img 
              src={book.image || 'https://placehold.co/400x600/0e1730/f59e0b?text=Без+фото'} 
              alt={book.title}
              className="w-full h-full object-cover rounded-md shadow-[10px_10px_30px_rgba(0,0,0,0.6),-2px_0_0_#ffffff40] border-l-2 border-white/20"
            />
            {/* Ефект сторінок */}
            <div className="absolute top-0 right-0 h-full w-[6px] bg-slate-200 origin-right translate-x-full skew-y-[10deg] opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

            {book.discount > 0 && (
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-rose-500 to-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(225,29,72,0.5)] transform rotate-12 group-hover:scale-110 transition-transform">
                -{book.discount}%
              </div>
            )}
          </div>
        </div>

        {/* Права колонка: Інформація */}
        <div className="md:col-span-7 flex flex-col pt-4">
          <p className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-2">{book.category}</p>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
            {book.title}
          </h1>
          
          <h2 className="text-xl md:text-2xl text-slate-300 font-light italic mb-8 border-b border-white/10 pb-6">
            <span className="text-slate-500 not-italic text-lg">Автор:</span> {book.author || 'Невідомий автор'}
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-baseline gap-3">
              {book.discount > 0 ? (
                <>
                  <span className="text-4xl font-black text-white">{finalPrice}</span>
                  <span className="text-2xl font-light text-slate-500 line-through">{book.price}</span>
                  <span className="text-lg text-slate-400">грн</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-black text-white">{book.price}</span>
                  <span className="text-lg text-slate-400">грн</span>
                </>
              )}
            </div>
          </div>

          {/* Характеристики (сітка) */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Видавництво</p>
              <p className="text-slate-200 font-medium">{book.publisher || 'Не вказано'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Сторінок</p>
              <p className="text-slate-200 font-medium">{book.pages ? `${book.pages} стор.` : 'Не вказано'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Наявність</p>
              <p className={`font-medium ${book.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {book.stock > 0 ? `${book.stock} шт. на складі` : 'Немає в наявності'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Артикул</p>
              <p className="text-slate-200 font-medium font-mono text-sm">{book._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className={`flex-1 px-8 py-4 rounded-xl text-lg font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                isInCart
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  : 'bg-white text-black hover:bg-amber-500 hover:text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]'
              }`}
            >
              {book.stock === 0 ? (
                'Розпродано'
              ) : isInCart ? (
                <>✓ <span className="text-sm">Вже у кошику</span></>
              ) : (
                'Додати в кошик'
              )}
            </button>

            {book.previewPages && book.previewPages.length > 0 && (
              <button
                onClick={() => setShowPreview(true)}
                className="flex-1 px-8 py-4 rounded-xl text-lg font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.1]"
              >
                📖 Читати фрагмент
              </button>
            )}
          </div>

          {/* Опис */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Про книгу</h3>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              {book.description}
            </p>
          </div>

        </div>
      </div>

      {/* Модальне вікно для фрагмента */}
      {showPreview && book.previewPages && book.previewPages.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8">
          <button 
            onClick={() => { setShowPreview(false); setCurrentPreviewPage(0); }}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50"
          >
            ✕
          </button>
          
          <div className="relative w-full max-w-4xl h-full max-h-[85vh] flex items-center justify-center">
            {/* Кнопка Вліво */}
            <button 
              onClick={() => setCurrentPreviewPage(p => Math.max(0, p - 1))}
              disabled={currentPreviewPage === 0}
              className="absolute left-0 sm:-left-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-0 z-50"
            >
              ←
            </button>
            
            <img 
              src={book.previewPages[currentPreviewPage]} 
              alt={`Сторінка ${currentPreviewPage + 1}`} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-md"
            />
            
            {/* Кнопка Вправо */}
            <button 
              onClick={() => setCurrentPreviewPage(p => Math.min(book.previewPages.length - 1, p + 1))}
              disabled={currentPreviewPage === book.previewPages.length - 1}
              className="absolute right-0 sm:-right-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-0 z-50"
            >
              →
            </button>
            
            {/* Індикатор сторінок */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-400 font-medium">
              Сторінка {currentPreviewPage + 1} з {book.previewPages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookPage;
