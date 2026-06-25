import React from 'react';
import { useProduct } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListing from '../components/ProductListing';
import HeroCarousel from '../components/HeroCarousel';



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

      <HeroCarousel targetPage="New Releases" />

      <main>
        {products.length > 0 ? (
          <ProductListing products={products} title="Latest & Greatest" />
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No new releases at the moment. Check back soon!</p>
        )}
      </main>
    </>
  );
};

export default NewReleases;
