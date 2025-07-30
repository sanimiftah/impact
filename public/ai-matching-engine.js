/**
 * AI-Powered Matching Engine for IMPACT Platform
 * Smart volunteer-opportunity matching using advanced algorithms
 */

class AIMatchingEngine {
  constructor() {
    this.initialized = false;
    this.userProfile = null;
    this.matchingWeights = {
      skills: 0.30,
      location: 0.20,
      availability: 0.15,
      interests: 0.15,
      experience: 0.10,
      impact: 0.10
    };
    this.confidenceThreshold = 0.6;
    this.init();
  }

  async init() {
    try {
      console.log('🤖 Initializing AI Matching Engine...');
      await this.loadUserProfile();
      await this.loadOpportunities();
      this.initialized = true;
      console.log('✅ AI Matching Engine ready!');
    } catch (error) {
      console.error('❌ AI Matching Engine initialization failed:', error);
    }
  }

  // Load or create user profile
  async loadUserProfile() {
    try {
      let profile = null;
      
      if (window.impactDataLayer) {
        profile = await window.impactDataLayer.getData('userProfile');
      } else {
        profile = JSON.parse(localStorage.getItem('userProfile') || 'null');
      }

      if (!profile) {
        // Create default profile that we'll enhance
        profile = {
          id: 'user_' + Date.now(),
          skills: [],
          interests: [],
          location: '',
          availability: [],
          experience: 'beginner',
          preferredImpactAreas: [],
          pastVolunteering: [],
          personalityType: 'helper', // helper, leader, supporter, innovator
          timeCommitment: 'flexible',
          communicationStyle: 'collaborative',
          workStyle: 'team',
          matchingPreferences: {
            maxDistance: 50,
            minTimeCommitment: 1,
            maxTimeCommitment: 20,
            urgencyPreference: 'medium'
          }
        };
        
        if (window.impactDataLayer) {
          await window.impactDataLayer.saveData('userProfile', profile);
        } else {
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }
      }

      this.userProfile = profile;
      console.log('📊 User profile loaded:', profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Load available opportunities
  async loadOpportunities() {
    try {
      let opportunities = [];
      
      if (window.impactDataLayer) {
        const [seedboard, openCalls, teams] = await Promise.all([
          window.impactDataLayer.getData('seedboardIdeas') || [],
          window.impactDataLayer.getData('openCalls') || [],
          window.impactDataLayer.getData('teams') || []
        ]);
        opportunities = [...seedboard, ...openCalls, ...teams];
      } else {
        const seedboard = JSON.parse(localStorage.getItem('seedboardIdeas') || '[]');
        const openCalls = JSON.parse(localStorage.getItem('openCalls') || '[]');
        const teams = JSON.parse(localStorage.getItem('teams') || '[]');
        opportunities = [...seedboard, ...openCalls, ...teams];
      }

      // Enhance opportunities with matching metadata
      this.opportunities = opportunities.map(opp => this.enhanceOpportunity(opp));
      console.log(`📋 ${this.opportunities.length} opportunities loaded for matching`);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      this.opportunities = [];
    }
  }

  // Enhance opportunity with AI matching metadata
  enhanceOpportunity(opportunity) {
    const enhanced = { ...opportunity };
    
    // Extract skills from description/title
    enhanced.requiredSkills = this.extractSkills(opportunity.title + ' ' + (opportunity.description || ''));
    
    // Determine impact area
    enhanced.impactArea = this.classifyImpactArea(opportunity);
    
    // Estimate time commitment
    enhanced.timeCommitment = this.estimateTimeCommitment(opportunity);
    
    // Determine urgency level
    enhanced.urgency = this.determineUrgency(opportunity);
    
    // Set experience level required
    enhanced.experienceLevel = this.determineExperienceLevel(opportunity);
    
    // Determine team size preference
    enhanced.teamSize = opportunity.teamSize || this.estimateTeamSize(opportunity);
    
    return enhanced;
  }

  // AI skill extraction from text
  extractSkills(text) {
    const skillKeywords = {
      'programming': ['code', 'coding', 'programming', 'software', 'web', 'app', 'development', 'tech'],
      'design': ['design', 'ui', 'ux', 'graphic', 'visual', 'creative', 'branding'],
      'marketing': ['marketing', 'social media', 'promotion', 'outreach', 'advertising', 'content'],
      'teaching': ['teach', 'mentor', 'tutor', 'education', 'training', 'workshop'],
      'leadership': ['lead', 'manage', 'coordinate', 'organize', 'facilitate', 'direct'],
      'communication': ['communicate', 'speak', 'present', 'write', 'translate', 'mediate'],
      'healthcare': ['medical', 'health', 'nursing', 'therapy', 'wellness', 'mental health'],
      'environment': ['environment', 'climate', 'sustainability', 'green', 'eco', 'conservation'],
      'fundraising': ['fundraise', 'donation', 'grant', 'finance', 'budget', 'sponsor'],
      'event planning': ['event', 'party', 'ceremony', 'celebration', 'logistics', 'coordination']
    };

    const extractedSkills = [];
    const lowerText = text.toLowerCase();

    for (const [skill, keywords] of Object.entries(skillKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        extractedSkills.push(skill);
      }
    }

    return extractedSkills;
  }

  // Classify impact area
  classifyImpactArea(opportunity) {
    const impactAreas = {
      'education': ['education', 'school', 'student', 'learning', 'teach', 'mentor'],
      'environment': ['environment', 'climate', 'green', 'sustainability', 'nature', 'eco'],
      'health': ['health', 'medical', 'wellness', 'mental', 'fitness', 'nutrition'],
      'community': ['community', 'neighborhood', 'local', 'social', 'cultural', 'civic'],
      'poverty': ['poverty', 'homeless', 'hunger', 'food', 'shelter', 'assistance'],
      'youth': ['youth', 'children', 'kids', 'teen', 'young', 'school'],
      'elderly': ['elderly', 'senior', 'aging', 'retirement', 'old'],
      'technology': ['technology', 'digital', 'tech', 'innovation', 'coding', 'ai']
    };

    const text = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    for (const [area, keywords] of Object.entries(impactAreas)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return area;
      }
    }

    return 'general';
  }

  // Estimate time commitment
  estimateTimeCommitment(opportunity) {
    const text = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    if (text.includes('urgent') || text.includes('immediate') || text.includes('asap')) {
      return 'high';
    } else if (text.includes('ongoing') || text.includes('long-term') || text.includes('commitment')) {
      return 'medium';
    } else if (text.includes('quick') || text.includes('one-time') || text.includes('short')) {
      return 'low';
    }
    
    return 'medium';
  }

  // Determine urgency level
  determineUrgency(opportunity) {
    if (opportunity.status === 'urgent' || opportunity.priority === 'high') {
      return 'high';
    }
    
    const text = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    if (text.includes('urgent') || text.includes('emergency') || text.includes('asap')) {
      return 'high';
    } else if (text.includes('soon') || text.includes('quickly')) {
      return 'medium';
    }
    
    return 'low';
  }

  // Determine experience level required
  determineExperienceLevel(opportunity) {
    const text = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    if (text.includes('beginner') || text.includes('no experience') || text.includes('entry')) {
      return 'beginner';
    } else if (text.includes('experienced') || text.includes('advanced') || text.includes('expert')) {
      return 'advanced';
    } else if (text.includes('intermediate') || text.includes('some experience')) {
      return 'intermediate';
    }
    
    return 'any';
  }

  // Estimate team size
  estimateTeamSize(opportunity) {
    const text = (opportunity.title + ' ' + (opportunity.description || '')).toLowerCase();
    
    if (text.includes('solo') || text.includes('individual') || text.includes('alone')) {
      return 'individual';
    } else if (text.includes('small') || text.includes('few people')) {
      return 'small';
    } else if (text.includes('large') || text.includes('many') || text.includes('crowd')) {
      return 'large';
    }
    
    return 'medium';
  }

  // Calculate match score between user and opportunity
  calculateMatchScore(opportunity) {
    if (!this.userProfile) return 0;

    let totalScore = 0;
    const weights = this.matchingWeights;

    // Skills matching (30%)
    const skillScore = this.calculateSkillMatch(opportunity);
    totalScore += skillScore * weights.skills;

    // Location matching (20%)
    const locationScore = this.calculateLocationMatch(opportunity);
    totalScore += locationScore * weights.location;

    // Availability matching (15%)
    const availabilityScore = this.calculateAvailabilityMatch(opportunity);
    totalScore += availabilityScore * weights.availability;

    // Interests matching (15%)
    const interestScore = this.calculateInterestMatch(opportunity);
    totalScore += interestScore * weights.interests;

    // Experience matching (10%)
    const experienceScore = this.calculateExperienceMatch(opportunity);
    totalScore += experienceScore * weights.experience;

    // Impact area matching (10%)
    const impactScore = this.calculateImpactMatch(opportunity);
    totalScore += impactScore * weights.impact;

    return Math.min(totalScore, 1); // Cap at 1.0
  }

  // Calculate skill compatibility
  calculateSkillMatch(opportunity) {
    if (!this.userProfile.skills.length || !opportunity.requiredSkills.length) {
      return 0.5; // Neutral if no skills specified
    }

    const userSkills = this.userProfile.skills.map(s => s.toLowerCase());
    const requiredSkills = opportunity.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = userSkills.filter(skill => 
      requiredSkills.some(required => 
        skill.includes(required) || required.includes(skill)
      )
    );

    return Math.min(matchedSkills.length / requiredSkills.length, 1);
  }

  // Calculate location compatibility
  calculateLocationMatch(opportunity) {
    if (!this.userProfile.location || !opportunity.location) {
      return 0.7; // Neutral if location not specified
    }

    const userLocation = this.userProfile.location.toLowerCase();
    const oppLocation = opportunity.location.toLowerCase();

    if (userLocation === oppLocation) return 1;
    if (userLocation.includes(oppLocation) || oppLocation.includes(userLocation)) return 0.8;
    
    // Could add more sophisticated location matching (distance, etc.)
    return 0.3;
  }

  // Calculate availability compatibility
  calculateAvailabilityMatch(opportunity) {
    if (!this.userProfile.availability.length) return 0.6;

    const userAvailability = this.userProfile.availability;
    const oppTimeCommitment = opportunity.timeCommitment;

    const timeCommitmentScore = {
      'high': userAvailability.includes('full-time') || userAvailability.includes('weekdays') ? 1 : 0.3,
      'medium': userAvailability.includes('part-time') || userAvailability.includes('weekends') ? 1 : 0.7,
      'low': userAvailability.includes('flexible') || userAvailability.includes('evenings') ? 1 : 0.8
    };

    return timeCommitmentScore[oppTimeCommitment] || 0.6;
  }

  // Calculate interest compatibility
  calculateInterestMatch(opportunity) {
    if (!this.userProfile.interests.length) return 0.5;

    const userInterests = this.userProfile.interests.map(i => i.toLowerCase());
    const oppArea = opportunity.impactArea?.toLowerCase();

    if (userInterests.includes(oppArea)) return 1;

    // Check for related interests
    const relatedMatch = userInterests.some(interest => 
      oppArea?.includes(interest) || interest.includes(oppArea || '')
    );

    return relatedMatch ? 0.7 : 0.3;
  }

  // Calculate experience compatibility
  calculateExperienceMatch(opportunity) {
    const userExp = this.userProfile.experience;
    const requiredExp = opportunity.experienceLevel;

    const experienceMatrix = {
      'beginner': { 'beginner': 1, 'intermediate': 0.7, 'advanced': 0.3, 'any': 1 },
      'intermediate': { 'beginner': 1, 'intermediate': 1, 'advanced': 0.8, 'any': 1 },
      'advanced': { 'beginner': 1, 'intermediate': 1, 'advanced': 1, 'any': 1 }
    };

    return experienceMatrix[userExp]?.[requiredExp] || 0.6;
  }

  // Calculate impact area compatibility
  calculateImpactMatch(opportunity) {
    if (!this.userProfile.preferredImpactAreas.length) return 0.6;

    const userAreas = this.userProfile.preferredImpactAreas.map(a => a.toLowerCase());
    const oppArea = opportunity.impactArea?.toLowerCase();

    return userAreas.includes(oppArea) ? 1 : 0.4;
  }

  // Get AI recommendations for user
  async getRecommendations(limit = 10, minConfidence = null) {
    if (!this.initialized) {
      console.warn('AI Matching Engine not initialized');
      return [];
    }

    const confidence = minConfidence || this.confidenceThreshold;
    
    // Calculate scores for all opportunities
    const scoredOpportunities = this.opportunities.map(opp => ({
      ...opp,
      matchScore: this.calculateMatchScore(opp),
      matchReasons: this.generateMatchReasons(opp)
    }));

    // Filter by confidence threshold and sort by score
    const recommendations = scoredOpportunities
      .filter(opp => opp.matchScore >= confidence)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    console.log(`🎯 Generated ${recommendations.length} AI recommendations`);
    return recommendations;
  }

  // Generate human-readable match reasons
  generateMatchReasons(opportunity) {
    const reasons = [];
    const score = this.calculateMatchScore(opportunity);

    if (this.calculateSkillMatch(opportunity) > 0.7) {
      reasons.push('Your skills match perfectly');
    }

    if (this.calculateLocationMatch(opportunity) > 0.8) {
      reasons.push('Close to your location');
    }

    if (this.calculateInterestMatch(opportunity) > 0.7) {
      reasons.push('Aligns with your interests');
    }

    if (this.calculateAvailabilityMatch(opportunity) > 0.8) {
      reasons.push('Fits your schedule');
    }

    if (opportunity.urgency === 'high' && this.userProfile.matchingPreferences.urgencyPreference === 'high') {
      reasons.push('Urgent need - great for immediate impact');
    }

    if (reasons.length === 0) {
      reasons.push('Good general match for your profile');
    }

    return reasons;
  }

  // Update user profile based on interactions
  async updateUserProfile(updates) {
    this.userProfile = { ...this.userProfile, ...updates };
    
    try {
      if (window.impactDataLayer) {
        await window.impactDataLayer.saveData('userProfile', this.userProfile);
      } else {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      }
      console.log('📊 User profile updated');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // Learn from user interactions
  async learnFromInteraction(opportunityId, interactionType, rating = null) {
    try {
      // Track user interactions for learning
      const interaction = {
        opportunityId,
        interactionType, // 'view', 'apply', 'dismiss', 'rate'
        rating,
        timestamp: new Date().toISOString()
      };

      let interactions = [];
      if (window.impactDataLayer) {
        interactions = await window.impactDataLayer.getData('userInteractions') || [];
      } else {
        interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
      }

      interactions.push(interaction);

      // Keep only last 100 interactions
      if (interactions.length > 100) {
        interactions = interactions.slice(-100);
      }

      if (window.impactDataLayer) {
        await window.impactDataLayer.saveData('userInteractions', interactions);
      } else {
        localStorage.setItem('userInteractions', JSON.stringify(interactions));
      }

      // Adjust matching weights based on positive interactions
      if (interactionType === 'apply' || (rating && rating >= 4)) {
        await this.adjustMatchingWeights(opportunityId);
      }

      console.log(`📈 Learning from interaction: ${interactionType} for ${opportunityId}`);
    } catch (error) {
      console.error('Error learning from interaction:', error);
    }
  }

  // Adjust matching algorithm weights based on successful matches
  async adjustMatchingWeights(opportunityId) {
    // This is a simplified learning mechanism
    // In a real AI system, this would be much more sophisticated
    
    const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;

    // Increase weight for factors that contributed to this successful match
    const skillMatch = this.calculateSkillMatch(opportunity);
    const locationMatch = this.calculateLocationMatch(opportunity);
    const interestMatch = this.calculateInterestMatch(opportunity);

    const adjustmentFactor = 0.01; // Small incremental learning

    if (skillMatch > 0.8) {
      this.matchingWeights.skills = Math.min(this.matchingWeights.skills + adjustmentFactor, 0.5);
    }

    if (locationMatch > 0.8) {
      this.matchingWeights.location = Math.min(this.matchingWeights.location + adjustmentFactor, 0.4);
    }

    if (interestMatch > 0.8) {
      this.matchingWeights.interests = Math.min(this.matchingWeights.interests + adjustmentFactor, 0.3);
    }

    console.log('🧠 Adjusted matching weights:', this.matchingWeights);
  }

  // Get diversity recommendations (different from usual matches)
  async getDiversityRecommendations(limit = 5) {
    if (!this.initialized) return [];

    // Get opportunities that are different from user's usual preferences
    const diverseOpportunities = this.opportunities
      .filter(opp => {
        const score = this.calculateMatchScore(opp);
        return score >= 0.3 && score <= 0.7; // Medium match - not too similar, not too different
      })
      .map(opp => ({
        ...opp,
        matchScore: this.calculateMatchScore(opp),
        diversityReasons: this.generateDiversityReasons(opp)
      }))
      .sort((a, b) => Math.abs(0.5 - a.matchScore) - Math.abs(0.5 - b.matchScore)) // Sort by how close to 0.5 (medium match)
      .slice(0, limit);

    console.log(`🌈 Generated ${diverseOpportunities.length} diversity recommendations`);
    return diverseOpportunities;
  }

  // Generate reasons for diversity recommendations
  generateDiversityReasons(opportunity) {
    const reasons = [];

    if (!this.userProfile.preferredImpactAreas.includes(opportunity.impactArea)) {
      reasons.push(`Explore ${opportunity.impactArea} volunteering`);
    }

    if (opportunity.experienceLevel !== this.userProfile.experience) {
      reasons.push('Challenge yourself with a different experience level');
    }

    if (!this.userProfile.skills.some(skill => opportunity.requiredSkills.includes(skill))) {
      reasons.push('Learn new skills while helping');
    }

    if (reasons.length === 0) {
      reasons.push('Step outside your comfort zone');
    }

    return reasons;
  }

  // Get trending opportunities based on community engagement
  async getTrendingOpportunities(limit = 5) {
    // Mock trending algorithm - in real implementation, this would analyze engagement metrics
    const trending = this.opportunities
      .map(opp => ({
        ...opp,
        trendingScore: Math.random(), // Mock engagement score
        trendingReasons: ['High community engagement', 'Recently featured', 'Growing rapidly']
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    console.log(`📈 Generated ${trending.length} trending opportunities`);
    return trending;
  }
}

// Initialize global AI matching engine
window.aiMatchingEngine = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Wait a bit for other systems to initialize
  setTimeout(async () => {
    try {
      window.aiMatchingEngine = new AIMatchingEngine();
      console.log('🤖 AI Matching Engine ready globally');
    } catch (error) {
      console.error('❌ Failed to initialize AI Matching Engine:', error);
    }
  }, 2000);
});
