import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Verify token is still valid
          try {
            const response = await authAPI.getMe();
            if (response.success) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ identifier, password });
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Password change failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
