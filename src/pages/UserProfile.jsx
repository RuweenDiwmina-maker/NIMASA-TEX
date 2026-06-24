import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '60vh', paddingBottom: '60px' }}>
      <div className="nav-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>NIMASA TEX</h1>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {user.name.charAt(0)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Sidebar */}
          <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {user.role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('orders')} 
                style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '18px', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', cursor: 'pointer', color: activeTab === 'orders' ? 'var(--color-black)' : 'var(--color-gray-500)' }}
              >
                Orders
              </button>
            )}
            <button 
              onClick={() => setActiveTab('profile')} 
              style={{ textAlign: 'left', background: 'none', border: 'none', fontSize: '18px', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', cursor: 'pointer', color: activeTab === 'profile' ? 'var(--color-black)' : 'var(--color-gray-500)' }}
            >
              Profile
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flexGrow: 1 }}>
            {activeTab === 'orders' && user.role !== 'admin' && (
              <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h2>Welcome, {user.name.split(' ')[0]}</h2>
                <p style={{ color: 'var(--color-gray-500)', marginTop: '10px' }}>Ready to shop?</p>
                <button className="btn-primary" style={{ marginTop: '20px', width: 'auto', padding: '10px 24px' }} onClick={() => window.location.href = '/'}>Shop now</button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Profile Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <button style={{ background: 'none', border: '1px solid var(--color-gray-300)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-600)' }}>
                    <span>Email</span>
                    <span>{user.email}</span>
                  </div>
                </div>

                {/* Addresses Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Addresses</h3>
                  <button style={{ background: 'none', border: '1px solid var(--color-gray-300)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-gray-200)', color: 'var(--color-gray-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    No addresses added
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={logout} 
                    style={{ background: 'none', border: '1px solid var(--color-gray-300)', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-primary)' }}
                  >
                    Sign out
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
