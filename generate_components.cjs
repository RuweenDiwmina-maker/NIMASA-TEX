const fs = require('fs');
const path = require('path');

const writeComponent = (name, folder, content) => {
  fs.writeFileSync(path.join(__dirname, 'src', folder, `${name}.jsx`), content);
};

// --- COMPONENTS ---

const NavbarJsx = `import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isHome, openSignIn, openJoinUs }) => {
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
  const navbarClass = isHome ? \`navbar \${isScrolled ? 'scrolled' : ''}\` : 'navbar nike-navbar';
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
              <Link to="#">Help</Link> | 
              <a href="#" onClick={(e) => { e.preventDefault(); openJoinUs(); }}>Join Us</a> | 
              <a href="#" onClick={(e) => { e.preventDefault(); openSignIn(); }}>Sign In</a>
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
            <div className={\`search-container \${searchActive ? 'active' : ''}\`}>
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
            <Link to="/cart.html" className="icon-btn" title="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`;

const FooterJsx = `import React from 'react';
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
            <li><Link to="#">Contact Us</Link></li>
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
`;

const AuthModalsJsx = `import React from 'react';

const AuthModals = ({ isSignInOpen, isJoinUsOpen, closeModals, openSignIn, openJoinUs }) => {
  if (!isSignInOpen && !isJoinUsOpen) return null;

  return (
    <>
      {/* Sign In Modal */}
      <div className={\`modal-overlay \${isSignInOpen ? 'active' : ''}\`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModals(); }}>
        <div className="modal-content">
          <button className="close-modal" onClick={closeModals}>&times;</button>
          <div className="modal-logo">
            <img src="/src/assets/Logo_black.png" alt="Nimasa Tex Logo" />
          </div>
          <h2>Sign In</h2>
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn btn-pill-dark auth-submit">Sign In</button>
          </form>
          <div className="auth-switch">
            <p>Don't have an account? <button type="button" className="switch-to-join" style={{background:'none', border:'none', color:'var(--color-primary)', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline'}} onClick={openJoinUs}>Join Us</button></p>
          </div>
        </div>
      </div>

      {/* Join Us Modal */}
      <div className={\`modal-overlay \${isJoinUsOpen ? 'active' : ''}\`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModals(); }}>
        <div className="modal-content">
          <button className="close-modal" onClick={closeModals}>&times;</button>
          <div className="modal-logo">
            <img src="/src/assets/Logo_black.png" alt="Nimasa Tex Logo" />
          </div>
          <h2>Join Nimasa Tex</h2>
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn btn-pill-dark auth-submit">Sign Up</button>
          </form>
          <div className="auth-switch">
            <p>Already a member? <button type="button" className="switch-to-sign-in" style={{background:'none', border:'none', color:'var(--color-primary)', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline'}} onClick={openSignIn}>Sign In</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModals;
`;

const ProductCardJsx = `import React from 'react';

const ProductCard = ({ product, isNikeStyle = false }) => {
  if (isNikeStyle) {
    return (
      <div className="nike-product-card">
        <div className="nike-product-img-wrap">
          <img src={product.image} alt={product.title} className="primary-img" loading="lazy" />
          {product.hoverImage && <img src={product.hoverImage} alt={product.title + " Alternate"} className="hover-img" loading="lazy" />}
          <div className="product-actions">
            <button className="btn-add-cart">Add to Cart</button>
          </div>
        </div>
        <div className="nike-product-info">
          <h3 className="text-red">{product.title}</h3>
          <p>{product.category}</p>
          <p className="nike-price">{product.price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.title} className="primary-img" loading="lazy" />
        {product.hoverImage && <img src={product.hoverImage} alt={product.title + " Alternate"} className="hover-img" loading="lazy" />}
        <div className="product-actions">
          <button className="btn-add-cart">Add to Cart</button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
`;

writeComponent('Navbar', 'components', NavbarJsx);
writeComponent('Footer', 'components', FooterJsx);
writeComponent('AuthModals', 'components', AuthModalsJsx);
writeComponent('ProductCard', 'components', ProductCardJsx);

// --- PAGES ---

