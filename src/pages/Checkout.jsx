import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, clearCart } = useCart();
  const { user, updateUserPoints } = useAuth();
  
  const [deliveryMethod, setDeliveryMethod] = useState('deliver');
  const [shippingOption, setShippingOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formValid, setFormValid] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [targetRoute, setTargetRoute] = useState('');
  const [usePoints, setUsePoints] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  });

  // Auto-fill checkout form if user is logged in
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city !== undefined ? user.city : prev.city
      }));
    }
  }, [user]);

  const [billingOption, setBillingOption] = useState('same');
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if required fields are filled to enable Place Order
    if (formData.firstName && formData.lastName && formData.address && formData.phone) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [formData]);

  // Lock body scroll when leave modal is open
  useEffect(() => {
    if (showLeaveModal || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLeaveModal, showSuccessModal]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = shippingOption === 'standard' ? 500 : 1000;
  
  const userPoints = user?.isLoyaltyMember ? (user?.points || 0) : 0;
  const pointsDiscount = (user?.isLoyaltyMember && usePoints) ? Math.min(userPoints, subtotal) : 0;
  const codFee = paymentMethod === 'cod' ? 40 : 0;
  const total = subtotal + deliveryFee - pointsDiscount + codFee;
  const earnedPoints = user?.isLoyaltyMember ? Math.floor((subtotal - pointsDiscount) / 100) : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(price);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (formValid && !(paymentMethod === 'cod' && !user)) {
      try {
        const orderData = {
          items: cartItems,
          totalAmount: total,
          customerDetails: { ...formData, email: user ? user.email : '' },
          shippingMethod: deliveryMethod,
          shippingOption: deliveryMethod === 'deliver' ? shippingOption : null,
          paymentMethod: paymentMethod,
          billingDetails: paymentMethod === 'cod' && billingOption === 'different' ? billingData : null,
          userId: user ? user.uid : null,
          createdAt: serverTimestamp(),
          status: 'pending'
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setPlacedOrderId(docRef.id);

        if (user && user.isLoyaltyMember) {
          const finalPoints = userPoints - pointsDiscount + earnedPoints;
          await updateUserPoints(user.uid, finalPoints);
        }

        setSuccessMessage(`Order placed successfully!${user?.isLoyaltyMember ? ` You earned ${earnedPoints} points.` : ''} Thank you for shopping with Nimasa Tex.`);
        setShowSuccessModal(true);
        clearCart();
      } catch (error) {
        console.error("Error placing order: ", error);
        setSuccessMessage("There was an error placing your order. Please try again.");
        setShowSuccessModal(true);
      }
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
          <img src="/images/full_logo.png" alt="Nimasa Tex" style={{ height: '40px', objectFit: 'contain' }} />
        </a>
        <div className="checkout-header-actions">
          <a href="/cart.html" style={{ color: 'var(--color-black)' }} onClick={(e) => handleLeaveClick(e, '/cart.html')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </a>
        </div>
      </header>

      <main className="checkout-container">
        
        {/* Summary Accordion - Mobile Only */}
        <div className="checkout-mobile-summary">
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
        </div>

        <div className="checkout-layout">
          <div className="checkout-left-col">
          {/* Delivery Section */}
          <div className="checkout-section">
          <h2 className="checkout-section-title">Delivery</h2>
          
          <div className="toggle-group">
            <button 
              className={`toggle-btn ${deliveryMethod === 'deliver' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('deliver')}
            >
              <span style={{ fontSize: '20px' }}>🚚</span>
              Deliver It
            </button>
            <button 
              className={`toggle-btn ${deliveryMethod === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryMethod('pickup')}
            >
              <span style={{ fontSize: '20px' }}>🏬</span>
              Pick It Up
            </button>
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
          
          <div className="checkout-payment-accordion">
            {/* Payzy */}
            <label className={`payment-accordion-item ${paymentMethod === 'card' ? 'active' : ''}`}>
              <div className="payment-accordion-header">
                <div className="payment-radio-left">
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span>Credit or Debit Card</span>
                </div>
                <div className="payment-icons">
                  <span className="payment-icon-badge" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                    <img src="/images/icons8-visa-144.png" alt="Visa" style={{ height: '24px', width: '38px', objectFit: 'contain', borderRadius: '3px' }} />
                  </span>
                  <span className="payment-icon-badge" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                    <img src="/images/ma_symbol_opt_73_1x.png" alt="Mastercard" style={{ height: '24px', width: '38px', objectFit: 'contain', borderRadius: '3px' }} />
                  </span>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="payment-accordion-body" style={{ backgroundColor: '#f6f8fb', padding: '1rem', borderTop: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div className="floating-input-group" style={{ position: 'relative' }}>
                    <input type="text" className="floating-input" placeholder=" " />
                    <label className="floating-label">Card number</label>
                    <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-500)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="floating-input-group" style={{ flex: 1 }}>
                      <input type="text" className="floating-input" placeholder=" " />
                      <label className="floating-label">Expiration date (MM / YY)</label>
                    </div>
                    <div className="floating-input-group" style={{ flex: 1, position: 'relative' }}>
                      <input type="text" className="floating-input" placeholder=" " />
                      <label className="floating-label">Security code</label>
                      <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-500)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                  </div>
                  <div className="floating-input-group">
                    <input type="text" className="floating-input" placeholder=" " />
                    <label className="floating-label">Name on card</label>
                  </div>
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
                  {!user ? (
                    <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', color: '#856404', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem', marginTop: '-2px' }}>⚠️</span>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                        <strong>Members Only Feature:</strong> Cash on Delivery (COD) is exclusively available for registered Nimasa Tex members. Please <Link to="/login" style={{ color: '#856404', textDecoration: 'underline', fontWeight: '600', margin: '0 4px' }}>log in</Link> or <Link to="/signup" style={{ color: '#856404', textDecoration: 'underline', fontWeight: '600', marginLeft: '4px' }}>sign up</Link> to use this payment method.
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', lineHeight: '1.4' }}>
                      The Cash on Delivery payment method requires an additional fee of Rs. 40.00 that you will have to pay at delivery. This fee will be added to your order total automatically and is required by our courier. If you have questions, feel free to contact us.
                    </p>
                  )}
                </div>
              )}
            </label>
            </div>
          </div>
          
          {/* Billing Address Section */}
          {paymentMethod === 'cod' && user && (
            <div className="checkout-section">
              <h2 className="checkout-section-title">Billing address</h2>
              <div className="checkout-payment-accordion">
                <label className={`payment-accordion-item ${billingOption === 'same' ? 'active' : ''}`}>
                  <div className="payment-accordion-header">
                    <div className="payment-radio-left">
                      <input type="radio" name="billing" checked={billingOption === 'same'} onChange={() => setBillingOption('same')} />
                      <span>Same as shipping address</span>
                    </div>
                  </div>
                </label>
                
                <label className={`payment-accordion-item ${billingOption === 'different' ? 'active' : ''}`}>
                  <div className="payment-accordion-header">
                    <div className="payment-radio-left">
                      <input type="radio" name="billing" checked={billingOption === 'different'} onChange={() => setBillingOption('different')} />
                      <span>Use a different billing address</span>
                    </div>
                  </div>
                  {billingOption === 'different' && (
                    <div className="payment-accordion-body" style={{ backgroundColor: '#f6f8fb', padding: '1rem', borderTop: '1px solid var(--color-gray-200)' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <select style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--color-gray-400)' }}>
                          <option>Sri Lanka</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <div className="floating-input-group">
                          <input type="text" name="firstName" className="floating-input" placeholder=" " value={billingData.firstName} onChange={handleBillingChange} />
                          <label className="floating-label">First name</label>
                        </div>
                        <div className="floating-input-group">
                          <input type="text" name="lastName" className="floating-input" placeholder=" " value={billingData.lastName} onChange={handleBillingChange} />
                          <label className="floating-label">Last name</label>
                        </div>
                      </div>
                      <div className="floating-input-group">
                        <input type="text" name="address" className="floating-input" placeholder=" " value={billingData.address} onChange={handleBillingChange} />
                        <label className="floating-label">Address</label>
                      </div>
                      <div className="floating-input-group">
                        <input type="text" name="apartment" className="floating-input" placeholder=" " value={billingData.apartment} onChange={handleBillingChange} />
                        <label className="floating-label">Apartment, suite, etc. (optional)</label>
                      </div>
                      <div className="form-row">
                        <div className="floating-input-group">
                          <input type="text" name="city" className="floating-input" placeholder=" " value={billingData.city} onChange={handleBillingChange} />
                          <label className="floating-label">City</label>
                        </div>
                        <div className="floating-input-group">
                          <input type="text" name="postalCode" className="floating-input" placeholder=" " value={billingData.postalCode} onChange={handleBillingChange} />
                          <label className="floating-label">Postal code (optional)</label>
                        </div>
                      </div>
                      <div className="floating-input-group">
                        <input type="tel" name="phone" className="floating-input" placeholder=" " value={billingData.phone} onChange={handleBillingChange} />
                        <label className="floating-label">Phone (optional)</label>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-right-col">
          <div className="checkout-desktop-summary">
            {/* Loyalty Points */}
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

            {/* Item Summary (Actual Cart Items) */}
            <div className="checkout-items-summary" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="checkout-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {cartItems.map((item, index) => (
                  <div className="checkout-item-row" key={`${item.id}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', border: '1px solid var(--color-gray-200)', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image || '/images/default.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }} />
                      <span style={{
                        position: 'absolute', top: '-10px', right: '-10px', background: '#000', 
                        color: '#fff', fontSize: '12px', fontWeight: '500', width: '22px', height: '22px', borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fafafa'
                      }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="checkout-item-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-gray-900)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>{item.size}</div>
                    </div>
                    <div className="checkout-item-price" style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>


              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--color-gray-700)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem' }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Shipping
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-gray-500)' }}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(deliveryFee)}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem' }}>COD Fee</span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(40)}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-gray-900)' }}>Total</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)' }}>LKR</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-gray-900)' }}>{formatPrice(total).replace('LKR', '').trim()}</span>
                </div>
              </div>
            </div>

        {/* Place Order */}
        <div className="terms-text">
          By clicking Place Order, you agree to the Nimasa Tex <a href="#">Terms and Conditions</a>.
        </div>
          <button 
            className={`btn-place-order ${formValid && !(paymentMethod === 'cod' && !user) ? 'enabled' : ''}`} 
            onClick={handlePlaceOrder}
            disabled={!formValid || (paymentMethod === 'cod' && !user)}
          >
            Place Order
          </button>
          </div>
        </div>
        </div>

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

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px 30px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: successMessage.includes('error') ? '#fee2e2' : '#dcfce7', color: successMessage.includes('error') ? '#ef4444' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {successMessage.includes('error') ? (
                <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: '#111' }}>
              {successMessage.includes('error') ? 'Oops!' : 'Success!'}
            </h3>
            <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6', marginBottom: placedOrderId ? '15px' : '30px' }}>
              {successMessage}
            </p>
            {placedOrderId && (
              <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1', marginBottom: '30px' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase' }}>Your Order ID</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '1px' }}>
                  #{placedOrderId.slice(-6).toUpperCase()}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>Save this ID to track your order.</p>
              </div>
            )}
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                if (!successMessage.includes('error')) {
                  navigate('/');
                }
              }}
              style={{ width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
            >
              {successMessage.includes('error') ? 'Try Again' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
