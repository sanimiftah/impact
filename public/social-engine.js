// Social Engine - Community interaction and engagement system
class SocialEngine {
  constructor() {
    this.posts = [];
    this.connections = new Map();
    this.groups = new Map();
    this.activities = [];
    this.notifications = [];
    this.initialized = false;
    
    this.init();
  }

  async init() {
    console.log('🌐 Initializing Social Engine...');
    
    try {
      // Load data from enhanced data layer or localStorage
      await this.loadSocialData();
      this.setupRealtimeUpdates();
      this.initialized = true;
      
      console.log('✅ Social Engine initialized successfully');
      this.dispatchEvent('socialEngineReady');
    } catch (error) {
      console.error('❌ Social Engine initialization failed:', error);
    }
  }

  async loadSocialData() {
    try {
      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        // Load from Firebase
        this.posts = await window.impactDataLayer.getSocialPosts() || [];
        this.connections = new Map(await window.impactDataLayer.getUserConnections() || []);
        this.groups = new Map(await window.impactDataLayer.getUserGroups() || []);
        this.activities = await window.impactDataLayer.getRecentActivities() || [];
        
        console.log('📊 Social data loaded from Firebase');
      } else {
        // Load from localStorage
        this.posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
        this.connections = new Map(JSON.parse(localStorage.getItem('userConnections') || '[]').map(name => [name, { name, status: 'connected' }]));
        this.groups = new Map(JSON.parse(localStorage.getItem('userGroups') || '[]').map(name => [name, { name, memberCount: Math.floor(Math.random() * 500) + 50 }]));
        this.activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        
        console.log('📱 Social data loaded from localStorage');
      }
    } catch (error) {
      console.error('Error loading social data:', error);
      this.initializeDefaultData();
    }
  }

  initializeDefaultData() {
    this.posts = this.getDefaultPosts();
    this.connections = new Map([
      ['Maya Chen', { name: 'Maya Chen', role: 'Community Mentor', status: 'connected', avatar: 'M', color: 'blue' }],
      ['Rahul Sharma', { name: 'Rahul Sharma', role: 'Environmental Advocate', status: 'connected', avatar: 'R', color: 'green' }],
      ['Luna Santos', { name: 'Luna Santos', role: 'Mental Health Champion', status: 'connected', avatar: 'L', color: 'purple' }]
    ]);
    
    this.groups = new Map([
      ['Urban Gardeners', { name: 'Urban Gardeners', description: 'Growing green spaces in cities', memberCount: 234, category: 'Environment' }],
      ['Tech for Good', { name: 'Tech for Good', description: 'Using technology for social impact', memberCount: 567, category: 'Technology' }],
      ['Mental Health Advocates', { name: 'Mental Health Advocates', description: 'Supporting mental wellness in communities', memberCount: 189, category: 'Health' }]
    ]);
    
    this.activities = this.getDefaultActivities();
  }

  getDefaultPosts() {
    return [
      {
        id: 1,
        author: "Maya Chen",
        authorId: "maya_chen",
        authorAvatar: "M",
        authorColor: "blue",
        role: "Community Mentor",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: "achievement",
        content: "Just finished my 100th mentoring session! 🎉 Teaching coding to underprivileged youth has been the most rewarding journey. Seeing Aisha build her first mobile app today brought tears to my eyes. Technology really can change lives! 💻✨",
        tags: ["#Mentoring", "#TechForGood", "#YouthDevelopment"],
        likes: 42,
        comments: 8,
        shares: 5,
        image: null,
        likedByUser: false,
        privacy: "public"
      },
      {
        id: 2,
        author: "Rahul Sharma",
        authorId: "rahul_sharma",
        authorAvatar: "R",
        authorColor: "green",
        role: "Environmental Advocate",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        type: "event",
        content: "AMAZING turnout at today's beach cleanup! 🌊 We collected over 500kg of plastic waste and planted 50 mangroves. Special thanks to the 80+ volunteers who showed up despite the rain. Next cleanup is scheduled for next Saturday - who's in?",
        tags: ["#ClimateAction", "#BeachCleanup", "#Community"],
        likes: 67,
        comments: 15,
        shares: 12,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        likedByUser: true,
        privacy: "public"
      },
      {
        id: 3,
        author: "Luna Santos",
        authorId: "luna_santos",
        authorAvatar: "L",
        authorColor: "purple",
        role: "Mental Health Champion",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        type: "story",
        content: "Mental Health Awareness Week starts tomorrow! 🧠💚 Our workplace wellness initiative has grown from 5 participants to over 200 across 10 companies. Sometimes the smallest conversations create the biggest ripples. Remember: it's okay to not be okay, and it's brave to ask for help.",
        tags: ["#MentalHealth", "#WorkplaceWellness", "#Community"],
        likes: 89,
        comments: 23,
        shares: 18,
        image: null,
        likedByUser: false,
        privacy: "public"
      }
    ];
  }

  getDefaultActivities() {
    return [
      {
        id: 1,
        type: 'like',
        actor: 'Maya Chen',
        actorAvatar: 'M',
        actorColor: 'blue',
        action: 'liked your post',
        target: 'beach cleanup story',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'comment',
        actor: 'Rahul Sharma',
        actorAvatar: 'R',
        actorColor: 'green',
        action: 'commented on your post',
        target: 'mentoring achievement',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        type: 'follow',
        actor: 'Luna Santos',
        actorAvatar: 'L',
        actorColor: 'purple',
        action: 'started following you',
        target: null,
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];
  }

  // Post Management
  async createPost(postData) {
    const newPost = {
      id: Date.now(),
      author: postData.author || "Current User",
      authorId: postData.authorId || "current_user",
      authorAvatar: postData.authorAvatar || "S",
      authorColor: postData.authorColor || "green",
      role: postData.role || "Volunteer",
      timestamp: new Date().toISOString(),
      type: postData.type || "story",
      content: postData.content,
      tags: postData.tags || [],
      likes: 0,
      comments: 0,
      shares: 0,
      image: postData.image || null,
      likedByUser: false,
      privacy: postData.privacy || "public"
    };

    this.posts.unshift(newPost);
    await this.saveSocialData();
    
    // Create activity
    this.addActivity({
      type: 'post',
      actor: newPost.author,
      action: 'shared a new post',
      target: newPost.type,
      timestamp: newPost.timestamp
    });

    this.dispatchEvent('postCreated', newPost);
    return newPost;
  }

  async toggleLike(postId, userId = 'current_user') {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.likedByUser = !post.likedByUser;
    post.likes += post.likedByUser ? 1 : -1;
    
    await this.saveSocialData();
    
    if (post.likedByUser) {
      this.addActivity({
        type: 'like',
        actor: 'Current User',
        action: 'liked a post',
        target: post.author + "'s post",
        timestamp: new Date().toISOString()
      });
    }

    this.dispatchEvent('postLiked', { postId, liked: post.likedByUser });
    return post.likedByUser;
  }

  async addComment(postId, comment) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.comments += 1;
    await this.saveSocialData();
    
    this.addActivity({
      type: 'comment',
      actor: 'Current User',
      action: 'commented on a post',
      target: post.author + "'s post",
      timestamp: new Date().toISOString()
    });

    this.dispatchEvent('commentAdded', { postId, comment });
    return true;
  }

  async sharePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.shares += 1;
    await this.saveSocialData();
    
    this.addActivity({
      type: 'share',
      actor: 'Current User',
      action: 'shared a post',
      target: post.author + "'s post",
      timestamp: new Date().toISOString()
    });

    this.dispatchEvent('postShared', { postId });
    return true;
  }

  // Connection Management
  async addConnection(userId, userData) {
    this.connections.set(userId, {
      ...userData,
      status: 'connected',
      connectedAt: new Date().toISOString()
    });
    
    await this.saveSocialData();
    
    this.addActivity({
      type: 'connection',
      actor: 'Current User',
      action: 'connected with',
      target: userData.name,
      timestamp: new Date().toISOString()
    });

    this.dispatchEvent('connectionAdded', userData);
    return true;
  }

  async removeConnection(userId) {
    const connection = this.connections.get(userId);
    if (!connection) return false;

    this.connections.delete(userId);
    await this.saveSocialData();
    
    this.dispatchEvent('connectionRemoved', connection);
    return true;
  }

  getConnections() {
    return Array.from(this.connections.values());
  }

  getSuggestedConnections() {
    // This would typically come from an algorithm that suggests connections
    // based on shared interests, mutual connections, etc.
    return [
      {
        id: 'aria_wilson',
        name: 'Aria Wilson',
        role: 'Education Mentor',
        avatar: 'A',
        color: 'blue',
        mutualConnections: 3,
        sharedInterests: ['Education', 'Youth Development']
      },
      {
        id: 'jake_park',
        name: 'Jake Park',
        role: 'Climate Activist',
        avatar: 'J',
        color: 'green',
        mutualConnections: 2,
        sharedInterests: ['Climate Action', 'Sustainability']
      }
    ];
  }

  // Group Management
  async joinGroup(groupId, groupData) {
    this.groups.set(groupId, {
      ...groupData,
      joinedAt: new Date().toISOString(),
      memberCount: (groupData.memberCount || 0) + 1
    });
    
    await this.saveSocialData();
    
    this.addActivity({
      type: 'group',
      actor: 'Current User',
      action: 'joined group',
      target: groupData.name,
      timestamp: new Date().toISOString()
    });

    this.dispatchEvent('groupJoined', groupData);
    return true;
  }

  async leaveGroup(groupId) {
    const group = this.groups.get(groupId);
    if (!group) return false;

    this.groups.delete(groupId);
    await this.saveSocialData();
    
    this.dispatchEvent('groupLeft', group);
    return true;
  }

  getGroups() {
    return Array.from(this.groups.values());
  }

  getSuggestedGroups() {
    return [
      {
        id: 'digital_literacy',
        name: 'Digital Literacy Champions',
        description: 'Teaching digital skills to seniors and underserved communities',
        memberCount: 156,
        category: 'Education',
        tags: ['DigitalLiteracy', 'Seniors', 'Education']
      },
      {
        id: 'sustainable_living',
        name: 'Sustainable Living Community',
        description: 'Sharing tips and initiatives for sustainable lifestyle choices',
        memberCount: 342,
        category: 'Environment',
        tags: ['Sustainability', 'EcoFriendly', 'GreenLiving']
      }
    ];
  }

  // Activity and Notification Management
  addActivity(activity) {
    this.activities.unshift({
      id: Date.now(),
      ...activity
    });
    
    // Keep only recent activities (last 50)
    this.activities = this.activities.slice(0, 50);
    
    // Create notification if needed
    if (activity.type !== 'post') {
      this.addNotification({
        type: activity.type,
        message: `${activity.actor} ${activity.action}`,
        timestamp: activity.timestamp,
        read: false
      });
    }
  }

  addNotification(notification) {
    this.notifications.unshift({
      id: Date.now(),
      ...notification
    });
    
    // Keep only recent notifications (last 20)
    this.notifications = this.notifications.slice(0, 20);
    
    this.dispatchEvent('notificationAdded', notification);
  }

  getRecentActivities(limit = 10) {
    return this.activities.slice(0, limit);
  }

  getUnreadNotifications() {
    return this.notifications.filter(n => !n.read);
  }

  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.dispatchEvent('notificationRead', notification);
    }
  }

  // Trending and Discovery
  getTrendingTags() {
    const tagCount = new Map();
    
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }

  getPopularPosts(limit = 5) {
    return this.posts
      .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
      .slice(0, limit);
  }

  // Search and Filter
  searchPosts(query, filters = {}) {
    let filteredPosts = this.posts;
    
    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by type
    if (filters.type) {
      filteredPosts = filteredPosts.filter(post => post.type === filters.type);
    }
    
    // Filter by author
    if (filters.author) {
      filteredPosts = filteredPosts.filter(post => post.authorId === filters.author);
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.tags.some(tag => post.tags.includes(tag))
      );
    }
    
    return filteredPosts;
  }

  // Data Persistence
  async saveSocialData() {
    try {
      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        await window.impactDataLayer.saveSocialPosts(this.posts);
        await window.impactDataLayer.saveUserConnections(Array.from(this.connections.entries()));
        await window.impactDataLayer.saveUserGroups(Array.from(this.groups.entries()));
        await window.impactDataLayer.saveRecentActivities(this.activities);
      } else {
        localStorage.setItem('socialPosts', JSON.stringify(this.posts));
        localStorage.setItem('userConnections', JSON.stringify(Array.from(this.connections.keys())));
        localStorage.setItem('userGroups', JSON.stringify(Array.from(this.groups.keys())));
        localStorage.setItem('recentActivities', JSON.stringify(this.activities));
      }
    } catch (error) {
      console.error('Error saving social data:', error);
    }
  }

  setupRealtimeUpdates() {
    if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
      // Subscribe to real-time updates from Firebase
      window.impactDataLayer.subscribeToSocialUpdates((data) => {
        this.posts = data.posts || this.posts;
        this.activities = data.activities || this.activities;
        this.dispatchEvent('socialDataUpdated', data);
      });
    }
  }

  // Event System
  dispatchEvent(eventName, data = null) {
    const event = new CustomEvent(`socialEngine:${eventName}`, { detail: data });
    document.dispatchEvent(event);
  }

  // Analytics
  getSocialStats() {
    return {
      totalPosts: this.posts.length,
      totalConnections: this.connections.size,
      totalGroups: this.groups.size,
      totalLikes: this.posts.reduce((sum, post) => sum + post.likes, 0),
      totalComments: this.posts.reduce((sum, post) => sum + post.comments, 0),
      totalShares: this.posts.reduce((sum, post) => sum + post.shares, 0),
      engagementRate: this.calculateEngagementRate(),
      activeLastWeek: this.getActiveUsersLastWeek()
    };
  }

  calculateEngagementRate() {
    const totalPosts = this.posts.length;
    if (totalPosts === 0) return 0;
    
    const totalEngagement = this.posts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares, 0
    );
    
    return Math.round((totalEngagement / totalPosts) * 100) / 100;
  }

  getActiveUsersLastWeek() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivities = this.activities.filter(
      activity => new Date(activity.timestamp) > oneWeekAgo
    );
    
    const activeUsers = new Set(recentActivities.map(activity => activity.actor));
    return activeUsers.size;
  }

  // Integration with other systems
  async integrateWithAI() {
    if (window.aiMatchingEngine && window.aiMatchingEngine.initialized) {
      // Get AI recommendations for posts and connections
      const recommendations = await window.aiMatchingEngine.getSocialRecommendations(this.posts);
      return recommendations;
    }
    return null;
  }

  async syncWithProfile() {
    if (window.authManager && window.authManager.currentProfile) {
      const profile = window.authManager.currentProfile;
      
      // Update user posts with current profile info
      this.posts.forEach(post => {
        if (post.authorId === 'current_user') {
          post.author = profile.personalInfo.displayName;
          post.authorAvatar = profile.personalInfo.displayName.charAt(0).toUpperCase();
          post.role = profile.preferences.volunteerType || 'Volunteer';
        }
      });
      
      await this.saveSocialData();
    }
  }
}

// Initialize global social engine
window.socialEngine = new SocialEngine();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SocialEngine;
}
