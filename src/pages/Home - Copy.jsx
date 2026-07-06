import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const { products } = useProduct();
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <HeroCarousel targetPage="Home" />

      <section className="trending section bg-light">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/new-releases.html" className="view-all-link">View All</Link>
          </div>
          <div className="product-grid">
            {products.filter(p => p.isNewRelease && p.newReleaseExpiry >= today).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Best Seller</h2>
            <Link to="/sale.html" className="view-all-link">View All</Link>
          </div>
          <div className="product-grid">
            {products.filter(p => p.isSale).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="categories section bg-light">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            <Link to="/women.html" className="category-card">
              <img src="/images/women_hero_.png" alt="Women's Fashion" />
              <div className="category-overlay">
                <button className="shop-now-btn">SHOP NOW</button>
                <h3>WOMENS</h3>
              </div>
            </Link>
            <Link to="/men.html" className="category-card">
              <img src="/images/men_new_cover.png" alt="Men's Fashion" />
              <div className="category-overlay">
                <button className="shop-now-btn">SHOP NOW</button>
                <h3>MENS</h3>
              </div>
            </Link>
            <Link to="/kids.html" className="category-card">
              <img src="/images/kids_hero_.png" alt="Kids Fashion" />
              <div className="category-overlay">
                <button className="shop-now-btn">SHOP NOW</button>
                <h3>KIDS</h3>
              </div>
            </Link>
            <Link to="/accessories.html" className="category-card">
              <img src="/images/accessory_sunglasses.png" alt="Accessories" />
              <div className="category-overlay">
                <button className="shop-now-btn">SHOP NOW</button>
                <h3>ACCESSORIES</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Men's Wear</h2>
            <Link to="/men.html" className="view-all-link">View All</Link>
          </div>
          <div className="product-grid">
            {products.filter(p => p.category.startsWith('Men')).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="trending section bg-light">
        <div className="container">
          <div className="section-header-flex">
            <h2 className="section-title">Women's Wear</h2>
            <Link to="/women.html" className="view-all-link">View All</Link>
          </div>
          <div className="product-grid">
            {products.filter(p => p.category.startsWith('Women')).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
