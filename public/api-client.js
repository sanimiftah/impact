/**
 * Impact Platform API Client
 * Frontend integration for the Impact Platform API
 */

class ImpactAPI {
  constructor(baseURL = 'http://localhost:3001/api/v1') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('impact_token');
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(email, password, name) {
    const data = await this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('impact_token', this.token);
    }

    return data;
  }

  async login(email, password) {
    const data = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('impact_token', this.token);
    }

    return data;
  }

  async logout() {
    const data = await this.apiCall('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('impact_token');
    return data;
  }

  async getCurrentUser() {
    return this.apiCall('/auth/me');
  }

  // Projects methods
  async getProjects(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.apiCall(`/projects?${params}`);
  }

  async getProject(id) {
    return this.apiCall(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async getProjectStats() {
    return this.apiCall('/projects/stats');
  }

  // AI Matching methods
  async getRecommendations(limit = 10, minScore = 0.4) {
    const params = new URLSearchParams({ limit, minScore });
    return this.apiCall(`/matching/recommendations?${params}`);
  }

  async getCompatibility(projectId) {
    return this.apiCall(`/matching/compatibility/${projectId}`);
  }

  async provideFeedback(projectId, action, feedback = '') {
    return this.apiCall('/matching/feedback', {
      method: 'POST',
      body: JSON.stringify({ projectId, action, feedback })
    });
  }

  async getAIStats() {
    return this.apiCall('/matching/stats');
  }

  // Health check
  async healthCheck() {
    return fetch(`${this.baseURL.replace('/api/v1', '')}/health`)
      .then(res => res.json());
  }
}

// Create global API instance
window.impactAPI = new ImpactAPI();

// Example usage functions for testing
async function testAPI() {
  try {
    console.log('🔍 Testing API connection...');
    
    // Health check
    const health = await impactAPI.healthCheck();
    console.log('✅ Health check:', health);

    // Get projects
    const projects = await impactAPI.getProjects({ limit: 5 });
    console.log('✅ Projects loaded:', projects);

    // Get AI recommendations (requires auth)
    try {
      const recommendations = await impactAPI.getRecommendations(5);
      console.log('✅ AI Recommendations:', recommendations);
    } catch (error) {
      console.log('⚠️ AI Recommendations require authentication');
    }

    // Get project stats
    const stats = await impactAPI.getProjectStats();
    console.log('✅ Project stats:', stats);

    console.log('🎉 API integration successful!');
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Auto-test API when loaded
console.log('🚀 Impact Platform API Client loaded');
console.log('📝 Available methods:');
console.log('- impactAPI.login(email, password)');
console.log('- impactAPI.getProjects()');
console.log('- impactAPI.getRecommendations()');
console.log('- impactAPI.getCompatibility(projectId)');
console.log('- testAPI() // Run full API test');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImpactAPI;
}
