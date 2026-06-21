import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';



const Kids = () => {
  const { products: allProducts } = useProduct();
  const products = allProducts.filter(p => p.category.includes("Kid"));
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Kids</div>
          
        </div>
      </nav>

      <header className="nike-hero">
        <img src="/images/kids_hero_1779900231979.png" alt="Kids Hero" className="nike-hero-img" />
        <div className="nike-hero-content">
          <h1 className="nike-hero-title">KIDS</h1>
          <p className="nike-hero-subtitle">Gear up the next generation of athletes.</p>
          <div className="nike-hero-buttons">
            <button className="btn-pill-dark">Shop New Arrivals</button>
            <button className="btn-pill-light">Shop All Kids</button>
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

export default Kids;
