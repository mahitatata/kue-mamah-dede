import React, { useState } from 'react';
import './PaymentPage.css';

// Komponen Ikon sederhana menggunakan emoji agar tidak error
const MapPin = () => <span>📍</span>;
const Phone = () => <span>📞</span>;
const User = () => <span>👤</span>;
const CreditCard = () => <span>💳</span>;
const ShoppingBag = () => <span>🛍️</span>;

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <h1 className="payment-title">Selesaikan Pemesanan Anda</h1>
        <p className="payment-subtitle">Tinjau barang anda dan pilih metode pengiriman pilihan anda.</p>

        <div className="payment-grid">
          {/* Kolom Kiri: Alamat & Pembayaran */}
          <div className="payment-left-column">
            
            {/* Seksi Alamat */}
            <div className="info-card">
              <h3 className="card-header"><MapPin /> Alamat Pengiriman</h3>
              <div className="input-field">
                <span className="input-icon"><User /></span>
                <input type="text" placeholder="Nama Lengkap" />
              </div>
              <div className="input-field">
                <span className="input-icon"><Phone /></span>
                <input type="text" placeholder="No. Telp" />
              </div>
              <div className="input-field">
                <textarea placeholder="Alamat Lengkap" rows="3"></textarea>
              </div>
            </div>

            {/* Seksi Metode Pembayaran */}
            <div className="info-card">
              <h3 className="card-header"><CreditCard /> Metode Pembayaran</h3>
              <div className="payment-options">
                <div 
                  className={`method-box ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <span className="method-title">COD</span>
                  <span className="method-desc">Cash On Delivery</span>
                </div>
                <div 
                  className={`method-box ${paymentMethod === 'midtrans' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('midtrans')}
                >
                  <span className="method-title">Midtrans</span>
                  <span className="method-desc">Pembayaran Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <div className="payment-right-column">
            <div className="info-card summary-card">
              <h3 className="card-header"><ShoppingBag /> Ringkasan Pesanan</h3>
              
              <div className="summary-item">
                <span>Strawberry Shortcake x1</span>
                <span>Rp 41.000</span>
              </div>
              
              <hr className="summary-divider" />
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rp 41.000</span>
              </div>
              <div className="summary-row">
                <span>Pengiriman</span>
                <span>Rp 15.000</span>
              </div>
              
              <div className="summary-total">
                <span>TOTAL</span>
                <span>Rp 56.000</span>
              </div>

              <button className="order-button">
                Lakukan Pemesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;