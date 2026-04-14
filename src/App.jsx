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
import TentangKamiPage from './TentangKamiPage';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Extract unique categories from products database
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

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

        {loading ? <p>Memuat katalog...</p> : (
          <>
            {errorMessage ? (
              <p style={{ textAlign: 'center', color: '#a83232', marginBottom: 20 }}>{errorMessage}</p>
            ) : null}
            {/* Filter Section */}
            <div className="filter-section" style={{ marginBottom: 30 }}>
              {/* Search Bar */}
              <div className="search-bar" style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  placeholder="Cari kue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: 25,
                    border: '2px solid #ddd',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div className="category-filter" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: 20,
                        border: 'none',
                        backgroundColor: selectedCategory === cat ? '#a83232' : '#f0e0c8',
                        color: selectedCategory === cat ? 'white' : '#5c3d2e',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s',
                      }}
                    >
                      {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="sort-filter" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSortBy('default')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 15,
                    border: sortBy === 'default' ? '2px solid #a83232' : '1px solid #ddd',
                    backgroundColor: sortBy === 'default' ? '#a83232' : 'white',
                    color: sortBy === 'default' ? 'white' : '#5c3d2e',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Default
                </button>
                <button
                  onClick={() => setSortBy('name-asc')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 15,
                    border: sortBy === 'name-asc' ? '2px solid #a83232' : '1px solid #ddd',
                    backgroundColor: sortBy === 'name-asc' ? '#a83232' : 'white',
                    color: sortBy === 'name-asc' ? 'white' : '#5c3d2e',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setSortBy('name-desc')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 15,
                    border: sortBy === 'name-desc' ? '2px solid #a83232' : '1px solid #ddd',
                    backgroundColor: sortBy === 'name-desc' ? '#a83232' : 'white',
                    color: sortBy === 'name-desc' ? 'white' : '#5c3d2e',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Z-A
                </button>
              </div>
            </div>

            {/* Results count */}
            {searchQuery || selectedCategory !== 'all' ? (
              <p style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
                Menampilkan {filteredProducts.length} dari {products.length} kue
              </p>
            ) : null}
          </>
        )}

        <div className="menu-grid">
          {filteredProducts.map((item) => (
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

        {filteredProducts.length === 0 && !loading ? (
          <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            Tidak ada kue yang ditemukan
          </p>
        ) : null}

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
        <Route path="/tentang-kami" element={<TentangKamiPage />} />
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
