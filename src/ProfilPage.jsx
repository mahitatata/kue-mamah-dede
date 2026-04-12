import { Link, useNavigate } from 'react-router-dom';
import './Profil.css';
import { useApp } from './context/AppContext';

function ProfilPage() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useApp();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="profil-page-wrapper">
      <div className="profil-content">
        <h1 className="profil-title">Profile</h1>

        <div className="profile-icon-container">
          <i className="bi bi-person-circle profile-main-icon"></i>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Nama</label>
            <div className="input-wrapper">
              <input type="text" value={user?.name || ''} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input type="email" value={user?.email || ''} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="input-wrapper">
              <input type="text" value={user?.role || ''} readOnly />
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isAdmin ? (
            <Link className="profile-action-button" to="/admin">
              Buka Admin
            </Link>
          ) : null}
          <button type="button" className="profile-action-button profile-action-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilPage;
