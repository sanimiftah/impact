// AI-Powered Features for IMPACT Platform
class AIEngine {
  constructor() {
    this.models = {
      skillMatching: new SkillMatchingAI(),
      contentRecommendation: new ContentRecommendationAI(),
      sentimentAnalysis: new SentimentAnalysisAI(),
      trendPrediction: new TrendPredictionAI()
    };
    this.initialize();
  }

  initialize() {
    this.loadUserBehaviorData();
    this.startBackgroundProcessing();
  }

  loadUserBehaviorData() {
    this.userBehavior = JSON.parse(localStorage.getItem('userBehavior') || '{}');
    this.communityData = this.loadCommunityData();
  }

  loadCommunityData() {
    return {
      ideas: JSON.parse(localStorage.getItem('seedboardIdeas') || '[]'),
      volunteers: JSON.parse(localStorage.getItem('volunteers') || '[]'),
      teams: JSON.parse(localStorage.getItem('teams') || '[]'),
      calls: JSON.parse(localStorage.getItem('openCalls') || '[]'),
      reflections: JSON.parse(localStorage.getItem('impactEntries') || '[]')
    };
  }

  // Smart Skill Matching
  findBestMatches(userSkills, opportunities) {
    return this.models.skillMatching.findMatches(userSkills, opportunities);
  }

  // Content Recommendations
  getPersonalizedRecommendations(userId) {
    return this.models.contentRecommendation.generateRecommendations(userId, this.communityData);
  }

  // Real-time suggestions
  getSuggestions(context, userInput) {
    const suggestions = [];

    // Skill-based suggestions
    if (context === 'skillInput') {
      suggestions.push(...this.generateSkillSuggestions(userInput));
    }

    // Location-based suggestions
    if (context === 'locationInput') {
      suggestions.push(...this.generateLocationSuggestions(userInput));
    }

    // Idea category suggestions
    if (context === 'ideaCategory') {
      suggestions.push(...this.generateCategorySuggestions(userInput));
    }

    return suggestions;
  }

