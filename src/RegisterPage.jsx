import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import bgImage from './assets/wallpaper-cake-pink.jpeg';
import { useApp } from './context/AppContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      await register(form);
      navigate('/login', { 
        replace: true,
        state: { 
          registeredEmail: form.email,
          message: 'Registrasi berhasil! Silakan login dengan email dan kata sandi Anda.'
        }
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-main-container" style={{ flexDirection: 'row-reverse' }}>
        <div className="login-form-side">
          <div className="login-form-content">
            <h1 className="brand-logo-text">CakeTime</h1>
            <h2 className="welcome-heading">BUAT AKUN BARU</h2>
            <p className="welcome-subtext">
              Lengkapi data anda agar bisa berbelanja dan memantau pesanan dari backend.
            </p>

            <form onSubmit={handleSubmit} className="actual-form">
              <div className="form-input-group">
                <label htmlFor="name">Nama</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="password">Kata Sandi</label>
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimal 8 karakter"
                  required
                />
              </div>

              <div className="form-input-group">
                <label htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  id="password_confirmation"
                  value={form.password_confirmation}
                  onChange={(event) => setForm((current) => ({ ...current, password_confirmation: event.target.value }))}
                  placeholder="Ulangi kata sandi"
                  required
                />
              </div>

              {error ? <p style={{ color: '#F8D7DA', margin: 0 }}>{error}</p> : null}

              <button type="submit" className="login-submit-button" disabled={submitting}>
                {submitting ? 'Mendaftar...' : 'Daftar'}
              </button>
            </form>

            <p className="register-redirect-text">
              Sudah memiliki akun? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

        <div className="login-image-side">
          <img src={bgImage} alt="Cake Showcase" className="full-bg-image" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
