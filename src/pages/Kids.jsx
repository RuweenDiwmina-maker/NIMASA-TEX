import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListing from '../components/ProductListing';
import HeroCarousel from '../components/HeroCarousel';



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

      <HeroCarousel targetPage="Kids" />

      <main>
        <ProductListing products={products} title="Latest & Greatest" />
      </main>
    </>
  );
};

export default Kids;
