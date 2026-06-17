import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminBooks from './pages/AdminBooks';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="w-full min-h-screen flex flex-col">
              <Navbar />
              <main className="w-full flex-1 py-4">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books/:id" element={<BookPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute><OrdersPage /></ProtectedRoute>
                  } />
                  <Route path="/admin/books" element={
                    <ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
