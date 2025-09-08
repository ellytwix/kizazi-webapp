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
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };
    
    console.log('🔧 Final request config:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      hasBody: !!config.body
    });

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
        const err = new Error(data?.error || data?.message || `HTTP ${response.status}`);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Preserve HTTP status errors so callers can branch on error.status
      if (typeof error.status === 'number') {
        throw error;
      }
      
      // Provide user-friendly network error messages
      if (error.name === 'TypeError' && String(error.message).includes('fetch')) {
        const netErr = new Error('Unable to connect to server. Please check your connection.');
        netErr.status = 0;
        throw netErr;
      }
      
      throw error;
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

  // Social Media methods
  async getSocialAccounts() {
    const token = localStorage.getItem('kizazi_token');
    console.log('🔑 Getting social accounts with token:', token ? 'Token present' : 'No token');
    console.log('🔑 Token value:', token);
    
    const headers = {
      'Authorization': token ? `Bearer ${token}` : ''
    };
    console.log('🔑 Headers being sent:', headers);
    
    return this.request('/social/accounts', {
      headers
    });
  }

  async disconnectSocialAccount(accountId) {
    const token = localStorage.getItem('kizazi_token');
    return this.request(`/social/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }

  async postToSocial(endpoint, data) {
    const token = localStorage.getItem('kizazi_token');
    return this.request(endpoint, {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }
}

const apiService = new ApiService();
export default apiService;
