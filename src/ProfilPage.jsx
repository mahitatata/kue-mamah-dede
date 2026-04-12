import React from 'react';
import './Profil.css';

function ProfilPage() {
  return (
    <div className="profil-page-wrapper">
      <div className="profil-content">
        <h1 className="profil-title">Profile</h1>
        
        {/* Ikon Profil Besar */}
        <div className="profile-icon-container">
          <i className="bi bi-person-circle profile-main-icon"></i>
        </div>

        {/* Form Input */}
        <div className="profile-form">
          <div className="form-group">
            <label>Nama</label>
            <div className="input-wrapper">
              <input type="text" placeholder="Masukkan nama" />
              <i className="bi bi-pencil-fill edit-icon"></i>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input type="email" placeholder="Masukkan email" />
            </div>
          </div>

          <div className="form-group">
            <label>Kata sandi</label>
            <div className="input-wrapper">
              <input type="password" placeholder="********" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilPage;