import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';

const categories = ['Художня література', 'Наукова література', 'Дитячі книги', 'Комікси', 'Навчальна література'];

const categoryIcons = {
  'Художня література': '📖',
  'Наукова література': '🔬',
  'Дитячі книги': '🧸',
  'Комікси': '💥',
  'Навчальна література': '🎓',
};

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  // Завантаження книг
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.category = category;

        const { data } = await api.get('/books', { params });
        setBooks(data.books);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Помилка завантаження книг:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, search, category]);

  // Пошук по Enter або кнопці
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Зміна категорії
  const handleCategoryChange = (cat) => {
    setCategory(cat === category ? '' : cat);
    setPage(1);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Hero та Пошук (в одному рядку на десктопі) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 mt-1 fade-in-up">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">Книжковий каталог</h1>
          <p className="hidden sm:block text-slate-400 text-sm">Знайдіть книгу на будь-який смак ✨</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-[400px] shrink-0">
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-amber-500/25 btn-glow"
          >
            Знайти
          </button>
        </form>
      </div>

      {/* Категорії */}
      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
        <button
          onClick={() => { setCategory(''); setPage(1); }}
          className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
            !category
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
              : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-slate-200 border border-white/[0.06]'
          }`}
        >
          ✦ Всі
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-slate-200 border border-white/[0.06]'
            }`}
          >
            {categoryIcons[cat] || '📚'} {cat}
          </button>
        ))}
      </div>

      {/* Завантаження */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 fade-in-up">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-xl text-slate-400">Книг не знайдено</p>
          <p className="text-slate-500 mt-2">Спробуйте змінити параметри пошуку</p>
        </div>
      ) : (
        <>
          {/* Сітка книг */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-4 lg:gap-5 items-stretch">
          {books.map((book, index) => (
            <div key={book._id} className="card-animate flex flex-col w-full h-full" style={{ animationDelay: `${index * 50}ms` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>

          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    page === p
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.12] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/[0.06]"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;
