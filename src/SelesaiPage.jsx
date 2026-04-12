import React from 'react';
import { Link } from 'react-router-dom';
import strawberry from './assets/strawberry-shortcake.jpeg'; 
import './Pesanan.css';

function SelesaiPage() {
  return (
    <div className="pesanan-page-wrapper">
      <div className="pesanan-content">
        <h1 className="pesanan-title">Pesanan</h1>
        <div className="filter-group">
          <Link to="/pesanan" className="filter-btn">Semua</Link>
          <Link to="/pesanan/proses" className="filter-btn">Dalam Proses</Link>
          <Link to="/pesanan/dibatalkan" className="filter-btn">Dibatalkan</Link>
          <Link to="/pesanan/selesai" className="filter-btn active">Selesai</Link>
        </div>

        <div className="order-list">
          <div className="order-card">
            <div className="order-info">
              <img src={strawberry} alt="Cake" className="order-img" />
              <div className="order-details">
                <h3>1 Strawberry Shortcake</h3>
                <p>Rp 41.000</p>
                <span className="status-badge" style={{ backgroundColor: '#4CAF50' }}>Pesanan Selesai</span>
              </div>
            </div>
            <div className="order-arrow">❯</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelesaiPage;