import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', 
        color: '#fff', 
        padding: '120px 20px 60px',
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(230,0,0,0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(230,0,0,0.1) 0%, transparent 40%)' }}></div>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', filter: 'blur(30px)' }}></div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '60px', 
            height: '60px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '50%',
            marginBottom: '20px'
          }}>
            <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px', letterSpacing: '-1px' }}>Terms & Conditions</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Please read these terms and conditions carefully before using our online store.
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '20px' }}>Last updated: July 8, 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section 1 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>1. Introduction</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              These Terms & Conditions govern your use of the <strong>Nimasa Tex</strong> website and services. By accessing or using our website, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>2. Intellectual Property</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              All content published and made available on our site is the property of Nimasa Tex. This includes, but is not limited to images, text, logos, documents, video files, and anything that contributes to the composition of our site.
            </p>
          </section>

          {/* Section 3 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>3. Accounts</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              When you create an account on our site, you agree to provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          {/* Section 4 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>4. Payments & Refunds</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              All payments made on our site are processed securely. By placing an order, you agree to pay the specified price for the goods or services. Our refund and exchange policy is governed by our separate Return Policy page.
            </p>
          </section>

          {/* Section 5 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>5. Governing Law</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              These Terms & Conditions are governed by the laws of Sri Lanka. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
