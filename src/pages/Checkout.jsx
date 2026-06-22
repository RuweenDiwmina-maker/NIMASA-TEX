import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems } = useCart();
  
  const [deliveryMethod, setDeliveryMethod] = useState('deliver');
  const [shippingOption, setShippingOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formValid, setFormValid] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [targetRoute, setTargetRoute] = useState('');
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = shippingOption === 'standard' ? 500 : 1000;
  const total = subtotal + deliveryFee;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (formValid) {
      alert("Order placed successfully! Thank you for shopping with Nimasa Tex.");
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

          <div className="payment-methods-group">
            <div 
              className={`payment-method-box ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <span>Credit or Debit Card</span>
            </div>
            
            <div 
              className={`payment-method-box ${paymentMethod === 'koko' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('koko')}
            >
              <span style={{ fontWeight: 800, color: '#f36', fontSize: '1.2rem', padding: '0 5px' }}>Koko</span>
            </div>

            <div 
              className={`payment-method-box ${paymentMethod === 'mintpay' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('mintpay')}
            >
              <span style={{ fontWeight: 800, color: '#00C896', fontSize: '1.2rem', padding: '0 5px' }}>mintpay</span>
            </div>

            <div 
              className={`payment-method-box ${paymentMethod === 'bank' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/><line x1="8" y1="14" x2="8" y2="17"/><line x1="12" y1="14" x2="12" y2="17"/><line x1="16" y1="14" x2="16" y2="17"/></svg>
              <span>Bank Transfer</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>Enter your payment details:</div>
          {paymentMethod === 'card' && (
            <div style={{ padding: '1rem', border: '1px solid var(--color-gray-200)', borderRadius: '8px', marginTop: '1rem', background: '#f9f9f9' }}>
               <p style={{ color: 'var(--color-gray-400)', textAlign: 'center' }}>[ Payment Gateway loads here ]</p>
            </div>
          )}
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
