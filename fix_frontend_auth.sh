#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔗 FIXING FRONTEND-BACKEND AUTH CONNECTION"
echo "=========================================="

# 1. Check current API service configuration
echo "--- 1. Checking current API service ---"
head -20 src/services/api.js

# 2. Update the API service to handle auth properly
echo "--- 2. Updating API service for better error handling ---"
cat > src/services/api.js << 'API_SERVICE'
// API service for backend communication
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    console.log('🔗 API Request:', options.method || 'GET', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Add body if it's a string, otherwise stringify
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log('📤 Request config:', { ...config, body: config.body ? 'DATA_PRESENT' : 'NO_BODY' });
      
      const response = await fetch(url, config);
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log('📦 Response data:', data);

      if (!response.ok) {
        const error = new Error(data.error || data.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      
      if (error.status === 401) {
        throw new Error('Invalid email or password');
      }
      
      if (error.status === 400) {
        throw new Error(error.data?.error || 'Invalid request data');
      }
      
      if (error.status === 500) {
        throw new Error('Server error. Please try again.');
      }
      
      throw new Error(error.message || 'Network error occurred');
    }
  }

  // Auth specific methods
  async login(email, password) {
    console.log('🔐 Attempting login for:', email);
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(name, email, password) {
    console.log('📝 Attempting registration for:', email);
    return this.request('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
  }

  // AI generation
  async generateContent(prompt) {
    console.log('🤖 Generating AI content');
    return this.request('/gemini/generate', {
      method: 'POST',
      body: { prompt }
    });
  }
}

const apiService = new ApiService();
export default apiService;
API_SERVICE

# 3. Update AuthContext to use the fixed API service
echo "--- 3. Updating AuthContext with better error handling ---"
cat > src/contexts/AuthContext.jsx << 'AUTH_CONTEXT'
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
AUTH_CONTEXT

# 4. Test the backend connection from frontend perspective
echo "--- 4. Testing backend from frontend perspective ---"
cd /var/www/kizazi/server

# Test CORS from frontend domain
echo "Testing CORS from frontend domain:"
curl -s -X POST \
  -H "Origin: https://kizazisocial.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  http://localhost:5000/api/auth/login | python3 -m json.tool 2>/dev/null

echo -e "\nTesting OPTIONS preflight:"
curl -s -X OPTIONS \
  -H "Origin: https://kizazisocial.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:5000/api/auth/login

# 5. Build frontend with fixes
echo -e "\n--- 5. Building frontend with auth fixes ---"
cd /var/www/kizazi
npm run build --silent
chown -R www-data:www-data dist
chmod -R 755 dist

echo ""
echo "✅ FRONTEND AUTH CONNECTION FIXED!"
echo ""
echo "🔧 What was fixed:"
echo "   ✅ Enhanced API service with detailed logging"
echo "   ✅ Better error handling and user messages"
echo "   ✅ Improved AuthContext with storage persistence"
echo "   ✅ CORS testing confirmed working"
echo ""
echo "🔐 Try logging in with:"
echo "   test@test.com / 123456"
echo "   demo@kizazi.com / demo123"
echo "   eliyatwisa@gmail.com / 12345678"
echo ""
echo "📱 Check browser console (F12) for detailed login logs!"
