// Вікно підтвердження перед видаленням книги
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-small" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <p className="confirm-text">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Видалити
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
