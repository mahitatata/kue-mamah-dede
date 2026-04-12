import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import PesananPage from './PesananPage';
import KeranjangPage from './KeranjangPage';
import ProfilPage from './ProfilPage';
import PaymentPage from './PaymentPage';

import CheesecakePage from './CheesecakePage';
import PortionCakePage from './PortionCakePage';
import CupcakePage from './CupcakePage';
import TiramisuPage from './TiramisuPage';
import PancakePage from './PancakePage';
import WholeCakePage from './WholeCakePage';

import ProsesPage from './ProsesPage';
import DibatalkanPage from './DibatalkanPage';
import SelesaiPage from './SelesaiPage';

import heroImage from './assets/wallpaper-cake-merah.jpeg';
import strawberry from './assets/strawberry-shortcake.jpeg';
import cupcake from './assets/cupcake2.jpeg';
import wholeCake from './assets/whole-cake2.jpeg';
import pancake from './assets/pancake.jpeg';
import tiramisuCake from './assets/tiramisu-cake.jpeg';
import cheesecake from './assets/cheesecake2.jpeg';

// 1. KOMPONEN HALAMAN DETAIL
function Detailpage() {
  return (
    <div style={{ padding: '100px 50px', textAlign: 'center' }}>
      <h1>Halaman Detail Produk</h1>
      <Link to="/" style={{ color: '#A12628', fontWeight: 'bold' }}>Kembali ke Beranda</Link>
    </div>
  );
}

// 2. KOMPONEN HALAMAN BERANDA (Isi utama web kamu dipindah ke sini)
function HomePage({ menu }) {
  return (
    <div className="container">
      <div className="hero">
        <img src={heroImage} alt="Hero" />
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
          <div className="line"></div>
          <div className="menu-icon-top">🍰</div>
          <div className="line"></div>
        </div>
        <div className="menu-title-wrapper">
          <h2 className="menu-title">Menu</h2>
          <div className="vertical-line"></div>
          <p className="menu-subtitle">Apa yang anda inginkan?</p>
        </div>

        <div className="menu-grid">
          {menu.map((item, index) => (
            <Link to={`/${item.id}`} key={index} className="card-link">
            <div className="card">
              <div className="image-container">
                <img src={item.img} alt={item.nama} />
              </div>
              <div className="item-name-tag">{item.nama}</div>
            </div>
          </Link>
        ))}
      </div>

        {/* Kenapa Memilih Kami */}
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

        {/* Brand Banner */}
        <div className="footer-wrapper">
         <div className="brand-banner">
          <h1>CakeTime</h1>
        </div>

        {/* Footer Info Section */}
        <footer className="footer-container">
          <div className="footer-col">
            <h3>Tentang Kami</h3>
            <p>Kami menyediakan berbagai kue fresh dengan sistem pre-order (PO), dibuat khusus untuk setiap pelanggan. Dengan bahan pilihan dan rasa yang lezat, kami siap menemani momen spesial Anda. Pesan mudah, bayar cukup dengan QRIS!</p>
          </div>
          <div className="footer-col">
            <h3>Kontak</h3>
            <p>📍 Jakarta, Indonesia</p>
            <p>📞 +62 812-888-888</p>
            <p>✉️ caketime@gmail.com</p>
            <p>🕒 Sen - Sab | 08:00 - 20:00</p>
          </div>
          <div className="footer-col">
          <h3>Sosial Media</h3>
          <div className="social-links">
            <a href="https://instagram.com/CakeTime_" target="_blank" rel="noreferrer" className="instagram-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 
                4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@CakeTime_</span>
            </a>
          </div>
        </div>
        </footer>
        <p className="copyright-text">© 2026 CakeTime. All rights reserved.</p>
      </div>
      </div> 
      </div>
  );
}

function App() {
  const menu = [
    { nama: "Strawberry shortcake", img: strawberry, id: "portion-cake" },
    { nama: "Cupcake", img: cupcake, id: "cupcake" },
    { nama: "Whole Cake", img: wholeCake, id: "whole-cake" },
    { nama: "Strawberry Pancake", img: pancake, id: "pancake" },
    { nama: "Tiramisu Cake", img: tiramisuCake, id: "tiramisu-cake" },
    { nama: "Cheesecake", img: cheesecake, id: "cheesecake" },
  ];

  return (
    <Router>
      <AppContent menu={menu} />
    </Router>
  );
}

  function AppContent({ menu }) {
  const location = useLocation(); 
  const hideNavbarPaths = ['/login', '/register'];
  return (
    <>
    {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage menu={menu} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/portion-cake" element={<PortionCakePage />} />
        <Route path="/cupcake" element={<CupcakePage />} />
        <Route path="/whole-cake" element={<WholeCakePage />} />
        <Route path="/pancake" element={<PancakePage />} />
        <Route path="/tiramisu-cake" element={<TiramisuPage />} />
        <Route path="/cheesecake" element={<CheesecakePage />} />
        <Route path="/keranjang" element={<KeranjangPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/pesanan" element={<PesananPage />} />
        <Route path="/pesanan/proses" element={<ProsesPage />} />
        <Route path="/pesanan/dibatalkan" element={<DibatalkanPage />} />
        <Route path="/pesanan/selesai" element={<SelesaiPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </>
  );
}

export default App;