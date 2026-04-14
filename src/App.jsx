import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AdminLoginPage from './AdminLoginPage';
import KeranjangPage from './KeranjangPage';
import ProfilPage from './ProfilPage';
import PaymentPage from './PaymentPage';
import ProductPage from './ProductPage';
import OrdersPage from './OrdersPage';
import PaymentResultPage from './PaymentResultPage';
import AdminPage from './AdminPage';
import Footer from './Footer';
import heroImage from './assets/wallpaper-cake-merah.jpeg';
import cakeIcon from './assets/cake.png';
import { api } from './lib/api';
import { useApp } from './context/AppContext';

function ProtectedRoute({ children, adminOnly = false, loginPath = '/login' }) {
  const { authReady, isAuthenticated, isAdmin } = useApp();
  const location = useLocation();

  if (!authReady) {
    return <div style={{ paddingTop: 120, textAlign: 'center' }}>Menyiapkan sesi...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ redirectTo: `${location.pathname}${location.search}` }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await api.getProducts();
        const productList = Array.isArray(response)
          ? response
          : (Array.isArray(response?.data) ? response.data : []);

        if (active) {
          setProducts(productList);
          setErrorMessage(
            productList.length === 0 && !Array.isArray(response)
              ? 'Format data produk dari server tidak sesuai.'
              : '',
          );
        }
      } catch (error) {
        if (active) {
          setProducts([]);
          setErrorMessage(error?.message || 'Gagal memuat katalog.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <img src={heroImage} alt="Hero" />
      </div>

      <div className="menu-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 10 }}>
          <div className="line"></div>
          <div className="menu-icon-top">
            <img src={cakeIcon} alt="Cake Icon" style={{ height: '50px', width: 'auto' }} />
          </div>
          <div className="line"></div>
        </div>
        <div className="menu-title-wrapper">
          <h2 className="menu-title">Menu</h2>
          <div className="vertical-line"></div>
          <p className="menu-subtitle">Apa yang anda inginkan?</p>
        </div>

        {loading ? <p>Memuat katalog...</p> : null}
        {!loading && errorMessage ? <p>{errorMessage}</p> : null}

        <div className="menu-grid">
          {products.map((item) => (
            <Link to={`/${item.slug}`} key={item.id} className="card-link">
              <div className="card">
                <div className="image-container">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="item-name-tag">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="why-section">
        <div className="line" style={{ marginBottom: '30px' }}></div>
          <h2 className="why-title">Kenapa Memilih Kami?</h2>
          <p className="why-desc">Kami menghadirkan kue terbaik dengan sistem pre-order yang fresh & berkualitas</p>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">🍰</span>
              <div className="why-text">
                <h3>Fresh by Order</h3>
                <p>Dibuat setelah dipesan, selalu fresh & higienis</p>
              </div>
            </div>
            <div className="why-card">
              <span className="why-icon">⭐</span>
              <div className="why-text">
                <h3>Bahan Premium</h3>
                <p>Menggunakan bahan berkualitas tinggi</p>
              </div>
            </div>
            <div className="why-card">
              <span className="why-icon">🕒</span>
              <div className="why-text">
                <h3>Estimasi Jelas</h3>
                <p>Waktu pembuatan transparan & tepat</p>
              </div>
            </div>
            <div className="why-card">
              <span className="why-icon">💳</span>
              <div className="why-text">
                <h3>Pembayaran QRIS Praktis</h3>
                <p>Bayar lebih mudah dengan QRIS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/admin/login'];

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/keranjang"
          element={(
            <ProtectedRoute>
              <KeranjangPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profil"
          element={(
            <ProtectedRoute>
              <ProfilPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pesanan"
          element={(
            <ProtectedRoute>
              <OrdersPage filter="all" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pesanan/proses"
          element={(
            <ProtectedRoute>
              <OrdersPage filter="processing" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pesanan/dibatalkan"
          element={(
            <ProtectedRoute>
              <OrdersPage filter="cancelled" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/pesanan/selesai"
          element={(
            <ProtectedRoute>
              <OrdersPage filter="completed" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/payment"
          element={(
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/payment/:result"
          element={(
            <ProtectedRoute>
              <PaymentResultPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute adminOnly loginPath="/admin/login">
              <AdminPage />
            </ProtectedRoute>
          )}
        />
        <Route path="/:slug" element={<ProductPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
