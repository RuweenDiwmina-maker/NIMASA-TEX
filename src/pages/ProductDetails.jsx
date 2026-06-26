import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProduct();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find(p => p.id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.image);
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>Product not found</h2>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Return to Home</button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const hasMultipleImages = product.gallery && product.gallery.length > 0;
  
  // Combine main image, hover image (if any) and gallery images for thumbnails
  const allImages = [product.image];
  if (product.hoverImage) allImages.push(product.hoverImage);
  if (product.gallery) allImages.push(...product.gallery);

  const numericPrice = Number((product.price || "0").replace(/[^0-9.-]+/g, ""));

  const getCategoryLink = (category) => {
    if (!category) return "/products.html";
    const lower = category.toLowerCase();
    if (lower.includes('men') && !lower.includes('women')) return "/men.html";
    if (lower.includes('women')) return "/women.html";
    if (lower.includes('kid')) return "/kids.html";
    if (lower.includes('accessor')) return "/accessories.html";
    if (lower.includes('sale')) return "/sale.html";
    return "/products.html";
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      category: product.category,
      color: "Default",
      size: selectedSize || "M",
      price: numericPrice,
      image: product.image,
      quantity: quantity
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart.html');
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="pd-page-wrapper">
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span>&gt;</span>
        <Link to={getCategoryLink(product.category)}>{product.category || 'Products'}</Link>
        <span>&gt;</span>
        <span style={{ color: 'var(--color-gray-400)' }}>{product.title}</span>
      </div>
      <div className="pd-layout">
        
        {/* Left: Images */}
        <div className="pd-image-section">
          {/* Main Image / Mobile Slider */}
          <div className="pd-main-image-container">
            <img src={mainImage} alt={product.title} className="pd-main-image desktop-only" />
            <div className="pd-mobile-slider mobile-only">
              {allImages.map((img, index) => (
                <div className="pd-slide" key={index}>
                  <img src={img} alt={`${product.title} ${index}`} className="pd-slide-img" />
                </div>
              ))}
            </div>
            {user && (
              <button 
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  color: inWishlist ? 'var(--color-primary)' : 'var(--color-black)'
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            )}
          </div>
          
          {/* Desktop Thumbnails */}
          {allImages.length > 1 && (
            <div className="pd-thumbnails desktop-only">
              {allImages.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Thumbnail ${index}`} 
                  className="pd-thumbnail-img"
                  style={{ 
                    border: mainImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-200)',
                  }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="pd-details-section">
          <div className="pd-title-block">
            <p className="pd-category-subtitle">{product.category}</p>
            <h1 className="pd-title">{product.title}</h1>
          </div>

          <div className="pd-price-block">
            <span className="pd-price" style={{ color: product.isSale ? '#ef4444' : 'var(--color-black)' }}>
              {product.price}
            </span>
            {product.isSale && product.originalPrice && (
              <span className="pd-original-price">
                {product.originalPrice}
              </span>
            )}
          </div>

          <div className="pd-stock-status">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {product.stock ? `${product.stock} In Stock` : 'In Stock'}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pd-size-block">
              <h3 className="pd-size-title">Size</h3>
              <div className="pd-size-grid">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pd-actions-block">
            <div className="pd-quantity-selector">
              <button onClick={decrementQuantity}>-</button>
              <div className="pd-quantity-val">{quantity}</div>
              <button onClick={incrementQuantity}>+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn-primary pd-add-btn"
            >
              {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>

          <button 
            onClick={handleBuyNow}
            className="pd-buy-btn"
          >
            Buy it now
          </button>

          {/* Description */}
          {product.description && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--color-gray-200)' }}>
              <h3 style={{ marginBottom: '15px' }}>Description</h3>
              <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
