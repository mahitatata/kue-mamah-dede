import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLoginPage.css';
import { useApp } from './context/AppContext';

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useApp();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      const user = await login(form);

      if (user.role !== 'admin') {
        await logout();
        setError('Akun ini bukan admin.');
        return;
      }

      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-login-badge">CakeTime Admin</p>
        <h1>Login Admin</h1>
        <p>Masuk dengan akun admin untuk mengelola produk, foto, dan pesanan.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email admin"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Masuk...' : 'Masuk Admin'}
          </button>
        </form>

        <p className="admin-login-note">
          Bukan admin? <Link to="/login">Masuk sebagai customer</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
