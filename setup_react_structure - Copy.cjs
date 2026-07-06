const fs = require('fs');
const path = require('path');

// Create directories
const dirs = ['src/components', 'src/pages'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create index.html for React
const reactIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nimasa Tex | Premium Fashion</title>
    <!-- Modern Fonts: Inter & Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
fs.writeFileSync(path.join(__dirname, 'index.html'), reactIndexHtml);

// Create main.jsx
const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`;
fs.writeFileSync(path.join(__dirname, 'src', 'main.jsx'), mainJsx);

// Create App.jsx skeleton
const appJsx = `import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Sale from './pages/Sale';
import NewReleases from './pages/NewReleases';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';

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

  return (
    <div id="app">
      <Navbar isHome={isHome} openSignIn={openSignIn} openJoinUs={openJoinUs} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men.html" element={<Men />} />
        <Route path="/women.html" element={<Women />} />
        <Route path="/kids.html" element={<Kids />} />
        <Route path="/sale.html" element={<Sale />} />
        <Route path="/new-releases.html" element={<NewReleases />} />
        <Route path="/cart.html" element={<Cart />} />
        <Route path="/shipping.html" element={<Shipping />} />
      </Routes>

      <Footer />
      <AuthModals 
        isSignInOpen={isSignInOpen} 
        isJoinUsOpen={isJoinUsOpen} 
        closeModals={closeModals} 
        openSignIn={openSignIn} 
        openJoinUs={openJoinUs} 
      />
    </div>
  );
}

export default App;
`;
fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), appJsx);

console.log("Basic React structure scaffolded successfully.");
