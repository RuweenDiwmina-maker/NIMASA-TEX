import React from 'react';
import { useCart } from '../context/CartContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
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
    setTimeout(() => {
      setAdded(false);
      onClose(); // Auto close after adding
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', display: 'flex', padding: 0, overflow: 'hidden' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ flex: '1', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        </div>
        
        <div style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', marginBottom: '10px' }}>{product.title}</h2>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '20px' }}>{product.category}</p>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'baseline', marginBottom: '30px' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: product.isSale ? '#ef4444' : 'var(--color-black)' }}>
              {product.price}
            </span>
            {product.isSale && product.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{product.originalPrice}</span>
            )}
          </div>
          
          <button 
            className="btn-primary" 
            style={{ padding: '15px', fontSize: '16px' }}
            onClick={handleAddToCart}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
