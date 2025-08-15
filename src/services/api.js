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

  // Social Media methods
  async getSocialAccounts() {
    const token = localStorage.getItem('kizazi_token');
    return this.request('/social/accounts', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
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
