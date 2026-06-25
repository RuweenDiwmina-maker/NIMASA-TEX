import React from 'react';
import { useProduct } from '../context/ProductContext';
import ProductListing from '../components/ProductListing';
import HeroCarousel from '../components/HeroCarousel';

const Accessories = () => {
  const { products: allProducts } = useProduct();
  const accessoriesProducts = allProducts.filter(p => p.category.toLowerCase().includes("accessories") || p.category.toLowerCase().includes("belt") || p.category.toLowerCase().includes("wallet") || p.category.toLowerCase().includes("perfume") || p.category.toLowerCase().includes("sunglasses"));
  
  return (
    <>
      <nav className="category-navbar mt-category-nav">
        <div className="cat-nav-container">
          <div className="cat-title">Accessories</div>
        </div>
      </nav>

      <HeroCarousel targetPage="Accessories" />

      <main>
        <ProductListing products={accessoriesProducts} title="Premium Accessories" />
      </main>
    </>
  );
};

export default Accessories;
