import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const priceStr = product.price || "0";
  const numericPrice = Number(priceStr.replace(/[^0-9.-]+/g, ""));
  const subtotal = numericPrice * quantity;

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    
    // Add multiple items if quantity > 1
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id || Math.random().toString(36).substr(2, 9),
        name: product.title,
        category: product.category,
        color: "Default",
        size: "M",
        price: numericPrice,
        image: product.image
      });
    }
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    handleAddToCart();
    navigate('/cart');
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="modal-overlay active" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
        maxWidth: '900px', width: '90%', display: 'flex', padding: 0, overflow: 'hidden', backgroundColor: '#fff',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        maxHeight: '90vh', overflowY: 'auto', overscrollBehavior: 'contain'
      }}>
        <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        
        {/* Left Side: Image */}
        <div style={{ flex: '1', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
          <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }} />
        </div>
        
        {/* Right Side: Details */}
        <div style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid #f1f5f9' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '15px', color: '#111' }}>{product.title}</h2>
          
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            Availability: <span style={{ color: '#111' }}>In Stock</span>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
            Product Type: <span style={{ color: '#111' }}>{product.category}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'baseline', marginBottom: '25px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: product.isSale ? '#ef4444' : '#111' }}>
              {product.price}
            </span>
            {product.isSale && product.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '16px' }}>{product.originalPrice}</span>
            )}
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px' }}>Quantity:</div>
            <div style={{ display: 'inline-flex', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <button onClick={decreaseQuantity} style={{ padding: '8px 15px', background: '#fff', border: 'none', borderRight: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '18px' }}>-</button>
              <div style={{ padding: '8px 20px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px' }}>{quantity}</div>
              <button onClick={increaseQuantity} style={{ padding: '8px 15px', background: '#fff', border: 'none', borderLeft: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '18px' }}>+</button>
            </div>
          </div>

          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '25px', color: '#111' }}>
            Subtotal: Rs {subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                style={{ 
                  flex: 1, padding: '14px', fontSize: '15px', fontWeight: '600',
                  backgroundColor: '#00205b', color: '#fff', border: 'none', cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00153d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00205b'}
                onClick={handleAddToCart}
              >
                {added ? "ADDED ✓" : "ADD TO CART"}
              </button>
              {user && (
                <button style={{ padding: '0 15px', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
            </div>
            
            {user && (
              <button 
                style={{ 
                  width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600',
                  backgroundColor: '#fff', color: '#00205b', border: '1px solid #00205b', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#00205b'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#00205b' }}
                onClick={handleBuyNow}
              >
                BUY IT NOW
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
