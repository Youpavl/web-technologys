// Картка однієї книги
function BookCard({ book, onEdit, onDelete }) {
  // Рахую ціну зі знижкою (якщо вона є)
  const finalPrice =
    book.discount > 0
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;

  return (
    <div className="card">
      <div className="card-image">
        <img
          src={book.image || 'https://placehold.co/300x450?text=Без+фото'}
          alt={book.title}
        />
        {book.discount > 0 && <span className="badge-discount">-{book.discount}%</span>}
        <span className="badge-category">{book.category}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-desc">{book.description}</p>

        <ul className="card-props">
          <li>
            <span className={book.stock > 0 ? 'in-stock' : 'out-stock'}>
              {book.stock > 0 ? `На складі: ${book.stock} шт` : 'Немає в наявності'}
            </span>
          </li>
        </ul>

        <div className="card-price">
          {book.discount > 0 && <span className="old-price">{book.price} грн</span>}
          <span className="final-price">{finalPrice} грн</span>
        </div>

        <div className="card-actions">
          <button className="btn btn-edit" onClick={() => onEdit(book)}>
            ✎ Редагувати
          </button>
          <button className="btn btn-delete" onClick={() => onDelete(book)}>
            🗑 Видалити
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
