import React, { useState } from 'react'; // 1. Import useState
import './MenuPage.css';
import Footer from './Footer';
import img from './assets/whole-cake2.jpeg'; 

function WholeCakePage() {
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
          Menu <span className="separator">|</span> <span className="category-name">Whole Cake</span>
        </h1>
        
        <div className="product-detail-section">
          {/* Sisi Kiri: Gambar */}
          <div className="detail-left">
            <div className="image-white-box">
              <img src={img} alt="Whole Cake" />
            </div>
          </div>

          {/* Sisi Kanan: Informasi */}
          <div className="detail-right">
            <h2 className="detail-name">Whole Cake</h2>
            <div className="detail-desc">
              <p>Kue utuh dengan rasa lezat dan tampilan menarik, cocok untuk momen spesial.</p>
              <p><strong>Estimasi PO:</strong> 4-5 hari</p>
              <p><strong>Maks. pemesanan:</strong> 2 pcs</p>
            </div>
            
            <h3 className="detail-price">Rp 250.000</h3>

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

export default WholeCakePage;