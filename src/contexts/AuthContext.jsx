import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('kizazi_user');
    const storedToken = localStorage.getItem('kizazi_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('✅ Restored user from storage');
      } catch (e) {
        console.log('❌ Failed to restore user from storage');
        localStorage.removeItem('kizazi_user');
        localStorage.removeItem('kizazi_token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔐 AuthContext: Starting login process');
      
      const response = await apiService.login(email, password);
      
      console.log('✅ AuthContext: Login response received:', response);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        
        // Store in localStorage
        localStorage.setItem('kizazi_user', JSON.stringify(response.user));
        localStorage.setItem('kizazi_token', response.token);
        
        console.log('✅ Login successful, user stored');
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('❌ AuthContext login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📝 AuthContext: Starting registration process');
      
      const response = await apiService.register(name, email, password);
      
      console.log('✅ AuthContext: Registration response received:', response);
      
      if (response.success && response.user && response.token) {
        setUser(response.user);
        
        // Store in localStorage
        localStorage.setItem('kizazi_user', JSON.stringify(response.user));
        localStorage.setItem('kizazi_token', response.token);
        
        console.log('✅ Registration successful, user stored');
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
      
    } catch (err) {
      console.error('❌ AuthContext registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError('');
    localStorage.removeItem('kizazi_user');
    localStorage.removeItem('kizazi_token');
    console.log('🔓 User logged out');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthContext;
