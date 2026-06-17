import { useState, useEffect, useCallback } from 'react';
import api from './api';
import BookCard from './components/BookCard';
import BookFormModal from './components/BookFormModal';
import ConfirmModal from './components/ConfirmModal';

const CATEGORIES = [
  'Художня література',
  'Наукова література',
  'Дитячі книги',
  'Комікси',
  'Навчальна література',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Спочатку нові' },
  { value: 'price_asc', label: 'Ціна: від дешевших' },
  { value: 'price_desc', label: 'Ціна: від дорожчих' },
  { value: 'title_asc', label: 'Назва: А–Я' },
  { value: 'title_desc', label: 'Назва: Я–А' },
];

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Те, що користувач задає на панелі: пошук, категорія, сортування і номер сторінки
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Яке з модальних вікон зараз відкрите
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Тягну книги з сервера; useCallback - щоб функція не створювалась наново щоразу
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/books', {
        params: { search, category, sort, page, limit: 8 },
      });
      setBooks(data.books);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError('Не вдалося завантажити книги. Перевірте, чи запущено сервер.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Якщо змінено пошук/категорію/сортування - логічно починаю знову з 1-ї сторінки
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  // Зберігаю книгу: якщо є editingBook - оновлюю (PUT), інакше створюю (POST)
  const handleSave = async (bookData) => {
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, bookData);
      } else {
        await api.post('/books', bookData);
      }
      setShowForm(false);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка збереження');
    }
  };

  // Видаляю книгу (після підтвердження у вікні)
  const handleDelete = async () => {
    try {
      await api.delete(`/books/${deletingBook._id}`);
      setDeletingBook(null);
      // Якщо це була остання книга на сторінці, повертаюся на сторінку назад
      if (books.length === 1 && page > 1) setPage(page - 1);
      else fetchBooks();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  const openCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <h1 className="logo">📚 Litera</h1>
          <button className="btn btn-primary" onClick={openCreate}>
            + Додати книгу
          </button>
        </div>
      </header>

      <main className="container">
        {/* Панель: пошук, фільтр категорії, сортування */}
        <div className="toolbar">
          <input
            className="toolbar-search"
            type="text"
            placeholder="Пошук за назвою або описом..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Усі категорії</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading && <p className="info">Завантаження...</p>}
        {error && <p className="info error">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="info">Книг не знайдено.</p>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <p className="result-count">Знайдено книг: {total}</p>

            <div className="grid">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onEdit={openEdit}
                  onDelete={setDeletingBook}
                />
              ))}
            </div>

            {/* Пагінація */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Назад
                </button>
                <span className="page-info">
                  Сторінка {page} з {pages}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                >
                  Далі →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BookFormModal
        isOpen={showForm}
        editingBook={editingBook}
        onSubmit={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingBook(null);
        }}
      />

      <ConfirmModal
        isOpen={deletingBook !== null}
        title="Видалити книгу?"
        message={`Книга «${deletingBook?.title}» буде видалена назавжди.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBook(null)}
      />
    </div>
  );
}

export default App;
