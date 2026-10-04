import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { token: jwtToken, user: userProfile } = res.data;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userProfile));
      setToken(jwtToken);
      setUser(userProfile);
      return userProfile;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Admin' || user?.role === 'Manager';
  const isCashier = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Cashier';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isManager, isCashier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
