import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div style={{ paddingTop: '120px', minHeight: '60vh', paddingBottom: '60px' }}>
      <div className="nav-container" style={{ display: 'block' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '40px', textAlign: 'left', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '10px' }}>WISHLIST</h1>
        
        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ color: 'var(--color-gray-500)' }}>Your wishlist is empty</h2>
            <p style={{ marginTop: '10px' }}>Add items that you like to your wishlist.</p>
          </div>
        ) : (
          <div className="nike-product-grid" style={{ marginTop: '20px' }}>
            {wishlistItems.map(product => (
              <ProductCard key={product.id} product={product} isNikeStyle={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
