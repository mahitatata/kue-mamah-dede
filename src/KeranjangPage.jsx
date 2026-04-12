import React from 'react';
import './Keranjang.css';
import strawberry from './assets/strawberry-shortcake.jpeg'; 

function KeranjangPage() {
  // Data contoh keranjang
  const cartItems = [
    { id: 1, nama: 'Strawberry Shortcake', harga: 41000, jumlah: 1 },
    { id: 2, nama: 'Strawberry Shortcake', harga: 41000, jumlah: 1 },
    { id: 3, nama: 'Strawberry Shortcake', harga: 41000, jumlah: 1 },
  ];

  return (
    <div className="keranjang-page-wrapper">
      <div className="keranjang-content">
        <h1 className="keranjang-title">Keranjang</h1>
        
        <div className="cart-list">
          {cartItems.map(item => (
            <div className="cart-card" key={item.id}>
              <div className="cart-info">
                <img src={strawberry} alt={item.nama} className="cart-img" />
                <div className="cart-details">
                  <h3>{item.jumlah} {item.nama}</h3>
                  <p>Rp {item.harga.toLocaleString('id-ID')}</p>
                  <button className="delete-btn">Hapus</button>
                </div>
              </div>
              
              <div className="cart-actions">
                <div className="quantity-control">
                  <button className="qty-btn">-</button>
                  <span className="qty-number">{item.jumlah}</span>
                  <button className="qty-btn">+</button>
                </div>
                <button className="buy-now-btn">Beli Sekarang</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KeranjangPage;