  generateSkillSuggestions(input) {
    const commonSkills = [
      'Project Management', 'Web Development', 'Marketing', 'Teaching', 'Research',
      'Data Analysis', 'Graphic Design', 'Community Outreach', 'Event Planning',
      'Social Media', 'Public Speaking', 'Writing', 'Photography', 'Fundraising',
      'Mentoring', 'Leadership', 'Translation', 'Healthcare', 'Environmental Science'
    ];

    return commonSkills
      .filter(skill => skill.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }

  generateLocationSuggestions(input) {
    const locations = [
      'Remote', 'Kuala Lumpur', 'Selangor', 'Penang', 'Johor Bahru', 
      'Kota Kinabalu', 'Kuching', 'Nationwide', 'Online'
    ];

    return locations
      .filter(location => location.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }

  generateCategorySuggestions(input) {
    const categories = [
      'Education', 'Environment', 'Healthcare', 'Technology', 'Arts & Culture',
      'Community Development', 'Youth Programs', 'Elderly Care', 'Mental Health',
      'Sustainability', 'Innovation', 'Social Justice'
    ];

    return categories
      .filter(category => category.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
  }

  // Track user behavior for learning
  trackBehavior(action, data) {
    if (!this.userBehavior[action]) {
      this.userBehavior[action] = [];
    }

    this.userBehavior[action].push({
      timestamp: new Date().toISOString(),
      data: data
    });

    // Keep only last 100 entries per action
    if (this.userBehavior[action].length > 100) {
      this.userBehavior[action] = this.userBehavior[action].slice(-100);
    }

    localStorage.setItem('userBehavior', JSON.stringify(this.userBehavior));
  }

  startBackgroundProcessing() {
    // Process AI insights every 5 minutes
    setInterval(() => {
      this.processAIInsights();
    }, 5 * 60 * 1000);
  }

  processAIInsights() {
    const insights = this.generateDashboardInsights();
    this.broadcastInsights(insights);
  }

  generateDashboardInsights() {
    const insights = [];

    // Trend analysis
    const trends = this.models.trendPrediction.analyzeTrends(this.communityData);
    insights.push(...trends);

    // Sentiment analysis of community content
    const sentiment = this.models.sentimentAnalysis.analyzeCommunityMood(this.communityData);
    insights.push(sentiment);

    return insights;
  }

  broadcastInsights(insights) {
    // Send insights to notification system
    insights.forEach(insight => {
      if (insight.notify) {
        notificationManager.add(insight.title, insight.message, insight.type);
      }
    });
  }
}

// Skill Matching AI Model
class SkillMatchingAI {
  findMatches(userSkills, opportunities) {
    const matches = [];

    opportunities.forEach(opportunity => {
      const score = this.calculateMatchScore(userSkills, opportunity.skillsNeeded || []);
      if (score > 0.3) { // 30% threshold
        matches.push({
          opportunity,
          score,
          matchedSkills: this.getMatchedSkills(userSkills, opportunity.skillsNeeded || []),
          confidence: this.calculateConfidence(score)
        });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  calculateMatchScore(userSkills, requiredSkills) {
    if (requiredSkills.length === 0) return 0.5; // Default moderate match

    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    let exactMatches = 0;
    let partialMatches = 0;

    requiredSkillsLower.forEach(required => {
      if (userSkillsLower.includes(required)) {
        exactMatches++;
      } else if (userSkillsLower.some(user => user.includes(required) || required.includes(user))) {
        partialMatches++;
      }
    });

    const exactScore = exactMatches / requiredSkillsLower.length;
    const partialScore = (partialMatches * 0.5) / requiredSkillsLower.length;

    return Math.min(exactScore + partialScore, 1);
  }

  getMatchedSkills(userSkills, requiredSkills) {
    const matches = [];
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    requiredSkillsLower.forEach((required, index) => {
      const exactMatch = userSkillsLower.find(user => user === required);
      if (exactMatch) {
        matches.push(requiredSkills[index]);
      }
    });

    return matches;
  }

  calculateConfidence(score) {
    if (score >= 0.8) return 'High';
    if (score >= 0.5) return 'Medium';
    return 'Low';
  }
}

// Content Recommendation AI
class ContentRecommendationAI {
  generateRecommendations(userId, communityData) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const recommendations = [];

    // Based on user activity
    if (userProfile.stats?.ideasSubmitted > 0) {
      recommendations.push(...this.getIdeaBasedRecommendations(communityData));
    }

    // Based on skills
    if (userProfile.skills && userProfile.skills.length > 0) {
      recommendations.push(...this.getSkillBasedRecommendations(userProfile.skills, communityData));
    }

    // Based on location
    if (userProfile.location) {
      recommendations.push(...this.getLocationBasedRecommendations(userProfile.location, communityData));
    }

    // Trending content
    recommendations.push(...this.getTrendingRecommendations(communityData));

    return this.deduplicate(recommendations).slice(0, 10);
  }

  getIdeaBasedRecommendations(data) {
    return data.teams
      .filter(team => team.members && team.members.length < team.maxMembers)
      .map(team => ({
        type: 'team',
        title: `Join "${team.name}"`,
        description: `This team is looking for members with your interests`,
        actionUrl: 'teamspace.html',
        confidence: 0.8
      }));
  }

  getSkillBasedRecommendations(userSkills, data) {
    return data.calls
      .filter(call => call.status === 'active')
      .filter(call => this.hasSkillMatch(userSkills, call.skillsNeeded))
      .map(call => ({
        type: 'call',
        title: `Help with "${call.title}"`,
        description: `Your skills match this urgent call`,
        actionUrl: 'opencall.html',
        confidence: 0.9
      }));
  }

  getLocationBasedRecommendations(userLocation, data) {
    return data.ideas
      .filter(idea => idea.location && idea.location.toLowerCase().includes(userLocation.toLowerCase()))
      .slice(0, 3)
      .map(idea => ({
        type: 'idea',
        title: `Support "${idea.title}"`,
        description: `This idea is in your area: ${idea.location}`,
        actionUrl: 'seedboard.html',
        confidence: 0.7
      }));
  }

  getTrendingRecommendations(data) {
    // Simulate trending logic
    const recentIdeas = data.ideas
      .filter(idea => {
        const daysDiff = (new Date() - new Date(idea.createdDate)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      })
      .slice(0, 2);

    return recentIdeas.map(idea => ({
      type: 'trending',
      title: `Trending: "${idea.title}"`,
      description: 'This idea is gaining momentum',
      actionUrl: 'seedboard.html',
      confidence: 0.6
    }));
  }

  hasSkillMatch(userSkills, requiredSkills) {
    if (!requiredSkills) return false;
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const requiredSkillsLower = requiredSkills.split(',').map(s => s.trim().toLowerCase());
    
    return requiredSkillsLower.some(required => 
      userSkillsLower.some(user => user.includes(required) || required.includes(user))
    );
  }

  deduplicate(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = `${rec.type}-${rec.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// Sentiment Analysis AI
class SentimentAnalysisAI {
  analyzeCommunityMood(data) {
    const texts = [
      ...data.ideas.map(i => i.description),
      ...data.reflections.map(r => r.content),
      ...data.calls.map(c => c.description)
    ];

    const sentiment = this.analyzeSentiment(texts);
    
    return {
      type: 'insight',
      title: 'Community Mood',
      message: this.generateMoodMessage(sentiment),
      notify: sentiment.score < 0.3, // Notify if mood is low
      data: sentiment
    };
  }

  analyzeSentiment(texts) {
    // Simple sentiment analysis (in real app, would use ML model)
    const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'awesome', 'perfect', 'best', 'incredible'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing', 'frustrating', 'difficult', 'problem'];

    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = 0;

    texts.forEach(text => {
      if (!text) return;
      const words = text.toLowerCase().split(/\s+/);
      totalWords += words.length;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveScore++;
        if (negativeWords.includes(word)) negativeScore++;
      });
    });

    const score = totalWords > 0 ? (positiveScore - negativeScore) / totalWords : 0;
    
    return {
      score: Math.max(0, Math.min(1, score + 0.5)), // Normalize to 0-1
      positive: positiveScore,
      negative: negativeScore,
      total: totalWords
    };
  }

  generateMoodMessage(sentiment) {
    if (sentiment.score >= 0.7) {
      return 'Community sentiment is very positive! 🌟 Great energy all around.';
    } else if (sentiment.score >= 0.5) {
      return 'Community mood is generally positive 😊 Keep up the good work!';
    } else if (sentiment.score >= 0.3) {
      return 'Community sentiment is neutral 😐 Perhaps consider some uplifting initiatives.';
    } else {
      return 'Community mood seems low 😔 Consider organizing support activities or celebrations.';
    }
  }
}

// Trend Prediction AI
class TrendPredictionAI {
  analyzeTrends(data) {
    const insights = [];

    // Activity trend
    const activityTrend = this.analyzeActivityTrend(data);
    if (activityTrend.prediction !== 'stable') {
      insights.push({
        type: activityTrend.prediction === 'increasing' ? 'success' : 'warning',
        title: 'Activity Trend',
        message: `Community activity is ${activityTrend.prediction}. ${activityTrend.recommendation}`,
        notify: activityTrend.prediction === 'decreasing'
      });
    }

    // Skill demand prediction
    const skillTrends = this.predictSkillDemand(data);
    if (skillTrends.length > 0) {
      insights.push({
        type: 'info',
        title: 'Skill Demand Forecast',
        message: `Rising demand for: ${skillTrends.join(', ')}`,
        notify: false
      });
    }

    return insights;
  }

  analyzeActivityTrend(data) {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekBefore = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentActivity = this.countRecentActivity(data, lastWeek);
    const previousActivity = this.countRecentActivity(data, weekBefore, lastWeek);

    const change = recentActivity - previousActivity;
    const changePercent = previousActivity > 0 ? (change / previousActivity) * 100 : 0;

    let prediction, recommendation;
    
    if (changePercent > 20) {
      prediction = 'increasing';
      recommendation = 'Great momentum! Consider expanding successful initiatives.';
    } else if (changePercent < -20) {
      prediction = 'decreasing';
      recommendation = 'Consider launching new engagement activities.';
    } else {
      prediction = 'stable';
      recommendation = 'Maintain current activities.';
    }

    return { prediction, recommendation, changePercent };
  }

  countRecentActivity(data, startDate, endDate = new Date()) {
    const allItems = [...data.ideas, ...data.teams, ...data.calls, ...data.reflections];
    
    return allItems.filter(item => {
      const itemDate = new Date(item.createdDate || item.date || item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    }).length;
  }

  predictSkillDemand(data) {
    const skillCounts = {};
    
    // Count skill mentions in calls and team requirements
    [...data.calls, ...data.teams].forEach(item => {
      if (item.skillsNeeded) {
        const skills = item.skillsNeeded.split(',').map(s => s.trim());
        skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    // Return top 3 most demanded skills
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill]) => skill);
  }
}

// Smart input enhancement
class SmartInputHelper {
  constructor() {
    this.setupSmartInputs();
  }

  setupSmartInputs() {
    document.addEventListener('DOMContentLoaded', () => {
      this.enhanceInputs();
    });
  }

  enhanceInputs() {
    // Add smart suggestions to skill inputs
    const skillInputs = document.querySelectorAll('[data-smart="skills"]');
    skillInputs.forEach(input => this.addAutoComplete(input, 'skillInput'));

    // Add smart suggestions to location inputs
    const locationInputs = document.querySelectorAll('[data-smart="location"]');
    locationInputs.forEach(input => this.addAutoComplete(input, 'locationInput'));

    // Add smart suggestions to category inputs
    const categoryInputs = document.querySelectorAll('[data-smart="category"]');
    categoryInputs.forEach(input => this.addAutoComplete(input, 'ideaCategory'));
  }

  addAutoComplete(input, context) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg hidden';
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(suggestionsContainer);

    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value.length > 1) {
        const suggestions = aiEngine.getSuggestions(context, value);
        this.showSuggestions(suggestionsContainer, suggestions, input);
      } else {
        this.hideSuggestions(suggestionsContainer);
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => this.hideSuggestions(suggestionsContainer), 200);
    });
  }

  showSuggestions(container, suggestions, input) {
    if (suggestions.length === 0) {
      this.hideSuggestions(container);
      return;
    }

    container.innerHTML = suggestions.map(suggestion => 
      `<div class="px-3 py-2 hover:bg-gray-100 cursor-pointer suggestion-item" data-value="${suggestion}">
        ${suggestion}
      </div>`
    ).join('');

    container.classList.remove('hidden');

    // Add click handlers
    container.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.value;
        this.hideSuggestions(container);
        input.focus();
      });
    });
  }

  hideSuggestions(container) {
    container.classList.add('hidden');
  }
}

// Initialize AI Engine
const aiEngine = new AIEngine();
const smartInputHelper = new SmartInputHelper();

// Export for global use
window.aiEngine = aiEngine;
