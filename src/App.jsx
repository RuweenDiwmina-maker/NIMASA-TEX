import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Sale from './pages/Sale';
import Accessories from './pages/Accessories';
import NewReleases from './pages/NewReleases';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Help from './pages/Help';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import ProductDetails from './pages/ProductDetails';
import { HeroProvider } from './context/HeroContext';

function App() {
  const location = useLocation();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isJoinUsOpen, setIsJoinUsOpen] = useState(false);

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

  return (
    <HeroProvider>
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
        <Route path="/help" element={<Help />} />
      </Routes>

      {!hideNavFooter && <Footer />}
        <AuthModals 
          isSignInOpen={isSignInOpen} 
          isJoinUsOpen={isJoinUsOpen} 
          closeModals={closeModals} 
          openSignIn={openSignIn} 
          openJoinUs={openJoinUs} 
        />
      </div>
    </HeroProvider>
  );
}

export default App;
