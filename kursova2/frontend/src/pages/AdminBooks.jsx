import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';

const categories = ['Художня література', 'Наукова література', 'Дитячі книги', 'Комікси', 'Навчальна література'];

const emptyForm = { title: '', description: '', price: '', discount: '0', stock: '', image: '', category: categories[0], author: '', publisher: '', pages: '' };

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const { showToast } = useToast();

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books', { params: { limit: 100 } });
      setBooks(data.books);
    } catch (error) {
      console.error('Помилка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount),
        stock: Number(form.stock),
        pages: Number(form.pages) || 0
      };

      if (editingId) {
        await api.put(`/books/${editingId}`, bookData);
        showToast('Книгу оновлено ✓', 'success');
      } else {
        await api.post('/books', bookData);
        showToast('Книгу додано ✓', 'success');
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchBooks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Помилка збереження', 'error');
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      description: book.description,
      price: book.price.toString(),
      discount: book.discount.toString(),
      stock: book.stock.toString(),
      image: book.image || '',
      category: book.category,
      author: book.author || '',
      publisher: book.publisher || '',
      pages: book.pages ? book.pages.toString() : '0'
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/books/${deleteId}`);
      showToast('Книгу видалено', 'info');
      fetchBooks();
    } catch (error) {
      showToast('Помилка видалення', 'error');
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const inputClass = "w-full px-4 py-2 bg-white/[0.08] border border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all";

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">📚 Управління книгами</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-amber-500/25 btn-glow"
        >
          {showForm ? 'Сховати форму' : '+ Додати книгу'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">
            {editingId ? 'Редагувати книгу' : 'Нова книга'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-400 mb-1">Назва</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-400 mb-1">Автор</label>
              <input name="author" value={form.author} onChange={handleChange} required className={inputClass} placeholder="Ім'я автора" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-400 mb-1">Опис</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={inputClass} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Видавництво</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Кількість сторінок</label>
              <input name="pages" type="number" min="0" value={form.pages} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Категорія</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Ціна (грн)</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Знижка (%)</label>
              <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Кількість на складі</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-400 mb-1">URL зображення</label>
              <input name="image" value={form.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>

            <div className="md:col-span-3 flex gap-3 mt-2">
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-amber-500/25">
                {editingId ? 'Зберегти' : 'Додати'}
              </button>
              <button type="button" onClick={handleCancel} className="px-6 py-2 bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 rounded-xl transition-all border border-white/[0.08]">
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-400 border-t-transparent"></div>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.08]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-400">Назва</th>
                <th className="text-left px-4 py-3 font-medium text-slate-400">Автор</th>
                <th className="text-left px-4 py-3 font-medium text-slate-400">Категорія</th>
                <th className="text-right px-4 py-3 font-medium text-slate-400">Ціна</th>
                <th className="text-right px-4 py-3 font-medium text-slate-400">Склад</th>
                <th className="text-center px-4 py-3 font-medium text-slate-400">Дії</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">{book.title}</td>
                  <td className="px-4 py-3 text-slate-300 max-w-[150px] truncate">{book.author || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">{book.category}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{book.price} грн</td>
                  <td className="px-4 py-3 text-right text-slate-300">{book.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(book)} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                        Редагувати
                      </button>
                      <button onClick={() => setDeleteId(book._id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Видалити книгу?"
        message="Ця книга буде видалена назавжди. Цю дію не можна скасувати."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default AdminBooks;
