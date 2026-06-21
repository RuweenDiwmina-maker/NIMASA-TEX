const fs = require('fs');
const path = require('path');

const cssToAppend = `
/* =========================================================================
   CHECKOUT PAGE STYLES (NIKE STYLE)
   ========================================================================= */

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
}

.checkout-header .logo img {
  height: 24px;
}

.checkout-header-actions {
  display: flex;
  gap: 1.5rem;
  color: var(--color-black);
}

.checkout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem 6rem;
}

/* Summary Accordion */
.checkout-summary-accordion {
  border-bottom: 1px solid var(--color-gray-200);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.summary-accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem 0;
}

.summary-accordion-price {
  color: var(--color-gray-800);
}

.summary-free-shipping {
  font-size: 0.9rem;
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
}

.shipping-progress-bar {
  height: 4px;
  background: var(--color-gray-200);
  border-radius: 2px;
  margin-bottom: 1rem;
  position: relative;
}

.shipping-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #007a33; /* Dark green like Nike */
  border-radius: 2px;
}

/* Sections */
.checkout-section {
  margin-bottom: 3rem;
}

.checkout-section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

/* Toggle Buttons (Delivery vs Pick Up) */
.toggle-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.2rem;
  border: 1px solid var(--color-gray-800);
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  border: 2px solid var(--color-black);
  padding: calc(1.2rem - 1px); /* Prevent layout jump */
}

.toggle-btn svg {
  width: 20px;
  height: 20px;
}

/* Floating Label Inputs */
.floating-input-group {
  position: relative;
  margin-bottom: 1rem;
}

.floating-input {
  width: 100%;
  padding: 1.5rem 1rem 0.5rem;
  border: 1px solid var(--color-gray-400);
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;
}

.floating-input:focus {
  outline: none;
  border-color: var(--color-black);
}

.floating-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 1rem;
  color: var(--color-gray-800);
  pointer-events: none;
  transition: all 0.2s ease;
}

.floating-input:focus ~ .floating-label,
.floating-input:not(:placeholder-shown) ~ .floating-label {
  top: 0.4rem;
  font-size: 0.75rem;
}

.input-helper-text {
  font-size: 0.8rem;
  color: var(--color-gray-400);
  margin-top: 0.4rem;
  padding-left: 1rem;
}

/* Checkbox Style */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.5rem 0;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--color-black);
  cursor: pointer;
}

.checkbox-group label {
  font-size: 1rem;
  cursor: pointer;
}

/* Selection Boxes (Shipping, Payment) */
.selection-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1rem;
  border: 1px solid var(--color-gray-400);
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.selection-box:hover {
  border-color: var(--color-black);
}

.selection-box.active {
  border: 2px solid var(--color-black);
  padding: calc(1.2rem - 1px) calc(1rem - 1px);
}

.selection-box-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.selection-box-title {
  font-weight: 500;
}

.selection-box-desc {
  font-size: 0.85rem;
  color: var(--color-gray-800);
}

.selection-box-right {
  font-weight: 500;
}

/* Payment Methods */
.payment-methods-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.payment-method-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  border: 1px solid var(--color-gray-400);
  border-radius: 8px;
  cursor: pointer;
}

.payment-method-box:hover {
  border-color: var(--color-black);
}

.payment-method-box.active {
  border: 2px solid var(--color-black);
  padding: calc(1.2rem - 1px);
}

.payment-method-box img {
  height: 24px;
}

.payment-method-box span {
  font-weight: 500;
}

.payment-method-box svg {
  width: 24px;
  height: 24px;
}

.promo-input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-apply {
  padding: 0 2rem;
  border: 1px solid var(--color-gray-400);
  border-radius: 30px;
  background: white;
  font-weight: 500;
  cursor: pointer;
}

.btn-apply:hover {
  border-color: var(--color-black);
}

/* Place Order */
.terms-text {
  font-size: 0.8rem;
  color: var(--color-gray-800);
  text-align: center;
  margin-bottom: 1.5rem;
}

.terms-text a {
  text-decoration: underline;
  color: var(--color-gray-800);
}

.btn-place-order {
  width: 100%;
  padding: 1.2rem;
  border-radius: 30px;
  background: var(--color-gray-200);
  color: var(--color-gray-400);
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  cursor: not-allowed;
  transition: all 0.3s ease;
}

.btn-place-order.enabled {
  background: var(--color-black);
  color: white;
  cursor: pointer;
}

.btn-place-order.enabled:hover {
  background: var(--color-gray-800);
}

/* Minimal Footer */
.checkout-footer {
  background: var(--color-black);
  color: var(--color-white);
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}
.checkout-footer-links {
  display: flex;
  gap: 1.5rem;
}
.checkout-footer-links a {
  color: var(--color-gray-400);
}
.checkout-footer-links a:hover {
  color: var(--color-white);
}
`;

const cssPath = path.join(__dirname, 'src', 'style.css');
if (fs.existsSync(cssPath)) {
  let content = fs.readFileSync(cssPath, 'utf8');
  if (!content.includes('.checkout-container')) {
    fs.appendFileSync(cssPath, cssToAppend);
    console.log("Checkout CSS appended.");
  } else {
    console.log("Checkout CSS already exists.");
  }
}
