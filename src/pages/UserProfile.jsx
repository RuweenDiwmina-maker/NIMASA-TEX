import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PackageIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Banner / Header */}
      <div style={{ 
        width: '100%', 
        height: '250px', 
        background: 'linear-gradient(135deg, #111 0%, #333 100%)',
        position: 'relative'
      }}>
        <div className="nav-container" style={{ height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px', transform: 'translateY(50px)' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: '#fff', border: '4px solid #fafafa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ paddingBottom: '50px', color: '#fff' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.5px' }}>{user.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>{user.email}</span>
                <span style={{ 
                  background: 'rgba(255,255,255,0.2)', padding: '3px 10px', 
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  {user.role}
                </span>
                {user.isLoyaltyMember && (
                  <span style={{ 
                    background: '#00C896', color: '#111', padding: '3px 10px', 
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>
                    ★ {user.points || 0} Points
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="nav-container" style={{ display: 'flex', gap: '40px', marginTop: '80px', alignItems: 'flex-start' }}>
        
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user.role !== 'admin' && (
            <button 
              onClick={() => setActiveTab('orders')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px 20px', 
                background: activeTab === 'orders' ? '#fff' : 'transparent', 
                border: 'none', borderRadius: '12px', fontSize: '1rem', 
                fontWeight: activeTab === 'orders' ? '600' : '500', cursor: 'pointer', 
                color: activeTab === 'orders' ? '#111' : '#666',
                boxShadow: activeTab === 'orders' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { if(activeTab !== 'orders') e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)' }}
              onMouseLeave={(e) => { if(activeTab !== 'orders') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <PackageIcon />
              My Orders
            </button>
          )}
          
          <button 
            onClick={() => setActiveTab('profile')} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px 20px', 
              background: activeTab === 'profile' ? '#fff' : 'transparent', 
              border: 'none', borderRadius: '12px', fontSize: '1rem', 
              fontWeight: activeTab === 'profile' ? '600' : '500', cursor: 'pointer', 
              color: activeTab === 'profile' ? '#111' : '#666',
              boxShadow: activeTab === 'profile' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { if(activeTab !== 'profile') e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)' }}
            onMouseLeave={(e) => { if(activeTab !== 'profile') e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <UserIcon />
            Profile Info
          </button>

          <div style={{ margin: '20px 0', height: '1px', background: '#eaeaea', width: '80%', alignSelf: 'center' }}></div>

          <button 
            onClick={logout} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '15px 20px', 
              background: 'transparent', border: 'none', borderRadius: '12px', fontSize: '1rem', 
              fontWeight: '500', cursor: 'pointer', color: '#ef4444', transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          
          {/* Orders View */}
          {activeTab === 'orders' && user.role !== 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Recent Orders</h2>
              
              {/* Empty State */}
              <div style={{ 
                backgroundColor: '#fff', padding: '60px 40px', borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1',
                  marginBottom: '20px'
                }}>
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>No orders yet</h3>
                <p style={{ color: '#64748b', margin: '0 0 30px 0', maxWidth: '300px', lineHeight: '1.6' }}>
                  Looks like you haven't made your choice yet. Explore our latest collections!
                </p>
                <button 
                  style={{ 
                    padding: '12px 30px', backgroundColor: '#111', color: '#fff', 
                    border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)' }}
                  onClick={() => window.location.href = '/'}
                >
                  Start Shopping
                </button>
              </div>
            </div>
          )}

          {/* Profile View */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Personal Information</h2>
              
              <div style={{ 
                backgroundColor: '#fff', borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden'
              }}>
                <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Basic Details</h3>
                  <button style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</button>
                </div>
                
                <div style={{ padding: '30px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</span>
                      <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{user.name}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
                      <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#fff', borderRadius: '16px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden'
              }}>
                <div style={{ padding: '25px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Addresses</h3>
                  <button style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Add New</button>
                </div>
                
                <div style={{ padding: '30px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', marginBottom: '15px' }}>
                    <LocationIcon />
                  </div>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>No saved addresses found.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
