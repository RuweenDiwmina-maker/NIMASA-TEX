import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = ({ isHome, openSignIn, openJoinUs }) => {
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
                  <span style={{ fontWeight: '500' }}>Hi, {user.name ? user.name.split(' ')[0] : 'Admin'}</span> | 
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
            <img src="/images/full_logo.png" alt="Nimasa Tex Logo" className="site-logo" />
          </Link>
        </div>
        
        <div className={isHome ? 'nav-center' : 'nike-nav-center'}>
          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay active" onClick={toggleMobileMenu}></div>
          )}
          <ul className={`nav-links ${!isHome ? 'nike-nav-links' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="mobile-close-btn" onClick={toggleMobileMenu}>&times;</button>
            </div>
            <li>
              <Link to="/new-releases.html" className={location.pathname === '/new-releases.html' ? 'active' : ''}>
                <img src="/images/women_fashion_editorial_1782340418253.png" alt="New Releases" className="nav-mobile-img" />
                <span className="nav-text">New Releases</span>
              </Link>
            </li>
            <li>
              <Link to="/men.html" className={location.pathname === '/men.html' ? 'active' : ''}>
                <img src="/images/men_category_new_1782340195741.png" alt="Men" className="nav-mobile-img" />
                <span className="nav-text">Men</span>
              </Link>
            </li>
            <li>
              <Link to="/women.html" className={location.pathname === '/women.html' ? 'active' : ''}>
                <img src="/images/women_category_new_1782340205931.png" alt="Women" className="nav-mobile-img" />
                <span className="nav-text">Women</span>
              </Link>
            </li>
            <li>
              <Link to="/kids.html" className={location.pathname === '/kids.html' ? 'active' : ''}>
                <img src="/images/kids_category_new_1782340216152.png" alt="Kids" className="nav-mobile-img" />
                <span className="nav-text">Kids</span>
              </Link>
            </li>
            <li>
              <Link to="/accessories.html" className={location.pathname === '/accessories.html' ? 'active' : ''}>
                <img src="/images/accessory_sunglasses.png" alt="Accessories" className="nav-mobile-img" />
                <span className="nav-text">Accessories</span>
              </Link>
            </li>
            <li>
              <Link to="/sale.html" className={location.pathname === '/sale.html' ? 'active' : ''}>
                <img src="/images/product_3_1779816815338.png" alt="Sale" className="nav-mobile-img" />
                <span className="nav-text">Sale</span>
              </Link>
            </li>
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
              {user && (
                <Link to="/track-order" className="icon-btn" title="Track Order">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </Link>
              )}
              {user && (
                <button 
                  className="icon-btn" 
                  title="Profile" 
                  onClick={() => {
                    navigate(user.role === 'admin' ? '/admin' : '/profile');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
              )}

              {user && (
                <Link to="/wishlist" className="icon-btn" title="Wishlist" style={{ position: 'relative' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  {totalWishlistItems > 0 && (
                    <span className="badge-count">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>
              )}

              <Link to="/cart.html" className="icon-btn" title="Cart" style={{ position: 'relative' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                {totalItems > 0 && (
                  <span className="badge-count">
                    {totalItems}
                  </span>
                )}
              </Link>
            <button className="icon-btn mobile-menu-btn" onClick={toggleMobileMenu} title="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
