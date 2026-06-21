import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';



const Men = () => {
  const { products: allProducts } = useProduct();
  const menProducts = allProducts.filter(p => p.category.includes("Men"));
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Men</div>
          
        </div>
      </nav>

      <HeroCarousel targetPage="Men" />

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
