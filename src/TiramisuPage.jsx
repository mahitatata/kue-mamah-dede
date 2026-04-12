import React, { useState } from 'react'; // 1. Import useState
import './MenuPage.css';
import Footer from './Footer';
import img from './assets/tiramisu-cake.jpeg'; 

function TiramisuPage() {
  // 2. Buat state untuk jumlah barang (default 1)
  const [quantity, setQuantity] = useState(1);

  // 3. Fungsi untuk menambah jumlah
  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // 4. Fungsi untuk mengurangi jumlah (tidak boleh kurang dari 1)
  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="menu-page-wrapper">
      <div className="menu-container">
        <h1 className="main-title">
          Menu <span className="separator">|</span> <span className="category-name">Tiramisu Cake</span>
        </h1>
        
        <div className="product-detail-section">
          {/* Sisi Kiri: Gambar */}
          <div className="detail-left">
            <div className="image-white-box">
              <img src={img} alt="Tiramisu Cake" />
            </div>
          </div>

          {/* Sisi Kanan: Informasi */}
          <div className="detail-right">
            <h2 className="detail-name">Tiramisu Cake</h2>
            <div className="detail-desc">
              <p>Kue lembut dengan rasa kopi dan krim yang creamy serta cita rasa khas.</p>
              <p><strong>Estimasi PO:</strong> 3-4 hari</p>
              <p><strong>Maks. pemesanan:</strong> 10 pcs</p>
            </div>
            
            <h3 className="detail-price">Rp 50.000</h3>

            <div className="action-row">
              <div className="quantity-picker">
                {/* 5. Tambahkan event onClick dan tampilkan state quantity */}
                <button onClick={handleDecrease}>−</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease}>+</button>
              </div>
         
            <button className="buy-button">Beli</button>
          </div>
          
        </div>
      </div>
     </div>
      <Footer />
    </div>
  );
}

export default TiramisuPage;