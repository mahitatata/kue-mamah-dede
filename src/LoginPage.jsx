import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import bgImage from './assets/wallpaper-cake-pink.jpeg'; // Import gambar background Anda

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tambahkan logika login di sini jika perlu
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-main-container">
        
        {/* Sisi Kiri - Formulir Login */}
        <div className="login-form-side">
          <div className="login-form-content">
            <h1 className="brand-logo-text">CakeTime</h1>
            <h2 className="welcome-heading">SELAMAT DATANG</h2>
            <p className="welcome-subtext">
              Masukkan Email dan Kata sandi anda untuk mengakses akun anda
            </p>

            <form onSubmit={handleSubmit} className="actual-form">
              <div className="form-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" // Placeholder opsional agar tidak kosong
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="password">Kata sandi</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" // Placeholder opsional agar tidak kosong
                  required
                />
              </div>

              <button type="submit" className="login-submit-button">
                Masuk
              </button>
            </form>

            <p className="register-redirect-text">
              Belum memiliki akun? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>

        {/* Sisi Kanan - Gambar Latar Belakang */}
        <div className="login-image-side">
          <img src={bgImage} alt="Cake Showcase" className="full-bg-image" />
        </div>

      </div>
    </div>
  );
}

export default LoginPage;