import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';



const NewReleases = () => {
  const { products: allProducts } = useProduct();
  
  // Filter for valid new releases
  const today = new Date().toISOString().split('T')[0];
  const products = allProducts.filter(p => p.isNewRelease && p.newReleaseExpiry >= today);
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">New Releases</div>
          
        </div>
      </nav>

      <header className="nike-hero">
        <img src="/images/new_releases_hero_1779900201787.png" alt="New Releases Hero" className="nike-hero-img" />
        <div className="nike-hero-content">
          <h1 className="nike-hero-title">NEW RELEASES</h1>
          <p className="nike-hero-subtitle">Be the first to wear our cutting-edge drops.</p>
          <div className="nike-hero-buttons">
            <button className="btn-pill-dark">Shop New Arrivals</button>
            <button className="btn-pill-light">Shop All New Releases</button>
          </div>
        </div>
      </header>

      <main className="container" style={{maxWidth: '1920px', padding: '0 48px'}}>
        <h2 className="nike-section-title">Latest & Greatest</h2>
        {products.length > 0 ? (
          <div className="nike-product-scroll">
            {products.map(p => <ProductCard key={p.id} product={p} isNikeStyle={true} />)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No new releases at the moment. Check back soon!</p>
        )}
      </main>
    </>
  );
};

export default NewReleases;
