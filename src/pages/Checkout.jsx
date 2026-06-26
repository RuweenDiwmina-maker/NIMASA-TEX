import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems } = useCart();
  const { user, updateUserPoints } = useAuth();
  
  const [deliveryMethod, setDeliveryMethod] = useState('deliver');
  const [shippingOption, setShippingOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formValid, setFormValid] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [targetRoute, setTargetRoute] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if required fields are filled to enable Place Order
    if (formData.email && formData.firstName && formData.lastName && formData.address && formData.phone) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [formData]);

  // Lock body scroll when leave modal is open
  useEffect(() => {
    if (showLeaveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLeaveModal]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = shippingOption === 'standard' ? 500 : 1000;
  
  const userPoints = user?.isLoyaltyMember ? (user?.points || 0) : 0;
  const pointsDiscount = (user?.isLoyaltyMember && usePoints) ? Math.min(userPoints, subtotal) : 0;
  const total = subtotal + deliveryFee - pointsDiscount;
  const earnedPoints = user?.isLoyaltyMember ? Math.floor((subtotal - pointsDiscount) / 100) : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (formValid) {
      if (user && user.isLoyaltyMember) {
        const finalPoints = userPoints - pointsDiscount + earnedPoints;
        await updateUserPoints(user.uid, finalPoints);
      }
      alert(`Order placed successfully!${user?.isLoyaltyMember ? ` You earned ${earnedPoints} points.` : ''} Thank you for shopping with Nimasa Tex.`);
      // In a real app, you would clear cart and navigate to a success page here
    }
  };

  const handleLeaveClick = (e, route) => {
    e.preventDefault();
    setTargetRoute(route);
    setShowLeaveModal(true);
  };
  
  const confirmLeave = () => {
    navigate(targetRoute);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '0' }}>
      {/* Minimal Header */}
      <header className="checkout-header">
        <a href="/" className="logo" onClick={(e) => handleLeaveClick(e, '/')}>
          <img src="/images/Logo_black.png" alt="Nimasa Tex" />
        </a>
        <div className="checkout-header-actions">
          <a href="/cart.html" style={{ color: 'var(--color-black)' }} onClick={(e) => handleLeaveClick(e, '/cart.html')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </a>
        </div>
      </header>

      <main className="checkout-container">
        
        {/* Summary Accordion */}
        <div className="checkout-summary-accordion">
          <div className="summary-accordion-header">
            <span>Summary</span>
            <span className="summary-accordion-price">{formatPrice(total)} ({totalItems} item{totalItems !== 1 && 's'}) ▾</span>
          </div>
          {usePoints && (
            <div style={{ color: '#00C896', fontSize: '0.9rem', marginBottom: '10px' }}>
              Points Discount Applied: -{formatPrice(pointsDiscount)}
            </div>
          )}
          <div className="summary-free-shipping">
            Add {formatPrice(15000)} more to earn Free Shipping!
          </div>
          <div className="shipping-progress-bar">
            <div className="shipping-progress-fill" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Delivery</h2>
          
          <div className="toggle-group">
            <button 
              className={`toggle-btn ${deliveryMethod === 'deliver' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('deliver')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Deliver It
            </button>
            <button 
              className={`toggle-btn ${deliveryMethod === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('pickup')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Pick It Up
            </button>
          </div>

          <div className="floating-input-group">
            <input type="email" name="email" className="floating-input" placeholder=" " value={formData.email} onChange={handleChange} required />
            <label className="floating-label">Email *</label>
            <div className="input-helper-text">Become a Member to get Free Shipping. <a href="#" style={{textDecoration: 'underline'}}>Log in</a> or <a href="#" style={{textDecoration: 'underline'}}>Sign up now</a></div>
          </div>

          <div className="floating-input-group">
            <input type="text" name="firstName" className="floating-input" placeholder=" " value={formData.firstName} onChange={handleChange} required />
            <label className="floating-label">First Name *</label>
          </div>

          <div className="floating-input-group">
            <input type="text" name="lastName" className="floating-input" placeholder=" " value={formData.lastName} onChange={handleChange} required />
            <label className="floating-label">Last Name *</label>
          </div>

          <div className="floating-input-group">
            <input type="text" name="address" className="floating-input" placeholder=" " value={formData.address} onChange={handleChange} required />
            <label className="floating-label">Start typing a street address or postcode *</label>
            <div className="input-helper-text">We do not ship to P.O. boxes</div>
          </div>
          
          <div style={{ margin: '1rem 0 1.5rem' }}>
            <a href="#" style={{ textDecoration: 'underline', color: 'var(--color-black)', fontSize: '0.9rem' }}>Enter address manually</a>
          </div>

          <div className="floating-input-group">
            <input type="tel" name="phone" className="floating-input" placeholder=" " value={formData.phone} onChange={handleChange} required />
            <label className="floating-label">Phone Number *</label>
            <div className="input-helper-text">A carrier might contact you to confirm delivery.</div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="billingMatch" defaultChecked />
            <label htmlFor="billingMatch">Billing matches shipping address</label>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Shipping</h2>

          <div className="selection-box" style={{ marginBottom: '1.5rem', cursor: 'default' }}>
            <div className="selection-box-left">
              <span className="selection-box-title">Free shipping and returns for members</span>
              <span className="selection-box-desc">Become a Member</span>
            </div>
          </div>

          <div 
            className={`selection-box ${shippingOption === 'standard' ? 'active' : ''}`}
            onClick={() => setShippingOption('standard')}
          >
            <div className="selection-box-left">
              <span className="selection-box-title">Arrives in 2-4 Business Days</span>
            </div>
            <div className="selection-box-right">{formatPrice(500)}</div>
          </div>

          <div 
            className={`selection-box ${shippingOption === 'express' ? 'active' : ''}`}
            onClick={() => setShippingOption('express')}
          >
            <div className="selection-box-left">
              <span className="selection-box-title">Arrives Next Business Day</span>
            </div>
            <div className="selection-box-right">{formatPrice(1000)}</div>
          </div>
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h2 className="checkout-section-title">Payment</h2>
          
          <div style={{ marginBottom: '1rem' }}>Have a promo code?</div>
          <div className="promo-input-group">
            <div className="floating-input-group" style={{ flexGrow: 1, marginBottom: 0 }}>
              <input type="text" className="floating-input" placeholder="Promo" />
            </div>
            <button className="btn-apply">Apply</button>
          </div>
          <div className="input-helper-text" style={{ marginTop: '-1.5rem', marginBottom: '2rem' }}>Limit 1 promo per order.</div>

          {user && user.isLoyaltyMember && (
            <div className="points-redemption-box" style={{ padding: '1.2rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Loyalty Points</span>
                <span style={{ fontWeight: 700, color: '#00C896' }}>{userPoints} Available</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
                You can use your points for a discount! (1 Point = 1 LKR). 
                You will also earn <strong>{earnedPoints} points</strong> on this order.
              </p>
              {userPoints > 0 ? (
                <div className="checkbox-group" style={{ marginBottom: 0 }}>
                  <input 
                    type="checkbox" 
                    id="usePoints" 
                    checked={usePoints} 
                    onChange={(e) => setUsePoints(e.target.checked)} 
                  />
                  <label htmlFor="usePoints">Use points for {formatPrice(Math.min(userPoints, subtotal))} discount</label>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', fontStyle: 'italic' }}>
                  No points available to redeem yet.
                </div>
              )}
            </div>
          )}

          <div className="checkout-payment-accordion">
            {/* Payzy */}
            <label className={`payment-accordion-item ${paymentMethod === 'card' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>Credit or Debit Card</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge">
                    <svg viewBox="0 0 38 24" width="38" height="24" fill="none" style={{ color: '#1a1f71' }}><path d="M13.5 17.5h3.2l2-11.5h-3.2l-2 11.5zM26.2 6.2c-.6-.2-1.6-.4-2.8-.4-3.1 0-5.3 1.6-5.3 4 0 1.7 1.5 2.7 2.7 3.3 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-2.9-.6l-.4-.2-.4 2.7c.7.3 2 .6 3.4.6 3.3 0 5.5-1.6 5.5-4.1 0-1.4-1-2.4-2.6-3.1-1.1-.5-1.8-.9-1.8-1.4 0-.4.5-1 1.8-1 .9 0 1.7.2 2.3.5l.3.1.5-2.6zM29.5 17.5h3l-2.6-11.5h-2.5c-.5 0-.9.2-1.1.7L22 17.5h3.4l.7-1.8h4.1l.3 1.8z" fill="currentColor"/><path d="M26.5 13.9l1.7-4.6h-.1l-.9 4.6h-.7z" fill="#f7b600"/><path d="M12.6 6h-3.1L6.7 14l-.3-1.6C6.1 11.2 4.4 9 2.5 8l1.4 9.5h3.3l4.4-11.5z" fill="currentColor"/></svg>
                  </span>
                  <span className="payment-icon-badge">
                    <svg viewBox="0 0 38 24" width="38" height="24" fill="none"><circle cx="12" cy="12" r="8" fill="#eb001b"/><circle cx="26" cy="12" r="8" fill="#f79e1b"/><path d="M19 19.5c-2.8 0-5.2-1.5-6.5-3.8.8-2.3 3.1-4 5.9-4s5.1 1.7 5.9 4c-1.3 2.3-3.7 3.8-6.5 3.8z" fill="#ff5f00"/></svg>
                  </span>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="payment-accordion-body">
                  You'll be redirected to a secure gateway to complete your purchase.
                </div>
              )}
            </label>

            {/* Koko */}
            <label className={`payment-accordion-item ${paymentMethod === 'koko' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'koko'} onChange={() => setPaymentMethod('koko')} />
                  <span>Koko: Buy Now Pay Later</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge"><span style={{ fontWeight: 800, color: '#f36', fontSize: '0.8rem' }}>Koko</span></span>
                </div>
              </div>
              {paymentMethod === 'koko' && (
                <div className="payment-accordion-body">
                  You'll be redirected to Koko to complete your purchase in 3 installments.
                </div>
              )}
            </label>

            {/* Mintpay */}
            <label className={`payment-accordion-item ${paymentMethod === 'mintpay' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'mintpay'} onChange={() => setPaymentMethod('mintpay')} />
                  <span>Mintpay | Shop now. Pay later.</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge"><span style={{ fontWeight: 800, color: '#00C896', fontSize: '0.8rem' }}>mintpay</span></span>
                </div>
              </div>
              {paymentMethod === 'mintpay' && (
                <div className="payment-accordion-body">
                  You'll be redirected to Mintpay to complete your purchase.
                </div>
              )}
            </label>

            {/* Bank Transfer */}
            <label className={`payment-accordion-item ${paymentMethod === 'bank' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                  <span>Bank Transfer</span>
                </div>
              </div>
              {paymentMethod === 'bank' && (
                <div className="payment-accordion-body">
                  Our bank details will be shown on the next step.
                </div>
              )}
            </label>
            
            {/* Cash on Delivery */}
            <label className={`payment-accordion-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </div>
              {paymentMethod === 'cod' && (
                <div className="payment-accordion-body">
                  Pay with cash upon delivery.
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Item Summary (Actual Cart Items) */}
        <div className="checkout-items-summary">
          {cartItems.map((item, index) => (
            <div className="checkout-item-row" key={`${item.id}-${index}`}>
              <div style={{ position: 'relative' }}>
                <img src={item.image || '/images/default.jpg'} alt={item.name} className="checkout-item-img" />
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px', background: 'rgba(114,114,114,0.9)', 
                  color: '#fff', fontSize: '12px', width: '20px', height: '20px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.quantity}
                </span>
              </div>
              <div className="checkout-item-details">
                <div className="checkout-item-title">{item.name}</div>
                <div className="checkout-item-qty">{item.color} / {item.size}</div>
              </div>
              <div className="checkout-item-price">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
          
          <div style={{ borderTop: '1px solid var(--color-gray-200)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>LKR</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{formatPrice(total).replace('LKR', '').trim()}</span>
            </div>
          </div>
        </div>

        {/* Place Order */}
        <div className="terms-text">
          By clicking Place Order, you agree to the Nimasa Tex <a href="#">Terms and Conditions</a>.
        </div>
        <button className={`btn-place-order ${formValid ? 'enabled' : ''}`} onClick={handlePlaceOrder}>
          Place Order
        </button>

      </main>

      <footer className="checkout-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Sri Lanka
        </div>
        <div className="checkout-footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">Terms of Sale</a>
          <a href="#">Privacy Policy</a>
        </div>
      </footer>

      {/* Leave Checkout Modal */}
      {showLeaveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'white', padding: '2.5rem 2rem', borderRadius: '16px',
            width: '90%', maxWidth: '400px', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '1rem' }}>Leaving Checkout</h2>
            <p style={{ color: 'var(--color-gray-800)', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
              Your checkout session will be lost. Do you want to leave checkout?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={confirmLeave}
                style={{ padding: '1.1rem', background: 'var(--color-black)', color: 'white', borderRadius: '30px', border: 'none', fontWeight: '500', fontSize: '1rem', cursor: 'pointer' }}
              >
                Leave Checkout
              </button>
              <button 
                onClick={() => setShowLeaveModal(false)}
                style={{ padding: '1.1rem', background: 'white', color: 'var(--color-black)', borderRadius: '30px', border: '1px solid var(--color-gray-400)', fontWeight: '500', fontSize: '1rem', cursor: 'pointer' }}
              >
                Resume Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
