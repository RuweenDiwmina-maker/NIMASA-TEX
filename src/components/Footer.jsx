import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <footer className={isHome ? "footer" : "nike-footer"} style={!isHome ? { marginTop: 0 } : {}}>
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="logo">
            <img src="/src/assets/logo_white.ico" alt="Nimasa Tex Logo" className="site-logo footer-logo" />
          </div>
          {isHome && <p className="footer-desc">Premium fashion and apparel. Elevating your style every day with high quality fabrics.</p>}
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/men.html">Men's Clothing</Link></li>
            <li><Link to="/women.html">Women's Clothing</Link></li>
            <li><Link to="/kids.html">Kids & Baby</Link></li>
            <li><Link to="/new-releases.html">New Releases</Link></li>
            <li><Link to="/sale.html">Sale</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><Link to="#">Order Status</Link></li>
            <li><Link to="/shipping.html">Shipping & Delivery</Link></li>
            <li><Link to="#">Returns</Link></li>
            <li><Link to="/help">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Nimasa Tex. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
