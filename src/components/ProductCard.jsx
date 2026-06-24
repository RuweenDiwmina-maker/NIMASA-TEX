import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product, isNikeStyle = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const priceStr = product.price || "0";
    const numericPrice = Number(priceStr.replace(/[^0-9.-]+/g, ""));
    
    addToCart({
      id: product.id || Math.random().toString(36).substr(2, 9),
      name: product.title,
      category: product.category,
      color: "Default",
      size: "M",
      price: numericPrice,
      image: product.image
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const renderProductImageArea = () => (
    <div className="product-image-wrap">
      <img src={product.image} alt={product.title} className="primary-img" loading="lazy" />
      {product.hoverImage && <img src={product.hoverImage} alt={product.title + " Alternate"} className="hover-img" loading="lazy" />}
      
      {/* Top right floating icons on hover */}
      <div className="hover-actions-top-right">
        <button 
          className="hover-icon-btn" 
          onClick={handleWishlistClick}
          title="Add to Wishlist"
        >
          <svg viewBox="0 0 24 24" fill={inWishlist ? "var(--color-primary)" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button 
          className="hover-icon-btn quick-view-btn" 
          onClick={handleQuickViewClick}
          title="Quick View"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span className="quick-view-text">Quick View</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className={isNikeStyle ? "nike-product-card" : "product-card"} 
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: 'pointer' }}
      >
        {renderProductImageArea()}
        <div className={isNikeStyle ? "nike-product-info" : "product-info"}>
          <h3 className={isNikeStyle ? "text-red" : "product-title"}>{product.title}</h3>
          <p className={isNikeStyle ? "" : "product-category"}>{product.category}</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', justifyContent: isNikeStyle ? 'flex-start' : 'center' }}>
            <p className={isNikeStyle ? "nike-price" : "product-price"} style={{ color: product.isSale ? '#ef4444' : 'inherit', margin: 0 }}>{product.price}</p>
            {product.isSale && product.originalPrice && (
              <p style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{product.originalPrice}</p>
            )}
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-sizes-container">
              {product.sizes.map((size) => (
                <div key={size} className="product-size-box">{size}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
