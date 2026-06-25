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

      <section className="categories section">
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
