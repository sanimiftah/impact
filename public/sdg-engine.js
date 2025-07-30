/**
 * SDG Engine - Sustainable Development Goals Tracking System
 * Manages SDG data, progress tracking, and global impact analytics
 */

class SDGEngine {
  constructor() {
    this.sdgData = new Map();
    this.userContributions = new Map();
    this.globalStats = {
      totalProjects: 0,
      totalVolunteers: 0,
      totalImpactHours: 0,
      activeCountries: 0
    };
    this.isInitialized = false;
    
    console.log('🎯 SDG Engine initializing...');
    this.initialize();
  }

  // Initialize the SDG engine
  async initialize() {
    try {
      await this.loadSDGData();
      await this.loadUserContributions();
      await this.calculateGlobalStats();
      
      this.isInitialized = true;
      console.log('✅ SDG Engine initialized successfully');
      
      // Set up real-time listeners if Firebase is available
      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        this.setupRealtimeListeners();
      }
      
    } catch (error) {
      console.error('❌ Error initializing SDG Engine:', error);
      // Fallback to localStorage
      this.initializeLocalStorage();
    }
  }

  // Load SDG data from Firebase or localStorage
  async loadSDGData() {
    try {
      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        const data = await window.impactDataLayer.getSDGData();
        if (data) {
          this.sdgData = new Map(Object.entries(data));
          console.log('✅ SDG data loaded from Firebase');
          return;
        }
      }
      
      // Fallback to localStorage
      const localData = localStorage.getItem('sdgData');
      if (localData) {
        this.sdgData = new Map(Object.entries(JSON.parse(localData)));
        console.log('⚠️ SDG data loaded from localStorage');
      } else {
        await this.initializeDefaultSDGData();
      }
    } catch (error) {
      console.error('Error loading SDG data:', error);
      await this.initializeDefaultSDGData();
    }
  }

  // Initialize default SDG data
  async initializeDefaultSDGData() {
    const defaultSDGData = {
      sdg1: {
        id: 1,
        title: "No Poverty",
        progress: 34,
        projects: 127,
        volunteers: 1234,
        impactHours: 15432,
        countries: 45,
        recentActivities: [],
        targets: [
          "Eradicate extreme poverty by 2030",
          "Reduce poverty in all dimensions",
          "Implement social protection systems"
        ]
      },
      sdg2: {
        id: 2,
        title: "Zero Hunger",
        progress: 42,
        projects: 89,
        volunteers: 987,
        impactHours: 12876,
        countries: 38,
        recentActivities: [],
        targets: [
          "End hunger by 2030",
          "Achieve food security",
          "Improve nutrition"
        ]
      },
      sdg3: {
        id: 3,
        title: "Good Health and Well-being",
        progress: 58,
        projects: 156,
        volunteers: 2103,
        impactHours: 23456,
        countries: 67,
        recentActivities: [],
        targets: [
          "Reduce maternal mortality",
          "Universal health coverage",
          "Combat communicable diseases"
        ]
      },
      sdg4: {
        id: 4,
        title: "Quality Education",
        progress: 67,
        projects: 234,
        volunteers: 3456,
        impactHours: 34567,
        countries: 78,
        recentActivities: [],
        targets: [
          "Free primary and secondary education",
          "Equal access to quality education",
          "Eliminate gender disparities"
        ]
      },
      sdg5: {
        id: 5,
        title: "Gender Equality",
        progress: 51,
        projects: 98,
        volunteers: 1567,
        impactHours: 18765,
        countries: 56,
        recentActivities: [],
        targets: [
          "End discrimination against women",
          "Eliminate violence against women",
          "Equal participation in leadership"
        ]
      },
      sdg6: {
        id: 6,
        title: "Clean Water and Sanitation",
        progress: 45,
        projects: 76,
        volunteers: 876,
        impactHours: 9876,
        countries: 34,
        recentActivities: [],
        targets: [
          "Universal access to safe drinking water",
          "Adequate sanitation for all",
          "Improve water quality"
        ]
      },
      sdg7: {
        id: 7,
        title: "Affordable and Clean Energy",
        progress: 39,
        projects: 54,
        volunteers: 654,
        impactHours: 7654,
        countries: 23,
        recentActivities: [],
        targets: [
          "Universal access to modern energy",
          "Increase renewable energy share",
          "Improve energy efficiency"
        ]
      },
      sdg8: {
        id: 8,
        title: "Decent Work and Economic Growth",
        progress: 52,
        projects: 143,
        volunteers: 1876,
        impactHours: 21345,
        countries: 67,
        recentActivities: [],
        targets: [
          "Full employment and decent work",
          "Eradicate forced labor",
          "Promote entrepreneurship"
        ]
      },
      sdg9: {
        id: 9,
        title: "Industry, Innovation and Infrastructure",
        progress: 48,
        projects: 87,
        volunteers: 1234,
        impactHours: 15678,
        countries: 45,
        recentActivities: [],
        targets: [
          "Develop sustainable infrastructure",
          "Promote inclusive industrialization",
          "Foster innovation"
        ]
      },
      sdg10: {
        id: 10,
        title: "Reduced Inequalities",
        progress: 36,
        projects: 92,
        volunteers: 1098,
        impactHours: 13456,
        countries: 56,
        recentActivities: [],
        targets: [
          "Reduce income inequality",
          "Promote inclusion regardless of background",
          "Ensure equal opportunity"
        ]
      },
      sdg11: {
        id: 11,
        title: "Sustainable Cities and Communities",
        progress: 44,
        projects: 134,
        volunteers: 1765,
        impactHours: 19876,
        countries: 67,
        recentActivities: [],
        targets: [
          "Safe and affordable housing",
          "Sustainable transport systems",
          "Inclusive urbanization"
        ]
      },
      sdg12: {
        id: 12,
        title: "Responsible Consumption and Production",
        progress: 41,
        projects: 67,
        volunteers: 876,
        impactHours: 10234,
        countries: 34,
        recentActivities: [],
        targets: [
          "Sustainable use of natural resources",
          "Reduce waste generation",
          "Sustainable practices in companies"
        ]
      },
      sdg13: {
        id: 13,
        title: "Climate Action",
        progress: 29,
        projects: 189,
        volunteers: 2987,
        impactHours: 35678,
        countries: 89,
        recentActivities: [],
        targets: [
          "Strengthen resilience to climate hazards",
          "Integrate climate measures into policies",
          "Improve education on climate change"
        ]
      },
      sdg14: {
        id: 14,
        title: "Life Below Water",
        progress: 33,
        projects: 78,
        volunteers: 987,
        impactHours: 11234,
        countries: 45,
        recentActivities: [],
        targets: [
          "Reduce marine pollution",
          "Protect marine ecosystems",
          "Regulate fishing"
        ]
      },
      sdg15: {
        id: 15,
        title: "Life on Land",
        progress: 37,
        projects: 112,
        volunteers: 1456,
        impactHours: 16789,
        countries: 67,
        recentActivities: [],
        targets: [
          "Conserve and restore terrestrial ecosystems",
          "Combat desertification",
          "Halt biodiversity loss"
        ]
      },
      sdg16: {
        id: 16,
        title: "Peace, Justice and Strong Institutions",
        progress: 40,
        projects: 89,
        volunteers: 1234,
        impactHours: 14567,
        countries: 78,
        recentActivities: [],
        targets: [
          "Reduce violence everywhere",
          "Promote rule of law",
          "Build effective institutions"
        ]
      },
      sdg17: {
        id: 17,
        title: "Partnerships for the Goals",
        progress: 55,
        projects: 167,
        volunteers: 2345,
        impactHours: 26789,
        countries: 89,
        recentActivities: [],
        targets: [
          "Strengthen domestic resource mobilization",
          "Enhanced international cooperation",
          "Promote effective partnerships"
        ]
      }
    };

    this.sdgData = new Map(Object.entries(defaultSDGData));
    
    // Save to appropriate storage
    if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
      await window.impactDataLayer.saveSDGData(defaultSDGData);
      console.log('✅ Default SDG data saved to Firebase');
    } else {
      localStorage.setItem('sdgData', JSON.stringify(defaultSDGData));
      console.log('⚠️ Default SDG data saved to localStorage');
    }
  }

  // Load user contributions
  async loadUserContributions() {
    try {
      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        const contributions = await window.impactDataLayer.getUserSDGContributions();
        if (contributions) {
          this.userContributions = new Map(Object.entries(contributions));
          return;
        }
      }
      
      // Fallback to localStorage
      const localContributions = localStorage.getItem('userSDGContributions');
      if (localContributions) {
        this.userContributions = new Map(Object.entries(JSON.parse(localContributions)));
      } else {
        this.initializeDefaultUserContributions();
      }
    } catch (error) {
      console.error('Error loading user contributions:', error);
      this.initializeDefaultUserContributions();
    }
  }

  // Initialize default user contributions
  initializeDefaultUserContributions() {
    const defaultContributions = {
      sdg1: { hours: 12, projects: 2, impact: 45, lastActivity: Date.now() },
      sdg3: { hours: 8, projects: 1, impact: 30, lastActivity: Date.now() - 86400000 },
      sdg4: { hours: 23, projects: 4, impact: 85, lastActivity: Date.now() - 172800000 },
      sdg8: { hours: 7, projects: 1, impact: 25, lastActivity: Date.now() - 259200000 },
      sdg13: { hours: 15, projects: 3, impact: 67, lastActivity: Date.now() - 345600000 },
      sdg16: { hours: 5, projects: 1, impact: 20, lastActivity: Date.now() - 432000000 },
      sdg17: { hours: 11, projects: 2, impact: 45, lastActivity: Date.now() - 518400000 }
    };

    this.userContributions = new Map(Object.entries(defaultContributions));
    
    if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
      window.impactDataLayer.saveUserSDGContributions(defaultContributions);
    } else {
      localStorage.setItem('userSDGContributions', JSON.stringify(defaultContributions));
    }
  }

  // Calculate global statistics
  async calculateGlobalStats() {
    let totalProjects = 0;
    let totalVolunteers = 0;
    let totalImpactHours = 0;
    let activeCountries = new Set();

    for (const [key, sdg] of this.sdgData) {
      totalProjects += sdg.projects || 0;
      totalVolunteers += sdg.volunteers || 0;
      totalImpactHours += sdg.impactHours || 0;
      activeCountries.add(sdg.countries || 0);
    }

    this.globalStats = {
      totalProjects,
      totalVolunteers,
      totalImpactHours,
      activeCountries: Math.max(...activeCountries)
    };
  }

  // Get SDG data by ID
  getSDGData(sdgId) {
    return this.sdgData.get(`sdg${sdgId}`);
  }

  // Get all SDG data
  getAllSDGData() {
    return Array.from(this.sdgData.values());
  }

  // Get user contributions for specific SDG
  getUserContribution(sdgId) {
    return this.userContributions.get(`sdg${sdgId}`);
  }

  // Get all user contributions
  getAllUserContributions() {
    return Array.from(this.userContributions.values());
  }

  // Record new user contribution
  async recordContribution(sdgId, hours, projectId, impact) {
    const key = `sdg${sdgId}`;
    const existing = this.userContributions.get(key) || { hours: 0, projects: 0, impact: 0 };
    
    const updated = {
      hours: existing.hours + hours,
      projects: existing.projects + 1,
      impact: existing.impact + impact,
      lastActivity: Date.now()
    };

    this.userContributions.set(key, updated);

    // Update global SDG data
    const sdgData = this.sdgData.get(key);
    if (sdgData) {
      sdgData.volunteers += 1;
      sdgData.impactHours += hours;
      this.sdgData.set(key, sdgData);
    }

    // Save updates
    await this.saveUpdates();
    
    console.log(`✅ Recorded contribution to SDG ${sdgId}: ${hours} hours, impact: ${impact}`);
  }

  // Get SDG recommendations based on user interests
  getSDGRecommendations(userInterests = [], limit = 5) {
    const allSDGs = this.getAllSDGData();
    
    // Simple recommendation based on progress (prioritize lower progress SDGs)
    const recommendations = allSDGs
      .sort((a, b) => a.progress - b.progress)
      .slice(0, limit)
      .map(sdg => ({
        ...sdg,
        reason: `This SDG needs urgent attention (${sdg.progress}% progress)`,
        priority: sdg.progress < 40 ? 'high' : sdg.progress < 60 ? 'medium' : 'low'
      }));

    return recommendations;
  }

  // Get global impact statistics
  getGlobalStats() {
    return this.globalStats;
  }

  // Get top performing countries for SDG
  getTopCountries(sdgId, limit = 5) {
    // Simulated data - in real implementation, this would come from global database
    const countries = [
      { name: "Malaysia", flag: "🇲🇾", projects: 45, volunteers: 567, hours: 8901 },
      { name: "Indonesia", flag: "🇮🇩", projects: 38, volunteers: 489, hours: 7234 },
      { name: "Philippines", flag: "🇵🇭", projects: 34, volunteers: 423, hours: 6789 },
      { name: "Singapore", flag: "🇸🇬", projects: 29, volunteers: 378, hours: 5678 },
      { name: "Thailand", flag: "🇹🇭", projects: 25, volunteers: 345, hours: 4567 }
    ];

    return countries.slice(0, limit);
  }

  // Get SDG progress over time
  getProgressOverTime(sdgId, timeframe = '6months') {
    // Simulated historical data
    const baseProgress = this.getSDGData(sdgId)?.progress || 0;
    const months = timeframe === '6months' ? 6 : 12;
    
    const progressData = [];
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const progress = Math.max(0, baseProgress - (i * 2) + Math.random() * 5);
      
      progressData.push({
        date: date.toISOString().split('T')[0],
        progress: Math.round(progress * 100) / 100,
        projects: Math.floor(progress * 3),
        volunteers: Math.floor(progress * 50)
      });
    }

    return progressData;
  }

  // Calculate user's SDG impact score
  calculateUserImpactScore() {
    let totalScore = 0;
    let contributionCount = 0;

    for (const [key, contribution] of this.userContributions) {
      const sdgId = parseInt(key.replace('sdg', ''));
      const sdgData = this.getSDGData(sdgId);
      
      if (sdgData) {
        // Score based on hours, projects, and SDG priority (lower progress = higher priority)
        const priorityMultiplier = (100 - sdgData.progress) / 100;
        const score = (contribution.hours * 2 + contribution.projects * 10 + contribution.impact) * priorityMultiplier;
        totalScore += score;
        contributionCount++;
      }
    }

    return {
      totalScore: Math.round(totalScore),
      averageScore: contributionCount > 0 ? Math.round(totalScore / contributionCount) : 0,
      contributionCount,
      rank: this.calculateUserRank(totalScore)
    };
  }

  // Calculate user rank based on impact score
  calculateUserRank(score) {
    if (score < 100) return { level: 'Seedling', emoji: '🌱', next: 'Sprout at 100 points' };
    if (score < 300) return { level: 'Sprout', emoji: '🌿', next: 'Tree at 300 points' };
    if (score < 600) return { level: 'Tree', emoji: '🌳', next: 'Forest at 600 points' };
    if (score < 1000) return { level: 'Forest', emoji: '🌲', next: 'Ecosystem at 1000 points' };
    return { level: 'Ecosystem', emoji: '🌍', next: 'Maximum level reached!' };
  }

  // Save all updates to storage
  async saveUpdates() {
    try {
      const sdgDataObj = Object.fromEntries(this.sdgData);
      const userContributionsObj = Object.fromEntries(this.userContributions);

      if (window.impactDataLayer && window.impactDataLayer.isFirebaseReady) {
        await Promise.all([
          window.impactDataLayer.saveSDGData(sdgDataObj),
          window.impactDataLayer.saveUserSDGContributions(userContributionsObj)
        ]);
        console.log('✅ SDG data saved to Firebase');
      } else {
        localStorage.setItem('sdgData', JSON.stringify(sdgDataObj));
        localStorage.setItem('userSDGContributions', JSON.stringify(userContributionsObj));
        console.log('⚠️ SDG data saved to localStorage');
      }

      await this.calculateGlobalStats();
    } catch (error) {
      console.error('Error saving SDG updates:', error);
    }
  }

  // Setup real-time listeners for Firebase
  setupRealtimeListeners() {
    if (!window.impactDataLayer || !window.impactDataLayer.isFirebaseReady) return;

    // Listen for SDG data changes
    window.impactDataLayer.subscribeToSDGUpdates((data) => {
      console.log('🔄 Real-time SDG data update received');
      this.sdgData = new Map(Object.entries(data));
      this.calculateGlobalStats();
      
      // Trigger UI update if on SDG tracking page
      if (window.location.pathname.includes('sdg-tracking.html')) {
        this.triggerUIUpdate();
      }
    });

    console.log('✅ Real-time SDG listeners active');
  }

  // Trigger UI update
  triggerUIUpdate() {
    // Dispatch custom event for UI components to listen to
    window.dispatchEvent(new CustomEvent('sdgDataUpdated', {
      detail: {
        sdgData: this.getAllSDGData(),
        globalStats: this.getGlobalStats(),
        userContributions: this.getAllUserContributions()
      }
    }));
  }

  // Initialize localStorage fallback
  initializeLocalStorage() {
    console.log('⚠️ Initializing SDG Engine with localStorage fallback');
    this.initializeDefaultSDGData();
    this.initializeDefaultUserContributions();
    this.calculateGlobalStats();
    this.isInitialized = true;
  }

  // Get SDG badge based on contribution
  getSDGBadge(sdgId) {
    const contribution = this.getUserContribution(sdgId);
    if (!contribution) return null;

    const { hours, projects, impact } = contribution;
    const totalContribution = hours + (projects * 5) + (impact * 0.5);

    if (totalContribution < 10) return { level: 'Supporter', emoji: '🌱', color: '#10B981' };
    if (totalContribution < 30) return { level: 'Advocate', emoji: '🌿', color: '#3B82F6' };
    if (totalContribution < 60) return { level: 'Champion', emoji: '🏆', color: '#8B5CF6' };
    if (totalContribution < 100) return { level: 'Leader', emoji: '⭐', color: '#F59E0B' };
    return { level: 'Pioneer', emoji: '🌟', color: '#EF4444' };
  }
}

// Initialize global SDG engine
window.sdgEngine = new SDGEngine();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SDGEngine;
}

console.log('🎯 SDG Engine loaded successfully!');
