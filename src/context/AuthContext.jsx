import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userData.name,
              role: userData.role,
              points: userData.points || 0,
              isLoyaltyMember: userData.isLoyaltyMember || false
            });
          } else {
            // Fallback if no doc exists
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'User',
              role: 'user',
              points: 0,
              isLoyaltyMember: false
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Seed aaa@gmail.com as admin
      const role = email.toLowerCase() === 'aaa@gmail.com' ? 'admin' : 'user';

      await setDoc(doc(db, 'users', newUser.uid), {
        name: name || 'User',
        email: email.toLowerCase(),
        role: role,
        points: 0,
        isLoyaltyMember: false,
        createdAt: new Date()
      });
      
      // Send verification email
      await sendEmailVerification(newUser);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore, if not create them
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const role = firebaseUser.email?.toLowerCase() === 'aaa@gmail.com' ? 'admin' : 'user';
        await setDoc(userDocRef, {
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email?.toLowerCase() || '',
          role: role,
          points: 0,
          isLoyaltyMember: false,
          createdAt: new Date()
        });
      }
      return true;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const updateUserPoints = async (uid, newPoints) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { points: newPoints });
      // Update local state
      setUser(prev => ({ ...prev, points: newPoints }));
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const joinLoyaltyProgram = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { isLoyaltyMember: true });
      // Update local state
      setUser(prev => ({ ...prev, isLoyaltyMember: true }));
      return true;
    } catch (error) {
      console.error("Error joining loyalty program:", error);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    resetPassword,
    signInWithGoogle,
    updateUserPoints,
    joinLoyaltyProgram,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