const HomeJsx = `import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const products = [
  { id: 1, title: 'Nike Air Max 270 React', category: "Men's Shoes", price: '$150', image: '/images/product_1_1779816776674.png', hoverImage: '/images/product_1_alt.png' },
  { id: 2, title: 'Red Essential Hoodie', category: "Men's Apparel", price: '$65', image: '/images/product_2_1779816797080.png', hoverImage: '/images/product_2_alt.png' },
  { id: 3, title: 'Sportswear Windrunner', category: "Women's Jacket", price: '$110', image: '/images/product_3_1779816815338.png', hoverImage: '/images/product_3_alt.png' },
  { id: 4, title: 'Pro Training Tights', category: "Women's Bottoms", price: '$55', image: '/images/product_4_1779816830210.png', hoverImage: '/images/product_4_alt.png' }
];

const Home = () => {
  return (
    <>
      <header className="hero">
        <div className="hero-bg">
          <img src="/images/hero_banner_1779816577403.png" alt="Nimasa Tex New Collection" className="hero-image" />
          <div className="overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">ELEVATE<br/><span className="text-red">YOUR STYLE</span></h1>
          <p className="hero-subtitle">Discover the new premium collection. Crafted for the bold. Experience comfort and cutting-edge fashion combined.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Shop Collection</button>
            <button className="btn btn-secondary">Explore</button>
          </div>
        </div>
      </header>

      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            <Link to="/men.html" className="category-card">
              <img src="/images/category_men_1779816591323.png" alt="Men's Fashion" />
              <div className="category-overlay">
                <h3>Men</h3>
              </div>
            </Link>
            <Link to="/women.html" className="category-card">
              <img src="/images/category_women_1779816605767.png" alt="Women's Fashion" />
              <div className="category-overlay">
                <h3>Women</h3>
              </div>
            </Link>
            <Link to="/kids.html" className="category-card">
              <img src="/images/category_kids_1779816620571.png" alt="Kids Fashion" />
              <div className="category-overlay">
                <h3>Kids</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="trending section bg-light">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
`;

const MenJsx = `import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const menProducts = [
  { id: 1, title: 'Nike Air Max 270 React', category: "Men's Shoes", price: '$150', image: '/images/product_1_1779816776674.png', hoverImage: '/images/product_1_alt.png' },
  { id: 2, title: 'Red Essential Hoodie', category: "Men's Apparel", price: '$65', image: '/images/product_2_1779816797080.png', hoverImage: '/images/product_2_alt.png' },
  { id: 5, title: 'Nike Dri-FIT Top', category: "Men's Top", price: '$40', image: '/images/product_3_1779816815338.png', hoverImage: '/images/product_3_alt.png' },
  { id: 6, title: 'Nike Tech Fleece', category: "Men's Joggers", price: '$110', image: '/images/product_4_1779816830210.png', hoverImage: '/images/product_4_alt.png' }
];

const Men = () => {
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Men</div>
          <div className="cat-links">
            <Link to="#">Shoes</Link>
            <Link to="#">Clothing</Link>
            <Link to="#">Accessories</Link>
            <Link to="#">Sale</Link>
          </div>
        </div>
      </nav>

      <header className="nike-hero">
        <img src="/images/men_hero_1779898328198.png" alt="Men Hero" className="nike-hero-img" />
        <div className="nike-hero-content">
          <h1 className="nike-hero-title">MADE FOR<br/>EVERY MOVE</h1>
          <p className="nike-hero-subtitle">The latest performance apparel and footwear for men.</p>
          <div className="nike-hero-buttons">
            <button className="btn-pill-dark">Shop New Arrivals</button>
            <button className="btn-pill-light">Shop All Men's</button>
          </div>
        </div>
      </header>

      <main className="container" style={{maxWidth: '1920px', padding: '0 48px'}}>
        <h2 className="nike-section-title">Latest & Greatest</h2>
        <div className="nike-product-scroll">
          {menProducts.map(p => <ProductCard key={p.id} product={p} isNikeStyle={true} />)}
        </div>
      </main>
    </>
  );
};

export default Men;
`;

