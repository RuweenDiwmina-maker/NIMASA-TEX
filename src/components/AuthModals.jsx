import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const AuthModals = ({ isSignInOpen, isJoinUsOpen, closeModals, openSignIn, openJoinUs }) => {
  const { login, register, signInWithGoogle } = useAuth();
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

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showJoinPassword, setShowJoinPassword] = useState(false);

  // Clear form fields when modals close
  useEffect(() => {
    if (!isSignInOpen && !isJoinUsOpen) {
      setSignInEmail('');
      setSignInPassword('');
      setSignInError('');
      setJoinName('');
      setJoinEmail('');
      setJoinPassword('');
      setJoinError('');
      setShowSignInPassword(false);
      setShowJoinPassword(false);
    }
  }, [isSignInOpen, isJoinUsOpen]);

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
      alert("Registration successful! We have sent a verification link to your email. Please check your inbox and verify your email.");
      closeModals();
      if (joinEmail.trim().toLowerCase() === 'aaa@gmail.com') {
        navigate('/admin');
      }
    } catch (error) {
      console.error(error);
      setJoinError(`Error: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModals();
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        setSignInError('Sign-in cancelled.');
        setJoinError('Sign-in cancelled.');
      } else {
        setSignInError('Google Sign-In failed: ' + error.message);
        setJoinError('Google Sign-In failed: ' + error.message);
      }
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
          <form className="auth-form" onSubmit={handleSignIn} autoComplete="off">
            {signInError && <p style={{color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0'}}>{signInError}</p>}
            <input type="email" placeholder="Email Address" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} required autoComplete="off" name="nimasa_signin_email" />
            <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
              <input 
                type={showSignInPassword ? "text" : "password"} 
                placeholder="Password" 
                value={signInPassword} 
                onChange={(e) => setSignInPassword(e.target.value)} 
                required 
                autoComplete="new-password"
                name="nimasa_signin_password"
                style={{ width: '100%', marginBottom: 0 }}
              />
              <button 
                type="button" 
                onClick={() => setShowSignInPassword(!showSignInPassword)} 
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}
              >
                {showSignInPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button type="submit" className="btn btn-pill-dark auth-submit" disabled={isSigningIn} style={{ marginTop: '5px' }}>
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </button>
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: '1px', background: '#ddd', flex: 1 }}></div>
              <span style={{ padding: '0 10px', color: '#888', fontSize: '0.8rem' }}>OR</span>
              <div style={{ height: '1px', background: '#ddd', flex: 1 }}></div>
            </div>
            <button type="button" onClick={handleGoogleSignIn} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s', marginBottom: '15px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
              Continue with Google
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
          <form className="auth-form" onSubmit={handleJoin} autoComplete="off">
            {joinError && <p style={{color: 'red', fontSize: '0.8rem', margin: '0 0 10px 0'}}>{joinError}</p>}
            <input type="text" placeholder="Full Name" value={joinName} onChange={(e) => setJoinName(e.target.value)} required autoComplete="off" name="nimasa_join_name" />
            <input type="email" placeholder="Email Address" value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} required autoComplete="off" name="nimasa_join_email" />
            <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
              <input 
                type={showJoinPassword ? "text" : "password"} 
                placeholder="Password" 
                value={joinPassword} 
                onChange={(e) => setJoinPassword(e.target.value)} 
                required 
                autoComplete="new-password"
                name="nimasa_join_password"
                style={{ width: '100%', marginBottom: 0 }}
              />
              <button 
                type="button" 
                onClick={() => setShowJoinPassword(!showJoinPassword)} 
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}
              >
                {showJoinPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button type="submit" className="btn btn-pill-dark auth-submit" disabled={isJoining} style={{ marginTop: '5px' }}>
              {isJoining ? 'Signing Up...' : 'Sign Up'}
            </button>
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: '1px', background: '#ddd', flex: 1 }}></div>
              <span style={{ padding: '0 10px', color: '#888', fontSize: '0.8rem' }}>OR</span>
              <div style={{ height: '1px', background: '#ddd', flex: 1 }}></div>
            </div>
            <button type="button" onClick={handleGoogleSignIn} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #ddd', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s', marginBottom: '15px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" style={{ width: '20px', height: '20px' }} />
              Sign up with Google
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
