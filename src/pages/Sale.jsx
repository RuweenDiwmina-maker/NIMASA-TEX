import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';



const Sale = () => {
  const { products: allProducts } = useProduct();
  const products = allProducts.slice(0, 4);
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Sale</div>
          
        </div>
      </nav>

      <header className="nike-hero">
        <img src="/images/sale_hero_1779900247375.png" alt="Sale Hero" className="nike-hero-img" />
        <div className="nike-hero-content">
          <h1 className="nike-hero-title">SALE</h1>
          <p className="nike-hero-subtitle">Don't miss out on premium gear at reduced prices.</p>
          <div className="nike-hero-buttons">
            <button className="btn-pill-dark">Shop New Arrivals</button>
            <button className="btn-pill-light">Shop All Sale</button>
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

export default Sale;
