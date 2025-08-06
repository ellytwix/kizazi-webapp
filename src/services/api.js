// API service for KIZAZI frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // --- AUTH ENDPOINTS ---
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    await this.post('/auth/logout');
    this.setToken(null);
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.put('/auth/profile', profileData);
  }

  async changePassword(passwordData) {
    return this.put('/auth/change-password', passwordData);
  }

  // --- POSTS ENDPOINTS ---
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  async getPost(id) {
    return this.get(`/posts/${id}`);
  }

  async createPost(postData) {
    return this.post('/posts', postData);
  }

  async updatePost(id, postData) {
    return this.put(`/posts/${id}`, postData);
  }

  async deletePost(id) {
    return this.delete(`/posts/${id}`);
  }

  async getUpcomingPosts() {
    return this.get('/posts/upcoming/week');
  }

  async getPostsSummary() {
    return this.get('/posts/analytics/summary');
  }

  // --- AI ENDPOINTS ---
  async generateContent(promptData) {
    return this.post('/ai/generate-content', promptData);
  }

  async generateHashtags(contentData) {
    return this.post('/ai/generate-hashtags', contentData);
  }

  async improveContent(contentData) {
    return this.post('/ai/improve-content', contentData);
  }

  async getAiUsageStats() {
    return this.get('/ai/usage-stats');
  }

  // --- ANALYTICS ENDPOINTS ---
  async getDashboardAnalytics(period = '30') {
    return this.get(`/analytics/dashboard?period=${period}`);
  }

  async getPostPerformance(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/analytics/posts/performance${queryString ? `?${queryString}` : ''}`);
  }

  async getTrends(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/analytics/trends${queryString ? `?${queryString}` : ''}`);
  }

  async getBestTimes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/analytics/best-times${queryString ? `?${queryString}` : ''}`);
  }

  async getHashtagAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/analytics/hashtags${queryString ? `?${queryString}` : ''}`);
  }

  async exportAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/analytics/export${queryString ? `?${queryString}` : ''}`);
  }

  // --- SOCIAL MEDIA ENDPOINTS ---
  async connectSocialAccount(platform, accountData) {
    return this.post(`/social/connect/${platform}`, accountData);
  }

  async disconnectSocialAccount(platform, accountId) {
    return this.delete(`/social/disconnect/${platform}/${accountId}`);
  }

  async getSocialAccounts() {
    return this.get('/social/accounts');
  }

  async publishPost(postId) {
    return this.post(`/social/publish/${postId}`);
  }

  async getPostAnalytics(postId) {
    return this.get(`/social/analytics/${postId}`);
  }

  async syncAnalytics() {
    return this.post('/social/sync-analytics');
  }

  // --- HEALTH CHECK ---
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;