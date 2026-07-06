import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListing from '../components/ProductListing';
import HeroCarousel from '../components/HeroCarousel';



const Women = () => {
  const { products: allProducts } = useProduct();
  const products = allProducts.filter(p => p.category.includes("Women"));
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Women</div>
          
        </div>
      </nav>

      <HeroCarousel targetPage="Women" />

      <main>
        <ProductListing products={products} title="Latest & Greatest" />
      </main>
    </>
  );
};

export default Women;
