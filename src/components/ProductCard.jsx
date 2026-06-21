import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, isNikeStyle = false }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // Clean price string (e.g. "LKR 18,000.00" -> 18000)
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

  if (isNikeStyle) {
    return (
      <div className="nike-product-card">
        <div className="nike-product-img-wrap">
          <img src={product.image} alt={product.title} className="primary-img" loading="lazy" />
          {product.hoverImage && <img src={product.hoverImage} alt={product.title + " Alternate"} className="hover-img" loading="lazy" />}
          <div className="product-actions">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              {added ? "Added ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
        <div className="nike-product-info">
          <h3 className="text-red">{product.title}</h3>
          <p>{product.category}</p>
          <p className="nike-price">{product.price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.title} className="primary-img" loading="lazy" />
        {product.hoverImage && <img src={product.hoverImage} alt={product.title + " Alternate"} className="hover-img" loading="lazy" />}
        <div className="product-actions">
          <button className="btn-add-cart" onClick={handleAddToCart}>
             {added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
