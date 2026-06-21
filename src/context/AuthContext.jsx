import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load from local storage
    const savedUser = localStorage.getItem('nimasa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'aaa@gmail.com' && cleanPassword === '1234') {
      const userData = { email: cleanEmail, name: 'System Admin', role: 'admin' };
      setUser(userData);
      localStorage.setItem('nimasa_user', JSON.stringify(userData));
      return true;
    }
    if (cleanEmail === 'abc@gmail.com' && cleanPassword === '123') {
      const userData = { email: cleanEmail, name: 'ABC Member', role: 'user' };
      setUser(userData);
      localStorage.setItem('nimasa_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    // Treat registration with abc as valid too for testing
    if (email === 'abc@gmail.com') {
      const userData = { email, name: name || 'ABC Member' };
      setUser(userData);
      localStorage.setItem('nimasa_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nimasa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
