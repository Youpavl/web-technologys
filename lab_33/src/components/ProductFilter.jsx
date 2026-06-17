function ProductFilter({ filterCategory, onChangeCategory }) {
  return (
    <div className="product-filter">
      <label>Фільтр за категорією:</label>
      <select value={filterCategory} onChange={(e) => onChangeCategory(e.target.value)}>
        <option value="all">Всі категорії</option>
        <option value="electronics">Electronics</option>
        <option value="clothes">Clothes</option>
        <option value="books">Books</option>
      </select>
    </div>
  );
}

export default ProductFilter;
