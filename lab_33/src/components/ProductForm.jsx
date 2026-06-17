import { useState } from 'react';

function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'electronics',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.description) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }

    if (formData.title.length < 3 || formData.title.length > 50) {
      alert('Назва товару має бути від 3 до 50 символів');
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Ціна має бути числом більше 0');
      return;
    }

    if (formData.description.length < 10 || formData.description.length > 300) {
      alert('Опис товару має бути від 10 до 300 символів');
      return;
    }

    const newProduct = {
      id: crypto.randomUUID(),
      title: formData.title,
      price: priceNum,
      category: formData.category,
      description: formData.description,
    };

    console.log('Додано новий товар:', newProduct);

    onAddProduct(newProduct);

    setFormData({
      title: '',
      price: '',
      category: 'electronics',
      description: '',
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Створення товару</h2>

      <div className="form-group">
        <label>Назва товару:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Введіть назву (3-50 символів)"
        />
      </div>

      <div className="form-group">
        <label>Ціна:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Введіть ціну"
        />
      </div>

      <div className="form-group">
        <label>Категорія:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="electronics">Electronics</option>
          <option value="clothes">Clothes</option>
          <option value="books">Books</option>
        </select>
      </div>

      <div className="form-group">
        <label>Опис:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Введіть опис (10-300 символів)"
        />
      </div>

      <button type="submit" className="submit-btn">Додати товар</button>
    </form>
  );
}

export default ProductForm;
