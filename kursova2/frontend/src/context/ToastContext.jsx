import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: { icon: '✓', color: 'text-emerald-400' },
    error: { icon: '✕', color: 'text-red-400' },
    info: { icon: 'ℹ', color: 'text-amber-400' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast контейнер */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-enter pointer-events-auto flex items-center gap-3 bg-slate-800/90 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl px-4 py-3 min-w-[280px] max-w-[400px]"
          >
            <span className={`text-lg font-bold ${icons[toast.type]?.color || 'text-amber-400'}`}>
              {icons[toast.type]?.icon || 'ℹ'}
            </span>
            <span className="flex-1 text-sm text-slate-200">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
