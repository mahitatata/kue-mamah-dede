import React, { useState } from 'react'; 
import { NavLink, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './navbar.css';

function Navbar() {
  const [cartCount, setCartCount] = useState(3); 

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">CakeTime</Link>
        
        <div className="navbar-menu">
          <NavLink to="/" className="navbar-link">
            Beranda
          </NavLink>
          <NavLink to="/pesanan" className="navbar-link">
            Pesanan
          </NavLink>

          <div className="navbar-icons">
            <NavLink to="/keranjang" className="navbar-link icon-wrapper">
                <i className="bi bi-cart3 navbar-icon"></i>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </NavLink>

            <NavLink to="/profil" className="navbar-link">
              <i className="bi bi-person navbar-icon"></i>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;