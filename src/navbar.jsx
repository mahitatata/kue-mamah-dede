import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './navbar.css';
import { useApp } from './context/AppContext';

function navClass({ isActive }) {
  return `navbar-link ${isActive ? 'active' : ''}`;
}

function Navbar() {
  const navigate = useNavigate();
  const { cart, user, isAdmin, logout } = useApp();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">CakeTime</NavLink>

        <div className="navbar-menu">
          <NavLink to="/" className={navClass}>
            Beranda
          </NavLink>

          {user ? (
            <>
              <NavLink to="/pesanan" className={navClass}>
                Pesanan
              </NavLink>

              <NavLink to="/tentang-kami" className={navClass}>
                Tentang Kami
              </NavLink>
              {isAdmin ? (
                <NavLink to="/admin" className={navClass}>
                  Admin
                </NavLink>
              ) : null}

              <div className="navbar-icons">
                <NavLink to="/keranjang" className={({ isActive }) => `navbar-link icon-wrapper ${isActive ? 'active' : ''}`}>
                  <i className="bi bi-cart3 navbar-icon"></i>
                  {cart.count > 0 && <span className="cart-badge">{cart.count}</span>}
                </NavLink>

                <NavLink to="/profil" className={navClass}>
                  <i className="bi bi-person navbar-icon"></i>
                </NavLink>

                <button type="button" className="navbar-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-icons">
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="navbar-button">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
