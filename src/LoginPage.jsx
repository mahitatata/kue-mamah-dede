import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import bgImage from './assets/wallpaper-cake-pink.jpeg';
import { useApp } from './context/AppContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.redirectTo || '/';

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-main-container">
        <div className="login-form-side">
          <div className="login-form-content">
            <h1 className="brand-logo-text">CakeTime</h1>
            <h2 className="welcome-heading">SELAMAT DATANG</h2>
            <p className="welcome-subtext">
              Masukkan Email dan Kata Sandi anda untuk mengakses akun anda.
            </p>

            <form onSubmit={handleSubmit} className="actual-form">
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
                <label htmlFor="password">Kata sandi</label>
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="********"
                  required
                />
              </div>

              {error ? <p style={{ color: '#F8D7DA', margin: 0 }}>{error}</p> : null}

              <button type="submit" className="login-submit-button" disabled={submitting}>
                {submitting ? 'Masuk...' : 'Masuk'}
              </button>
            </form>

            <p className="register-redirect-text">
              Belum memiliki akun? <Link to="/register">Register</Link>
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

export default LoginPage;
