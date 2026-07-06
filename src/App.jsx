import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import RewardsPopup from './components/SafeRewardsPopup';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Sale from './pages/Sale';
import Accessories from './pages/Accessories';
import NewReleases from './pages/NewReleases';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Help from './pages/Help';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import ProductDetails from './pages/ProductDetails';
import AboutLoyalty from './pages/AboutLoyalty';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TrackOrder from './pages/TrackOrder';
import { useHero } from './context/HeroContext';
import { useProduct } from './context/ProductContext';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';

function App() {
  const location = useLocation();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isJoinUsOpen, setIsJoinUsOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);

  const { products, loading: productsLoading } = useProduct();
  const { ads, loading: adsLoading } = useHero();
  const { user } = useAuth();

  useEffect(() => {
    const handleErr = (event) => {
      setDebugLogs(prev => [...prev, `Error: ${event.message}`]);
    };
    const handleRej = (event) => {
      setDebugLogs(prev => [...prev, `Promise: ${event.reason}`]);
    };
    window.addEventListener('error', handleErr);
    window.addEventListener('unhandledrejection', handleRej);
    
    // Also patch console.error to catch react/firebase warnings
    const originalError = console.error;
    console.error = (...args) => {
      setDebugLogs(prev => [...prev, `Console: ${args.join(' ')}`]);
      originalError.apply(console, args);
    };

    return () => {
      window.removeEventListener('error', handleErr);
      window.removeEventListener('unhandledrejection', handleRej);
      console.error = originalError;
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openSignIn = () => {
    setIsJoinUsOpen(false);
    setIsSignInOpen(true);
  };

  const openJoinUs = () => {
    setIsSignInOpen(false);
    setIsJoinUsOpen(true);
  };

  const closeModals = () => {
    setIsSignInOpen(false);
    setIsJoinUsOpen(false);
  };

  const isHome = location.pathname === '/';
  const isCheckout = location.pathname === '/checkout';
  const isAdmin = location.pathname === '/admin';
  const isProfile = location.pathname === '/profile';
  const hideNavFooter = isCheckout || isAdmin;

  if (productsLoading || adsLoading) {
    return <Loader />;
  }

  return (
      <div id="app">
        {!hideNavFooter && <Navbar isHome={isHome} openSignIn={openSignIn} openJoinUs={openJoinUs} />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/men.html" element={<Men />} />
        <Route path="/women.html" element={<Women />} />
        <Route path="/kids.html" element={<Kids />} />
        <Route path="/sale.html" element={<Sale />} />
        <Route path="/accessories.html" element={<Accessories />} />
        <Route path="/new-releases.html" element={<NewReleases />} />
        <Route path="/cart.html" element={<Cart openSignIn={openSignIn} />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shipping.html" element={<Shipping />} />
        <Route path="/returns.html" element={<Returns />} />
        <Route path="/privacy.html" element={<PrivacyPolicy />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about-loyalty" element={<AboutLoyalty />} />
      </Routes>

      {!hideNavFooter && <Footer />}
        <AuthModals 
          isSignInOpen={isSignInOpen} 
          isJoinUsOpen={isJoinUsOpen} 
          closeModals={closeModals} 
          openSignIn={openSignIn} 
          openJoinUs={openJoinUs} 
        />
        {!hideNavFooter && <RewardsPopup openSignIn={openSignIn} openJoinUs={openJoinUs} />}
        
        {user && user.role === 'admin' && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 99999,
          }}>
            {!isDebugExpanded ? (
              <button 
                onClick={() => setIsDebugExpanded(true)}
                style={{
                  background: '#ff9900',
                  color: '#000',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  fontFamily: 'monospace'
                }}
              >
                🛠️ DEBUG
              </button>
            ) : (
              <div style={{
                background: 'rgba(0,0,0,0.95)',
                color: '#00ff00',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                maxHeight: '300px',
                width: '320px',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                border: '1px solid #333'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                  <h4 style={{ margin: 0, color: '#ff9900' }}>Debug Panel</h4>
                  <button 
                    onClick={() => setIsDebugExpanded(false)}
                    style={{
                      background: '#ff3333',
                      color: '#fff',
                      border: 'none',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: 'bold'
                    }}
                  >
                    MINIMIZE
                  </button>
                </div>
                <div>Products Loading: {productsLoading ? 'YES' : 'NO'}</div>
                <div>Ads Loading: {adsLoading ? 'YES' : 'NO'}</div>
                <div>Products Count: {products?.length || 0}</div>
                <div>Ads Count: {ads?.length || 0}</div>
                <div style={{ marginTop: '8px', color: '#ff3333', borderTop: '1px solid #444', paddingTop: '5px' }}>
                  {debugLogs.length === 0 ? 'No errors caught' : debugLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

export default App;
