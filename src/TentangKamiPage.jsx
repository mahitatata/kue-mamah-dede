import React from 'react';
import './TentangKamiPage.css';
import Footer from './Footer';

import heroImage from './assets/kroisan.jpeg';
import contentImage from './assets/amjay.jpeg';
import cakeIcon from './assets/cake (1).png';

function TentangKamiPage() {
  return (
    <div className="about-page-wrapper">
      <div className="about-hero-image">
        <img src={heroImage} alt="Cake Banner" />
      </div>

      <div className="about-content-container">
        <div className="about-card">
          
          {/* Dekorasi Icon Kue di Atas Judul */}
          <div className="about-header-decoration">
            <div className="decoration-line"></div>
            <img src={cakeIcon} alt="Icon" className="mini-cake-icon" />
            <div className="decoration-line"></div>
          </div>

          <h1 className="about-main-title">Tentang Kami - CakeTime</h1>

          <div className="about-grid">
            {/* Sisi Kiri: Gambar Produk */}
            <div className="about-image-side">
             <img src={contentImage} alt="Our Cake" className="featured-about-img" />
            </div>

            {/* Sisi Kanan: Teks Sambutan */}
            <div className="about-text-side">
              <h2 className="about-greeting">Hal0! Selamat Datang di CakeTime</h2>
              <p>
                CakeTime adalah platform e-commerce yang hadir untuk memudahkan Anda 
                dalam memesan berbagai jenis kue dengan kualitas terbaik dan tampilan 
                yang menarik. Kami menyediakan beragam pilihan kue, mulai dari cake 
                ulang tahun, cupcake, hingga kue custom sesuai keinginan pelanggan.
                Dengan mengutamakan kualitas bahan dan keindahan desain, setiap produk yang 
                kami tawarkan dibuat dengan penuh ketelitian dan rasa tanggung jawab.
              </p>
            </div>
          </div>

          {/* Bagian Bawah: Deskripsi Lengkap */}
<div className="about-full-description">
  <div className="description-feature-grid">
    <div className="feature-item">
      <div className="feature-icon">✨</div>
      <div className="feature-text">
        <h3>Momen Istimewa</h3>
        <p>Kami percaya setiap momen berharga layak dirayakan dengan kelezatan yang istimewa dan tampilan yang memukau.</p>
      </div>
    </div>
    
    <div className="feature-item">
      <div className="feature-icon">🚀</div>
      <div className="feature-text">
        <h3>Layanan Praktis</h3>
        <p>Sistem pemesanan online kami dirancang untuk memberikan kemudahan, kecepatan, dan keamanan dalam setiap transaksi.</p>
      </div>
    </div>

    <div className="feature-item">
      <div className="feature-icon">💡</div>
      <div className="feature-text">
        <h3>Inovasi Berkelanjutan</h3>
        <p>Bersama tim kreatif berpengalaman, kami terus berinovasi menghadirkan tren kue terbaru untuk kepuasan Anda.</p>
      </div>
    </div>
    </div>

  <p className="closing-statement">
    Kami berharap dapat terus menjadi bagian dari setiap perayaan berharga Anda, 
    mulai dari momen sederhana hingga acara spesial yang tak terlupakan.
  </p>
    </div>
        </div>
            </div> 

    <Footer />
</div>
  );
}

export default TentangKamiPage;