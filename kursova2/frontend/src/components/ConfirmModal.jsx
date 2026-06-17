function ConfirmModal({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="modal-enter bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🗑️</div>
          <h3 className="text-lg font-bold text-white">{title || 'Підтвердження'}</h3>
          <p className="text-slate-400 text-sm mt-2">{message || 'Ви впевнені?'}</p>
        </div>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 rounded-xl transition-all text-sm font-medium border border-white/[0.08]"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-red-500/20"
          >
            Так, видалити
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
