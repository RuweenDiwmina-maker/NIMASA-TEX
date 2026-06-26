import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    <div style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div className="nav-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        
        {/* Left: Images */}
        <div style={{ flex: '1 1 500px', display: 'flex', gap: '20px' }}>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '80px' }}>
              {allImages.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Thumbnail ${index}`} 
                  style={{ 
                    width: '80px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    cursor: 'pointer',
                    border: mainImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-200)',
                    borderRadius: '4px'
                  }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div style={{ flex: 1, backgroundColor: 'var(--color-gray-100)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img src={mainImage} alt={product.title} style={{ width: '100%', height: 'auto', maxHeight: '700px', objectFit: 'contain' }} />
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
        </div>

        {/* Right: Details */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', marginBottom: '8px' }}>{product.title}</h1>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '18px' }}>{product.category}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: product.isSale ? '#ef4444' : 'var(--color-black)' }}>
              {product.price}
            </span>
            {product.isSale && product.originalPrice && (
              <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--color-gray-400)' }}>
                {product.originalPrice}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 'bold' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {product.stock ? `${product.stock} In Stock` : 'In Stock'}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Size</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 20px',
                      border: selectedSize === size ? '2px solid var(--color-primary)' : '1px solid var(--color-gray-300)',
                      backgroundColor: selectedSize === size ? 'var(--color-primary)' : 'white',
                      color: selectedSize === size ? 'white' : 'var(--color-black)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', border: '1px solid var(--color-gray-300)', borderRadius: '4px', overflow: 'hidden', height: '50px' }}>
              <button onClick={decrementQuantity} style={{ padding: '0 15px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }}>-</button>
              <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: 'bold', borderLeft: '1px solid var(--color-gray-300)', borderRight: '1px solid var(--color-gray-300)' }}>
                {quantity}
              </div>
              <button onClick={incrementQuantity} style={{ padding: '0 15px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }}>+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn-primary"
              style={{ flex: 1, height: '50px', fontSize: '16px' }}
            >
              {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>

          <button 
            onClick={handleBuyNow}
            style={{ 
              width: '100%', 
              height: '50px', 
              backgroundColor: 'var(--color-black)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
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
