import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isHome, openSignIn, openJoinUs }) => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    if (!isHome) return; // Only apply shadow effect on home or adjust as needed
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    setSearchActive(!searchActive);
  };

  const handleSearchBlur = () => {
    if (searchQuery.trim() === '') {
      setSearchActive(false);
    }
  };

  // Determine styles based on route. Home page has full nav, other pages have nike-navbar style
  const isUtilityVisible = isHome;
  const navbarClass = isHome ? `navbar ${isScrolled ? 'scrolled' : ''}` : 'navbar nike-navbar';
  const navContainerClass = isHome ? 'nav-container' : 'nav-container nike-nav-container';

  return (
    <nav className={navbarClass} style={isHome ? { paddingTop: '36px', boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none' } : {}}>
      {isUtilityVisible && (
        <div className="utility-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
          <div className="utility-container">
            <div className="utility-left">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                <span className="text-red">NIMASA</span> <span style={{ color: 'var(--color-black)' }}>TEX</span>
              </span>
            </div>
            <div className="utility-right">
              <Link to="/help">Help</Link> | 
              {user ? (
                <>
                  {user.role === 'admin' && <Link to="/admin" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Admin Panel | </Link>}
                  <span style={{ fontWeight: '500' }}>Hi, {user.name.split(' ')[0]}</span> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Sign Out</a>
                </>
              ) : (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); openJoinUs(); }}>Join Us</a> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); openSignIn(); }}>Sign In</a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={navContainerClass}>
        <div className={isHome ? 'nav-left' : 'nike-nav-left'}>
          <Link to="/" className="logo">
            <img src="/src/assets/Logo_black.png" alt="Nimasa Tex Logo" className="site-logo" />
          </Link>
        </div>
        
        <div className={isHome ? 'nav-center' : 'nike-nav-center'}>
          <ul className={isHome ? 'nav-links' : 'nav-links nike-nav-links'}>
            <li><Link to="/new-releases.html" className={location.pathname === '/new-releases.html' ? 'active' : ''}>New Releases</Link></li>
            <li><Link to="/men.html" className={location.pathname === '/men.html' ? 'active' : ''}>Men</Link></li>
            <li><Link to="/women.html" className={location.pathname === '/women.html' ? 'active' : ''}>Women</Link></li>
            <li><Link to="/kids.html" className={location.pathname === '/kids.html' ? 'active' : ''}>Kids</Link></li>
            <li><Link to="/sale.html" className={location.pathname === '/sale.html' ? 'active' : ''}>Sale</Link></li>
          </ul>
        </div>

        <div className={isHome ? 'nav-right' : 'nike-nav-right'}>
          <div className="nav-actions">
            <div className={`search-container ${searchActive ? 'active' : ''}`}>
              <button className="icon-btn search-btn" title="Search" onClick={handleSearchClick}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={handleSearchBlur}
                autoFocus={searchActive}
              />
            </div>
            <Link to="/cart.html" className="icon-btn" title="Cart" style={{ position: 'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-4px',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
