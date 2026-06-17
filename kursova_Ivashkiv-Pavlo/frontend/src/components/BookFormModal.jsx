import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Художня література',
  'Наукова література',
  'Дитячі книги',
  'Комікси',
  'Навчальна література',
];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discount: '0',
  stock: '',
  image: '',
  category: CATEGORIES[0],
};

// Одне вікно і на додавання, і на редагування (відрізняю по editingBook)
function BookFormModal({ isOpen, editingBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Коли редагую - підставляю дані книги, коли додаю - порожня форма
  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        description: editingBook.description,
        price: String(editingBook.price),
        discount: String(editingBook.discount),
        stock: String(editingBook.stock),
        image: editingBook.image || '',
        category: editingBook.category,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Перевіряю поля перед відправкою; повертає true, якщо все добре
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Введіть назву книги';
    else if (form.title.trim().length < 2) e.title = 'Назва занадто коротка';

    if (!form.description.trim()) e.description = 'Введіть опис';
    else if (form.description.trim().length < 10) e.description = 'Опис має містити щонайменше 10 символів';

    if (form.price === '' || Number(form.price) <= 0) e.price = 'Ціна має бути більшою за 0';

    const discount = Number(form.discount);
    if (form.discount === '' || discount < 0 || discount > 100) e.discount = 'Знижка від 0 до 100';

    if (form.stock === '' || Number(form.stock) < 0) e.stock = "Кількість не може бути від'ємною";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      image: form.image.trim(),
      category: form.category,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {editingBook ? 'Редагувати книгу' : 'Нова книга'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Назва</label>
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Опис</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ціна (грн)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label>Знижка (%)</label>
              <input type="number" name="discount" value={form.discount} onChange={handleChange} />
              {errors.discount && <span className="error">{errors.discount}</span>}
            </div>
            <div className="form-group">
              <label>На складі</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} />
              {errors.stock && <span className="error">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Категорія</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Посилання на зображення</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="/images/books/... або https://..." />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {editingBook ? 'Зберегти' : 'Додати'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;
