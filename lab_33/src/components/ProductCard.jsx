function ProductCard({ product, onAddToCart }) {
  const { id, title, price, category, description } = product;

  const handleAddToCart = () => {
    console.log(`Продукт з id: ${id} додано в кошик`);
    onAddToCart(id);
  };

  return (
    <div className="product-card">
      <h3>{title}</h3>
      <p className="product-price">{price} грн</p>
      <span className="product-category">{category}</span>
      <p className="product-description">{description}</p>
      <button className="cart-btn" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  );
}

export default ProductCard;