// Helper to write generic Category pages
const createCategoryPage = (name, title, heroImg, heroSubtitle) => {
  return `import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const products = [
  { id: 1, title: '${title} Shoe', category: "${title} Shoes", price: '$150', image: '/images/product_1_1779816776674.png', hoverImage: '/images/product_1_alt.png' },
  { id: 2, title: '${title} Hoodie', category: "${title} Apparel", price: '$65', image: '/images/product_2_1779816797080.png', hoverImage: '/images/product_2_alt.png' },
  { id: 3, title: '${title} Top', category: "${title} Top", price: '$40', image: '/images/product_3_1779816815338.png', hoverImage: '/images/product_3_alt.png' },
  { id: 4, title: '${title} Tights', category: "${title} Bottoms", price: '$110', image: '/images/product_4_1779816830210.png', hoverImage: '/images/product_4_alt.png' }
];

const ${name} = () => {
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">${title}</div>
          <div className="cat-links">
            <Link to="#">Shoes</Link>
            <Link to="#">Clothing</Link>
            <Link to="#">Accessories</Link>
            <Link to="#">Sale</Link>
          </div>
        </div>
      </nav>

      <header className="nike-hero">
        <img src="/images/${heroImg}" alt="${title} Hero" className="nike-hero-img" />
        <div className="nike-hero-content">
          <h1 className="nike-hero-title">${title.toUpperCase()}</h1>
          <p className="nike-hero-subtitle">${heroSubtitle}</p>
          <div className="nike-hero-buttons">
            <button className="btn-pill-dark">Shop New Arrivals</button>
            <button className="btn-pill-light">Shop All ${title}</button>
          </div>
        </div>
      </header>

      <main className="container" style={{maxWidth: '1920px', padding: '0 48px'}}>
        <h2 className="nike-section-title">Latest & Greatest</h2>
        <div className="nike-product-scroll">
          {products.map(p => <ProductCard key={p.id} product={p} isNikeStyle={true} />)}
        </div>
      </main>
    </>
  );
};

export default ${name};
`;
}

writeComponent('Home', 'pages', HomeJsx);
writeComponent('Men', 'pages', MenJsx);
writeComponent('Women', 'pages', createCategoryPage('Women', 'Women', 'women_hero_1779900217677.png', "Elevate your training with the latest women's collection."));
writeComponent('Kids', 'pages', createCategoryPage('Kids', 'Kids', 'kids_hero_1779900231979.png', "Gear up the next generation of athletes."));
writeComponent('Sale', 'pages', createCategoryPage('Sale', 'Sale', 'sale_hero_1779900247375.png', "Don't miss out on premium gear at reduced prices."));
writeComponent('NewReleases', 'pages', createCategoryPage('NewReleases', 'New Releases', 'new_releases_hero_1779900201787.png', "Be the first to wear our cutting-edge drops."));

const CartJsx = `import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <>
      <header className="info-page-header">
        <h1>Your Cart</h1>
        <p>Review your items before checkout.</p>
      </header>
      <main className="info-page-content" style={{textAlign: 'center', paddingTop: '40px'}}>
        <div className="info-block">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{width: '64px', height: '64px', color: 'var(--color-gray-400)', marginBottom: '20px'}}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2 style={{border: 'none'}}>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-pill-dark" style={{display: 'inline-block', marginTop: '20px'}}>Continue Shopping</Link>
        </div>
      </main>
    </>
  );
};

export default Cart;
`;
writeComponent('Cart', 'pages', CartJsx);

const ShippingJsx = `import React from 'react';

const Shipping = () => {
  return (
    <>
      <header className="info-page-header">
        <h1>Shipping & Delivery</h1>
        <p>Everything you need to know about getting your Nimasa Tex gear.</p>
      </header>
      <main className="info-page-content">
        <div className="info-block">
          <h2>Delivery Options & Times</h2>
          <p>Nimasa Tex offers multiple shipping options to ensure your premium gear arrives when you need it. Note that orders placed after 2 PM will begin processing the following business day.</p>
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Shipping Method</th>
                <th>Delivery Time</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Delivery</td>
                <td>3-5 Business Days</td>
                <td>$8.00 (Free for orders over $150)</td>
              </tr>
              <tr>
                <td>Express Delivery</td>
                <td>2 Business Days</td>
                <td>$15.00</td>
              </tr>
              <tr>
                <td>Next Day Delivery</td>
                <td>1 Business Day</td>
                <td>$25.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info-block">
          <h2>Free Shipping Eligibility</h2>
          <p>We offer free Standard Delivery on all orders totaling $150 or more (before taxes and after discounts are applied). Simply select the standard shipping option at checkout and the discount will be automatically applied.</p>
        </div>
      </main>
    </>
  );
};

export default Shipping;
`;
writeComponent('Shipping', 'pages', ShippingJsx);

console.log("React components generated successfully.");
