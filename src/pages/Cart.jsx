import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = ({ openSignIn }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = cartItems.length > 0 ? 500 : 0;
  const total = subtotal + delivery;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  const handleMemberCheckout = (e) => {
    if (!user) {
      e.preventDefault();
      if (openSignIn) {
        openSignIn();
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet. Discover the latest styles in our collections.</p>
          <Link to="/new-releases.html" className="btn btn-pill-dark empty-cart-btn">Shop New Releases</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-layout">
        {/* Left Side: Bag Items */}
        <div className="cart-items-section">
          <h1 className="cart-title">CART</h1>
          
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-header">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-color">{item.color}</p>
                      <div className="item-meta">
                        <span className="item-size">Size {item.size}</span>
                      </div>
                      <div className="item-actions-mobile">
                         <span className="item-price-mobile">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="item-price-desktop">
                      <span>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Summary */}
        <div className="cart-summary-section">
          <h2 className="summary-title">Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Delivery & Handling</span>
            <span>{formatPrice(delivery)}</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          <div className="summary-actions">
            <Link to="/checkout" className="btn btn-pill-dark checkout-btn" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>Guest Checkout</Link>
            <Link to="/checkout" onClick={handleMemberCheckout} className="btn btn-pill-dark checkout-member-btn" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', background: 'white', color: 'black', border: '1px solid black' }}>Member Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
