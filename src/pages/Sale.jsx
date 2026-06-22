import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';



const Sale = () => {
  const { products: allProducts } = useProduct();
  const products = allProducts.filter(p => p.isSale);
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Sale</div>
          
        </div>
      </nav>

      <HeroCarousel targetPage="Sale" />

      <main className="container" style={{maxWidth: '1920px', padding: '0 48px'}}>
        <h2 className="nike-section-title">Latest & Greatest</h2>
        <div className="nike-product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} isNikeStyle={true} />)}
        </div>
      </main>
    </>
  );
};

export default Sale;
