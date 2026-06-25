import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const { products } = useProduct();

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
            {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
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
            <Link to="/men.html" className="category-card">
              <img src="/images/men_nocoat_1782340559911.png" alt="Men's Fashion" />
              <div className="category-overlay">
                <h3>Men</h3>
              </div>
            </Link>
            <Link to="/women.html" className="category-card">
              <img src="/images/women_nocoat_1782340568704.png" alt="Women's Fashion" />
              <div className="category-overlay">
                <h3>Women</h3>
              </div>
            </Link>
            <Link to="/kids.html" className="category-card">
              <img src="/images/kids_category_new_1782340216152.png" alt="Kids Fashion" />
              <div className="category-overlay">
                <h3>Kids</h3>
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
            {products.filter(p => p.category === 'Men').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
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
            {products.filter(p => p.category === 'Women').slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
