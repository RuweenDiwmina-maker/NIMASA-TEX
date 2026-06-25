import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RewardsPopup.css';

const RewardsPopup = ({ openSignIn, openJoinUs }) => {
  const { user, joinLoyaltyProgram } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeView, setActiveView] = useState('main'); // 'main', 'profile', 'redeem', 'history', 'rewards'

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
                <h4>Welcome, {user.name.split(' ')[0]}!</h4>
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
                   <div className="profile-avatar">{user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}</div>
                   <h4>{user.name}</h4>
                   <p>{user.email}</p>
                </div>
                <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue={user.name.split(' ')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue={user.name.split(' ').slice(1).join(' ')} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="Phone number" />
                  </div>
                  <div className="form-group">
                    <label>Birthday</label>
                    <input type="date" />
                  </div>
                  <button className="btn-rewards-primary">Save Profile</button>
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
                <div className="history-card">
                   <div className="history-info">
                     <strong>Registration Points</strong>
                     <span>6/23/2026</span>
                   </div>
                   <span className="points-plus">+100</span>
                </div>
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
                  ].map((item, index) => (
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
  );
};

export default RewardsPopup;
