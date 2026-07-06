import React, { useState, useEffect } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <h4>{question}</h4>
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" style={{transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease'}}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div className="faq-answer" style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease' }}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const Help = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <header className="help-hero">
        <div className="help-hero-content">
          <h1>How can we help you?</h1>
          <p>Welcome to NIMASA TEX Online Store. Your favourite styles, now just a message away!</p>
        </div>
      </header>

      <main className="help-container">
        <div className="contact-grid">
          {/* Card 1 */}
          <div className="contact-card">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3>Call Us</h3>
            <p>Speak to our team directly.</p>
            <a href="tel:+94312259681" className="contact-link">+94 312 259 681</a>
          </div>

          {/* Card 2 */}
          <div className="contact-card">
            <div className="icon-wrapper" style={{color: '#25D366', backgroundColor: 'rgba(37,211,102,0.1)'}}>
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h3>WhatsApp</h3>
            <p>Send us a message anytime.</p>
            <a href="https://wa.me/94754360408" className="contact-link">+94 75 436 0408</a>
          </div>

          {/* Card 3 */}
          <div className="contact-card">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3>Visit Us</h3>
            <p>No 7 Pannala Road, Dankotuwa.</p>
            <span className="contact-subtext">Open Daily until 9:00 PM</span>
          </div>
        </div>

        <div className="help-content-grid">
          <div className="faq-section">
            <h2 className="section-title" style={{fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'left'}}>Frequently Asked Questions</h2>
            <div className="faq-list">
              <FaqItem 
                question="How do I place an order?" 
                answer="You can place an order directly through our website or send us a message on WhatsApp (+94 75 436 0408) with the items you'd like to purchase. We'll guide you through the process!" 
              />
              <FaqItem 
                question="What are your delivery options?" 
                answer="We offer islandwide delivery across Sri Lanka. Standard delivery usually takes 3-5 business days right to your doorstep." 
              />
              <FaqItem 
                question="Do you have a physical store?" 
                answer="Yes! You can visit our main shopping mall located at No 7 Pannala Road, Dankotuwa. We are open every day until 9:00 PM." 
              />
              <FaqItem 
                question="What categories of clothing do you sell?" 
                answer="We cater to all your needs! Our store features a wide variety of Men's Wear, Women's Wear, all kinds of Kids Items, Toys, and Fashion Accessories." 
              />
            </div>
          </div>
          
          <div className="about-section-small">
            <div className="about-box">
              <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem'}}>Why Shop With NIMASA TEX?</h3>
              <p style={{color: 'var(--color-gray-800)', marginBottom: '1.5rem', lineHeight: '1.6'}}>We provide the best opportunities for online clothing businesses and individuals alike. Our premium quality fabrics ensure you elevate your style every day.</p>
              <ul className="perks-list">
                <li><span style={{color: 'var(--color-primary)', fontWeight: 'bold', marginRight: '10px'}}>✓</span> Premium Quality Materials</li>
                <li><span style={{color: 'var(--color-primary)', fontWeight: 'bold', marginRight: '10px'}}>✓</span> Islandwide Fast Delivery</li>
                <li><span style={{color: 'var(--color-primary)', fontWeight: 'bold', marginRight: '10px'}}>✓</span> Customer Support via WhatsApp</li>
                <li><span style={{color: 'var(--color-primary)', fontWeight: 'bold', marginRight: '10px'}}>✓</span> Exclusive In-store Collections</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Help;
