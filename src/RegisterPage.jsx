import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; 
import bgImage from './assets/wallpaper-cake-pink.jpeg'; 

function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register attempt with:', { nama, email, password });
  };

  return (
    <div className="login-page-wrapper">
      {/* Kita tambahkan row-reverse di sini agar Form pindah ke Kanan dan Gambar ke Kiri */}
      <div className="login-main-container" style={{ flexDirection: 'row-reverse' }}>
        
        {/* Sisi Kanan (Formulir) */}
        <div className="login-form-side">
          <div className="login-form-content">
            <h1 className="brand-logo-text">CakeTime</h1>
            <h2 className="welcome-heading">SELAMAT DATANG</h2>
            <p className="welcome-subtext">
              Masukkan Nama, Email, dan Kata sandi anda untuk mengakses akun anda
            </p>

            <form onSubmit={handleSubmit} className="actual-form">
              <div className="form-input-group">
                <label htmlFor="nama">Nama</label>
                <input
                  type="text"
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="password">Kata Sandi</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="login-submit-button">
                Masuk
              </button>
            </form>

            <p className="register-redirect-text">
              Sudah memiliki akun? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

        {/* Sisi Kiri (Gambar) */}
        <div className="login-image-side">
          <img src={bgImage} alt="Cake Showcase" className="full-bg-image" />
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;