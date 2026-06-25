import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListing from '../components/ProductListing';
import HeroCarousel from '../components/HeroCarousel';



const Sale = () => {
  const { products: allProducts } = useProduct();
  const products = allProducts.filter(p => p.isSale);
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Offer</div>
          
        </div>
      </nav>

      <HeroCarousel targetPage="Sale" />

      <main>
        <ProductListing products={products} title="Latest & Greatest" />
      </main>
    </>
  );
};

export default Sale;
