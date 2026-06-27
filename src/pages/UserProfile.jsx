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
  const { user, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ name: '', phone: '' });

  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [editAddressData, setEditAddressData] = useState({ address: '', city: '' });
  
  const handleOpenEditProfile = () => {
    setEditProfileData({ name: user.name || '', phone: user.phone || '' });
    setIsEditProfileOpen(true);
  };
  
  const handleOpenEditAddress = () => {
    setEditAddressData({ address: user.address || '', city: user.city || '' });
    setIsEditAddressOpen(true);
  };

  const handleSaveProfile = async () => {
    await updateUserProfile(user.uid, editProfileData);
    setIsEditProfileOpen(false);
  };

  const handleSaveAddress = async () => {
    await updateUserProfile(user.uid, editAddressData);
    setIsEditAddressOpen(false);
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Banner / Header */}
      <div style={{ 
        width: '100%', 
        height: '250px', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(230,0,0,0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(230,0,0,0.1) 0%, transparent 40%)' }}></div>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', filter: 'blur(30px)' }}></div>
        <div className="nav-container" style={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              backgroundColor: '#fff', border: '4px solid #fafafa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', letterSpacing: '-0.5px', fontWeight: '700', lineHeight: '1.2' }}>{user.name || 'User'}</h1>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ opacity: 0.85, fontSize: '0.95rem', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  {user.email}
                </span>
                
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></div>
                
                <span style={{ 
                  background: 'rgba(230,0,0,0.2)', color: '#ff9999', padding: '4px 12px', 
                  borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '1px',
                  border: '1px solid rgba(230,0,0,0.3)'
                }}>
                  {user.role}
                </span>
                
                {user.isLoyaltyMember && (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', color: '#664d00', padding: '4px 12px', 
                    borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                    letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px',
                    boxShadow: '0 2px 10px rgba(255,215,0,0.2)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    {user.points || 0} Points
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
                  <button onClick={handleOpenEditProfile} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Edit</button>
                </div>
                
                <div style={{ padding: '30px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</span>
                      <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{user.name || 'User'}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
                      <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{user.email}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</span>
                      <span style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '500' }}>{user.phone || 'Not provided'}</span>
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
                  <button onClick={handleOpenEditAddress} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>{user.address ? 'Edit' : 'Add New'}</button>
                </div>
                
                <div style={{ padding: '30px', textAlign: user.address ? 'left' : 'center' }}>
                  {user.address ? (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                        <div style={{ padding: '10px', background: '#fff', borderRadius: '50%', color: '#3b82f6', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <LocationIcon />
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1e293b' }}>Default Address</h4>
                          <p style={{ margin: '0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {user.address}<br />
                            {user.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#94a3b8', marginBottom: '15px' }}>
                        <LocationIcon />
                      </div>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>No saved addresses found.</p>
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setIsEditProfileOpen(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.4rem' }}>Edit Basic Details</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Full Name</label>
              <input type="text" value={editProfileData.name} onChange={e => setEditProfileData({...editProfileData, name: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Phone Number</label>
              <input type="tel" value={editProfileData.phone} onChange={e => setEditProfileData({...editProfileData, phone: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsEditProfileOpen(false)} style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleSaveProfile} style={{ flex: 1, padding: '12px', border: 'none', background: '#111', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditAddressOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setIsEditAddressOpen(false)}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.4rem' }}>{user.address ? 'Edit Address' : 'Add New Address'}</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Street Address</label>
              <input type="text" value={editAddressData.address} onChange={e => setEditAddressData({...editAddressData, address: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} placeholder="e.g. 123 Main St" />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>City</label>
              <input type="text" value={editAddressData.city} onChange={e => setEditAddressData({...editAddressData, city: e.target.value})} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} placeholder="e.g. Colombo" />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsEditAddressOpen(false)} style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleSaveAddress} style={{ flex: 1, padding: '12px', border: 'none', background: '#111', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
