import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListing from '../components/ProductListing';
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

      <main>
        <ProductListing products={menProducts} title="Latest & Greatest" />
      </main>
    </>
  );
};

export default Men;
