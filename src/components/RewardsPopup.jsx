import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './RewardsPopup.css';

const RewardsPopup = ({ openSignIn, openJoinUs }) => {
  const { user, joinLoyaltyProgram, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeView, setActiveView] = useState('main'); // 'main', 'profile', 'redeem', 'history', 'rewards'
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  if (!user) return null;

  useEffect(() => {
    if (activeView === 'history' && user) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const q = query(collection(db, 'users', user.uid, 'rewardHistory'), orderBy('date', 'desc'));
          const snapshot = await getDocs(q);
          const history = [];
          snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
          });
          setRewardHistory(history);
        } catch (error) {
          console.error("Error fetching reward history:", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeView, user]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const togglePopup = () => {
    if (isOpen) {
      setActiveView('main');
    }
    setIsOpen(!isOpen);
  };

  const handleJoin = async () => {
    if (!user) return;
    setIsJoining(true);
    await joinLoyaltyProgram(user.uid);
    setIsJoining(false);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    openSignIn();
  };

  const handleSignUpClick = () => {
    setIsOpen(false);
    openJoinUs();
  };

  return (
    <>
      {isOpen && <div className="rewards-overlay" onClick={togglePopup}></div>}
      <div className="rewards-container">
      {isOpen && (
        <div className={`rewards-panel ${isOpen ? 'open' : ''}`}>
          <div className="rewards-header">
            {activeView !== 'main' ? (
              <button className="back-btn" onClick={() => setActiveView('main')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            ) : (
              <h3>Loyalty Rewards</h3>
            )}
            <button className="close-btn" onClick={togglePopup}>&times;</button>
          </div>

          <div className="rewards-body scrollable-body">
            {!user ? (
              <div className="rewards-state-not-logged">
                <div className="rewards-icon-bounce">🎁</div>
                <h4>Unlock Exclusive Rewards</h4>
                <p>Join our loyalty program to earn points on every purchase and get exclusive discounts.</p>
                <button className="btn-rewards-primary" onClick={handleLoginClick}>Log In</button>
                <div className="rewards-footer-text">
                  New here? <button onClick={handleSignUpClick} className="link-btn">Sign up</button>
                </div>
              </div>
            ) : user && !user.isLoyaltyMember ? (
              <div className="rewards-state-join">
                <div className="rewards-icon-bounce">⭐</div>
                <h4>Welcome, {user.name ? user.name.split(' ')[0] : 'User'}!</h4>
                <p>You're just one step away from earning points. Join our rewards program today for free!</p>
                <button 
                  className={`btn-rewards-primary ${isJoining ? 'loading' : ''}`} 
                  onClick={handleJoin}
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Join Rewards Program'}
                </button>
              </div>
            ) : activeView === 'profile' ? (
              <div className="sub-view profile-view">
                <div className="profile-header">
                   <div className="profile-avatar">{user.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}</div>
                   <h4>{user.name || 'User'}</h4>
                   <p>{user.email}</p>
                </div>
                <form className="profile-form" onSubmit={async (e) => {
                  e.preventDefault();
                  const firstName = e.target[0].value;
                  const lastName = e.target[1].value;
                  const phone = e.target[2].value;
                  const birthday = e.target[3].value;
                  if (firstName && lastName && phone && birthday) {
                    await updateUserProfile(user.uid, {
                      name: `${firstName} ${lastName}`,
                      phone,
                      birthday
                    });
                    setActiveView('main');
                  }
                }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue={user.name ? user.name.split(' ')[0] : ''} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue={user.name ? user.name.split(' ').slice(1).join(' ') : ''} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="Phone number" defaultValue={user.phone || ''} required />
                  </div>
                  <div className="form-group">
                    <label>Birthday</label>
                    <input type="date" defaultValue={user.birthday || ''} required />
                  </div>
                  <button type="submit" className="btn-rewards-primary">Save Profile</button>
                </form>
              </div>
            ) : activeView === 'redeem' ? (
              <div className="sub-view redeem-view">
                <div className="view-title">
                  <span className="title-icon">⚙️</span>
                  <div>
                    <h4>REDEEM POINTS</h4>
                    <p>SPEND POINTS ON AVAILABLE REWARDS.</p>
                  </div>
                </div>
                <div className="redeem-card">
                   <span className="redeem-name">Credit Coupon</span>
                   <span className="redeem-pts">500 pts</span>
                   <button className="btn-rewards-small">Redeem</button>
                </div>
              </div>
            ) : activeView === 'history' ? (
              <div className="sub-view history-view">
                <div className="view-title">
                  <span className="title-icon">🕒</span>
                  <div>
                    <h4>POINT HISTORY</h4>
                    <p>TRACK YOUR EARNING AND SPENDING HISTORY.</p>
                  </div>
                </div>
                {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading history...</div>
                ) : rewardHistory.length > 0 ? (
                  rewardHistory.map(item => (
                    <div className="history-card" key={item.id}>
                       <div className="history-info">
                         <strong>{item.reason}</strong>
                         <span>{item.date ? new Date(item.date.toDate()).toLocaleDateString() : 'Just now'}</span>
                       </div>
                       <span className={item.amount > 0 ? 'points-plus' : 'points-minus'}>
                         {item.amount > 0 ? `+${item.amount}` : item.amount}
                       </span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                     <p>No history available yet.</p>
                  </div>
                )}
              </div>
            ) : activeView === 'rewards' ? (
              <div className="sub-view rewards-view">
                <div className="view-title">
                  <span className="title-icon">🏆</span>
                  <div>
                    <h4>MY REWARDS</h4>
                    <p>VIEW EARNED REWARDS AND BENEFITS.</p>
                  </div>
                </div>
                <div className="empty-state">
                   <p>No rewards available yet.</p>
                </div>
              </div>
            ) : (
              <div className="rewards-state-member-dashboard">
                <div className="rewards-dashboard-card">
                  <div className="rewards-dashboard-stat">
                    <span className="stat-label">Your Points</span>
                    <span className="stat-value">{user.points || 0}</span>
                  </div>
                  <div className="rewards-dashboard-stat">
                    <span className="stat-label">Your Tier</span>
                    <span className="stat-value">Bronze</span>
                  </div>
                </div>

                <div className="rewards-menu-list">
                  {[
                    { text: 'Complete Your Profile', icon: '👤', view: 'profile' },
                    { text: 'Redeem Points', icon: '🎁', view: 'redeem' },
                    { text: 'Point History', icon: '🕒', view: 'history' },
                    { text: 'My Rewards', icon: '🏆', view: 'rewards' },
                    { text: 'Earn Points', icon: '💰', view: 'main' },
                    { text: 'About Loyalty Program', icon: 'ℹ️', view: 'about' }
                  ].filter(item => !(item.view === 'profile' && user.name && user.phone && user.birthday)).map((item, index) => (
                    <button 
                      key={index} 
                      className="rewards-menu-item" 
                      onClick={() => {
                        if (item.view === 'about') {
                          setIsOpen(false);
                          navigate('/about-loyalty');
                        } else if (item.view !== 'main') {
                          setActiveView(item.view);
                        }
                      }}
                    >
                      <div className="menu-item-left">
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-text">{item.text}</span>
                      </div>
                      <svg className="menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button className="rewards-fab" onClick={togglePopup}>
        Rewards
      </button>
    </div>
    </>
  );
};

export default RewardsPopup;
