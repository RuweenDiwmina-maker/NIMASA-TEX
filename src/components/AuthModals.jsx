import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ isSignInOpen, isJoinUsOpen, closeModals, openSignIn, openJoinUs }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [joinError, setJoinError] = useState('');

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const emailToLogin = signInEmail.trim().toLowerCase();
    setIsSigningIn(true);
    setSignInError('');
    try {
      await login(signInEmail, signInPassword);
      setSignInEmail('');
      setSignInPassword('');
      closeModals();
      if (emailToLogin === 'aaa@gmail.com') {
        navigate('/admin');
      }
    } catch (error) {
      setSignInError('Invalid email or password');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    setJoinError('');
    try {
      await register(joinName, joinEmail, joinPassword);
      setJoinName('');
      setJoinEmail('');
      setJoinPassword('');
      closeModals();
      if (joinEmail.trim().toLowerCase() === 'aaa@gmail.com') {
        navigate('/admin');
      }
    } catch (error) {
      setJoinError('Registration failed. Email might already exist or password too short.');
    } finally {
      setIsJoining(false);
    }
  };

  if (!isSignInOpen && !isJoinUsOpen) return null;

  return (
    <>
      {/* Sign In Modal */}
      <div className={`modal-overlay ${isSignInOpen ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModals(); }}>
        <div className="modal-content">
          <button className="close-modal" onClick={closeModals}>&times;</button>
          <div className="modal-logo">
            <img src="/images/Logo_black.png" alt="Nimasa Tex Logo" />
          </div>
          <h2>Sign In</h2>
          <form className="auth-form" onSubmit={handleSignIn}>
            {signInError && <p style={{color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0'}}>{signInError}</p>}
            <input type="email" placeholder="Email Address" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} required />
            <button type="submit" className="btn btn-pill-dark auth-submit" disabled={isSigningIn}>
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-switch">
            <p>Don't have an account? <button type="button" className="switch-to-join" style={{background:'none', border:'none', color:'var(--color-primary)', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline'}} onClick={openJoinUs}>Join Us</button></p>
          </div>
        </div>
      </div>

      {/* Join Us Modal */}
      <div className={`modal-overlay ${isJoinUsOpen ? 'active' : ''}`} onClick={(e) => { if(e.target.classList.contains('modal-overlay')) closeModals(); }}>
        <div className="modal-content">
          <button className="close-modal" onClick={closeModals}>&times;</button>
          <div className="modal-logo">
            <img src="/images/Logo_black.png" alt="Nimasa Tex Logo" />
          </div>
          <h2>Join Nimasa Tex</h2>
          <form className="auth-form" onSubmit={handleJoin}>
            {joinError && <p style={{color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0'}}>{joinError}</p>}
            <input type="text" placeholder="Full Name" value={joinName} onChange={(e) => setJoinName(e.target.value)} required />
            <input type="email" placeholder="Email Address" value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={joinPassword} onChange={(e) => setJoinPassword(e.target.value)} required />
            <button type="submit" className="btn btn-pill-dark auth-submit" disabled={isJoining}>
              {isJoining ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-switch">
            <p>Already a member? <button type="button" className="switch-to-sign-in" style={{background:'none', border:'none', color:'var(--color-primary)', fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline'}} onClick={openSignIn}>Sign In</button></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModals;
