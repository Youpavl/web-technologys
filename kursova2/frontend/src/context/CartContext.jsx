import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Завантаження кошика з localStorage
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Збереження кошика в localStorage при кожній зміні
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Додати книгу в кошик
  const addToCart = (book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book._id === book._id);
      if (existing) {
        return prev.map((item) =>
          item.book._id === book._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  // Видалити книгу з кошика
  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.book._id !== bookId));
  };

  // Змінити кількість
  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.book._id === bookId ? { ...item, quantity } : item
      )
    );
  };

  // Очистити кошик
  const clearCart = () => {
    setCartItems([]);
  };

  // Загальна сума
  const getTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.book.discount > 0
        ? Math.round(item.book.price * (1 - item.book.discount / 100))
        : item.book.price;
      return sum + price * item.quantity;
    }, 0);
  };

  // Кількість товарів
  const getCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
