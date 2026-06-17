import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductFilter from './ProductFilter';
import ProductList from './ProductList';

function App() {
  const [products, setProducts] = useState([]);

  const [filterCategory, setFilterCategory] = useState('all');

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleChangeCategory = (category) => {
    setFilterCategory(category);
  };

  const handleAddToCart = (productId) => {
  };

  const filteredProducts =
    filterCategory === 'all'
      ? products
      : products.filter((p) => p.category === filterCategory);

  return (
    <div className="app">
      <h1 className="app-title">🛒 Product Module</h1>

      <ProductForm onAddProduct={handleAddProduct} />

      <ProductFilter
        filterCategory={filterCategory}
        onChangeCategory={handleChangeCategory}
      />

      <ProductList
        products={filteredProducts}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
