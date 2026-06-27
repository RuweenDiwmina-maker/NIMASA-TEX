import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
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
        {/* Decorative background elements */}
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '15px', letterSpacing: '-1px' }}>Privacy Policy</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Your privacy is critically important to us. Learn how we collect, use, and protect your personal information at Nimasa Tex.
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '20px' }}>Last updated: June 27, 2026</p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section 1 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>1. Introduction</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              Welcome to <strong>Nimasa Tex</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          {/* Section 2 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '12px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>2. Data We Collect</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '20px' }}>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <h4 style={{ color: '#111', fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>Identity Data</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Includes first name, last name, username or similar identifier.</p>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <h4 style={{ color: '#111', fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>Contact Data</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Includes billing address, delivery address, email address and telephone numbers.</p>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <h4 style={{ color: '#111', fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>Transaction Data</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Details about payments to and from you and other details of products purchased.</p>
              </div>
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <h4 style={{ color: '#111', fontWeight: '700', marginBottom: '8px', fontSize: '1.1rem' }}>Technical Data</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>IP address, login data, browser type and version, and operating system.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>3. How We Use Your Data</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '15px' }}>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', color: '#555', lineHeight: '1.6' }}>
                <span style={{ color: '#d97706', marginTop: '2px' }}>✓</span>
                Where we need to perform the contract we are about to enter into or have entered into with you (such as processing an order).
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', color: '#555', lineHeight: '1.6' }}>
                <span style={{ color: '#d97706', marginTop: '2px' }}>✓</span>
                Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#555', lineHeight: '1.6' }}>
                <span style={{ color: '#d97706', marginTop: '2px' }}>✓</span>
                Where we need to comply with a legal obligation.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>4. Data Security</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          {/* Section 5 */}
          <section className="policy-card" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f3e8ff', color: '#9333ea', padding: '12px', borderRadius: '12px' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111', margin: 0 }}>5. Contact Us</h2>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '20px' }}>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* Call Us */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#fdf2f2', color: '#e60000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Call Us</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Speak to our team directly.</div>
                <div style={{ fontWeight: '700', color: '#111', fontSize: '1.1rem' }}>+94 312 259 681</div>
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '8px' }}>WhatsApp</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>Send us a message anytime.</div>
                <div style={{ fontWeight: '700', color: '#111', fontSize: '1.1rem' }}>+94 75 436 0408</div>
              </div>

              {/* Visit Us */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: '#fdf2f2', color: '#e60000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Visit Us</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>No 7 Pannala Road, Dankotuwa.</div>
                <div style={{ fontWeight: '600', color: '#cc0000', fontSize: '0.95rem' }}>Open Daily until 9:00 PM</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
