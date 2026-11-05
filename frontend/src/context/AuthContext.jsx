import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial user check
  const fetchCurrentUser = async () => {
    try {
      const response = await authApi.getUser();
      setUser(response.data?.user || null);
    } catch (err) {
      // 401 is expected when the user is not logged in — suppress console noise
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    setUser(response.data?.user || null);
    return response.data;
  };

  const register = async (data) => {
    const response = await authApi.register(data);
    setUser(response.data?.user || null);
    return response.data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    return fetchCurrentUser();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSchool: user?.role === 'school',
    isParent: user?.role === 'parent',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
