/**
 * AI Matching Demo Data Generator
 * Creates realistic sample data for demonstrating AI matching capabilities
 */

class AIMatchingDemoData {
  constructor() {
    this.sampleOpportunities = [];
    this.sampleProfiles = [];
    this.init();
  }

  init() {
    this.generateSampleOpportunities();
    this.generateSampleProfiles();
  }

  // Generate diverse sample opportunities
  generateSampleOpportunities() {
    this.sampleOpportunities = [
      {
        id: 'opp_001',
        title: 'Teach Coding to Underprivileged Youth',
        description: 'Help bridge the digital divide by teaching programming fundamentals to children in underserved communities. No prior teaching experience required - we provide training and materials.',
        location: 'Kuala Lumpur',
        impactArea: 'education',
        requiredSkills: ['programming', 'teaching', 'communication'],
        timeCommitment: 'medium',
        urgency: 'medium',
        experienceLevel: 'intermediate',
        teamSize: 'small',
        status: 'active',
        organizer: 'Tech for Good Malaysia',
        participants: 12,
        maxParticipants: 20,
        tags: ['youth', 'technology', 'education'],
        createdAt: '2025-01-15T09:00:00Z'
      },
      {
        id: 'opp_002',
        title: 'Community Garden Project Coordinator',
        description: 'Lead an urban farming initiative to create sustainable food sources in the community. Perfect for those passionate about environment and food security.',
        location: 'Shah Alam',
        impactArea: 'environment',
        requiredSkills: ['leadership', 'environment', 'communication'],
        timeCommitment: 'high',
        urgency: 'low',
        experienceLevel: 'advanced',
        teamSize: 'large',
        status: 'active',
        organizer: 'Green Communities Initiative',
        participants: 8,
        maxParticipants: 15,
        tags: ['sustainability', 'food security', 'community'],
        createdAt: '2025-01-20T14:30:00Z'
      },
      {
        id: 'opp_003',
        title: 'Mental Health First Aid Workshop Assistant',
        description: 'Support mental health awareness by assisting in first aid workshops. Help create safe spaces for mental health conversations in workplaces.',
        location: 'Manila',
        impactArea: 'health',
        requiredSkills: ['healthcare', 'communication', 'teaching'],
        timeCommitment: 'low',
        urgency: 'high',
        experienceLevel: 'beginner',
        teamSize: 'medium',
        status: 'urgent',
        organizer: 'Mind Matters Philippines',
        participants: 5,
        maxParticipants: 10,
        tags: ['mental health', 'workplace wellness', 'training'],
        createdAt: '2025-01-25T10:15:00Z'
      },
      {
        id: 'opp_004',
        title: 'Beach Cleanup Social Media Campaign',
        description: 'Create engaging content to promote our monthly beach cleanup events. Use your marketing and design skills to amplify environmental impact.',
        location: 'Mumbai',
        impactArea: 'environment',
        requiredSkills: ['marketing', 'design', 'communication'],
        timeCommitment: 'medium',
        urgency: 'medium',
        experienceLevel: 'intermediate',
        teamSize: 'small',
        status: 'active',
        organizer: 'Ocean Warriors Mumbai',
        participants: 3,
        maxParticipants: 8,
        tags: ['ocean conservation', 'social media', 'awareness'],
        createdAt: '2025-01-18T16:45:00Z'
      },
      {
        id: 'opp_005',
        title: 'Senior Citizens Digital Literacy Program',
        description: 'Help elderly community members learn to use smartphones and digital services. Patient teaching approach needed to bridge the digital generation gap.',
        location: 'Singapore',
        impactArea: 'elderly',
        requiredSkills: ['teaching', 'communication', 'technology'],
        timeCommitment: 'medium',
        urgency: 'low',
        experienceLevel: 'beginner',
        teamSize: 'medium',
        status: 'active',
        organizer: 'Digital Seniors SG',
        participants: 15,
        maxParticipants: 25,
        tags: ['digital literacy', 'seniors', 'technology'],
        createdAt: '2025-01-22T11:20:00Z'
      },
      {
        id: 'opp_006',
        title: 'Emergency Relief Fund Website Development',
        description: 'Build a responsive website for disaster relief coordination. Urgent need to help communities affected by recent flooding. Full-stack development skills preferred.',
        location: 'Jakarta',
        impactArea: 'community',
        requiredSkills: ['programming', 'design', 'leadership'],
        timeCommitment: 'high',
        urgency: 'high',
        experienceLevel: 'advanced',
        teamSize: 'small',
        status: 'urgent',
        organizer: 'Indonesia Disaster Response',
        participants: 2,
        maxParticipants: 5,
        tags: ['disaster relief', 'web development', 'emergency'],
        createdAt: '2025-01-27T08:00:00Z'
      },
      {
        id: 'opp_007',
        title: 'Youth Leadership Mentorship Program',
        description: 'Mentor young leaders in underserved communities. Share your professional experience and help develop the next generation of changemakers.',
        location: 'Bangkok',
        impactArea: 'youth',
        requiredSkills: ['leadership', 'mentoring', 'communication'],
        timeCommitment: 'medium',
        urgency: 'medium',
        experienceLevel: 'advanced',
        teamSize: 'medium',
        status: 'active',
        organizer: 'Future Leaders Thailand',
        participants: 10,
        maxParticipants: 20,
        tags: ['mentorship', 'leadership development', 'youth empowerment'],
        createdAt: '2025-01-19T13:30:00Z'
      },
      {
        id: 'opp_008',
        title: 'Community Health Screening Event',
        description: 'Organize and support free health screening events in rural areas. Medical professionals and volunteers needed to serve underserved populations.',
        location: 'Cebu',
        impactArea: 'health',
        requiredSkills: ['healthcare', 'event planning', 'communication'],
        timeCommitment: 'low',
        urgency: 'medium',
        experienceLevel: 'any',
        teamSize: 'large',
        status: 'active',
        organizer: 'Rural Health Initiative',
        participants: 25,
        maxParticipants: 50,
        tags: ['public health', 'rural outreach', 'medical screening'],
        createdAt: '2025-01-21T15:00:00Z'
      },
      {
        id: 'opp_009',
        title: 'AI Ethics Workshop Facilitator',
        description: 'Lead discussions on responsible AI development and ethics in technology. Perfect for tech professionals wanting to shape the future of AI.',
        location: 'Bangalore',
        impactArea: 'technology',
        requiredSkills: ['programming', 'teaching', 'leadership'],
        timeCommitment: 'low',
        urgency: 'low',
        experienceLevel: 'advanced',
        teamSize: 'small',
        status: 'active',
        organizer: 'AI for Good India',
        participants: 4,
        maxParticipants: 8,
        tags: ['artificial intelligence', 'ethics', 'technology education'],
        createdAt: '2025-01-24T12:45:00Z'
      },
      {
        id: 'opp_010',
        title: 'Homeless Shelter Art Therapy Program',
        description: 'Use creative arts to provide therapeutic support for individuals experiencing homelessness. Art supplies and basic training provided.',
        location: 'Ho Chi Minh City',
        impactArea: 'poverty',
        requiredSkills: ['design', 'healthcare', 'communication'],
        timeCommitment: 'medium',
        urgency: 'medium',
        experienceLevel: 'beginner',
        teamSize: 'medium',
        status: 'active',
        organizer: 'Art Heals Vietnam',
        participants: 6,
        maxParticipants: 12,
        tags: ['art therapy', 'homelessness', 'mental health'],
        createdAt: '2025-01-23T09:30:00Z'
      },
      {
        id: 'opp_011',
        title: 'Climate Change Awareness Campaign',
        description: 'Develop and execute a comprehensive digital marketing campaign to raise awareness about climate action. Data-driven approach to maximize impact.',
        location: 'Taipei',
        impactArea: 'environment',
        requiredSkills: ['marketing', 'design', 'communication'],
        timeCommitment: 'high',
        urgency: 'high',
        experienceLevel: 'intermediate',
        teamSize: 'medium',
        status: 'active',
        organizer: 'Climate Action Taiwan',
        participants: 7,
        maxParticipants: 15,
        tags: ['climate change', 'digital marketing', 'environmental advocacy'],
        createdAt: '2025-01-26T14:15:00Z'
      },
      {
        id: 'opp_012',
        title: 'Special Needs Children Support Program',
        description: 'Provide educational and emotional support to children with special needs and their families. Specialized training provided for all volunteers.',
        location: 'Colombo',
        impactArea: 'education',
        requiredSkills: ['teaching', 'healthcare', 'communication'],
        timeCommitment: 'medium',
        urgency: 'low',
        experienceLevel: 'any',
        teamSize: 'large',
        status: 'active',
        organizer: 'Inclusive Education Sri Lanka',
        participants: 18,
        maxParticipants: 30,
        tags: ['special needs', 'inclusive education', 'child development'],
        createdAt: '2025-01-17T10:00:00Z'
      }
    ];
  }

  // Generate sample user profiles for testing
  generateSampleProfiles() {
    this.sampleProfiles = [
      {
        id: 'profile_developer',
        name: 'Alex Chen - Software Developer',
        skills: ['programming', 'design', 'leadership'],
        interests: ['education', 'technology', 'youth'],
        location: 'Kuala Lumpur',
        experience: 'advanced',
        availability: ['evenings', 'weekends'],
        timeCommitment: 'medium',
        workStyle: 'team',
        preferredImpactAreas: ['education', 'technology']
      },
      {
        id: 'profile_marketer',
        name: 'Maya Patel - Marketing Specialist',
        skills: ['marketing', 'communication', 'design'],
        interests: ['environment', 'community', 'youth'],
        location: 'Mumbai',
        experience: 'intermediate',
        availability: ['weekends', 'flexible'],
        timeCommitment: 'medium',
        workStyle: 'team',
        preferredImpactAreas: ['environment', 'community']
      },
      {
        id: 'profile_teacher',
        name: 'Sarah Johnson - Educator',
        skills: ['teaching', 'communication', 'leadership'],
        interests: ['education', 'youth', 'community'],
        location: 'Manila',
        experience: 'advanced',
        availability: ['weekdays', 'evenings'],
        timeCommitment: 'high',
        workStyle: 'leadership',
        preferredImpactAreas: ['education', 'youth']
      },
      {
        id: 'profile_designer',
        name: 'Ravi Kumar - UX Designer',
        skills: ['design', 'programming', 'communication'],
        interests: ['technology', 'health', 'education'],
        location: 'Bangalore',
        experience: 'intermediate',
        availability: ['evenings', 'weekends'],
        timeCommitment: 'low',
        workStyle: 'independent',
        preferredImpactAreas: ['technology', 'health']
      },
      {
        id: 'profile_healthcare',
        name: 'Dr. Lisa Wong - Healthcare Professional',
        skills: ['healthcare', 'teaching', 'leadership'],
        interests: ['health', 'elderly', 'community'],
        location: 'Singapore',
        experience: 'advanced',
        availability: ['weekends', 'flexible'],
        timeCommitment: 'medium',
        workStyle: 'leadership',
        preferredImpactAreas: ['health', 'elderly']
      }
    ];
  }

  // Get sample opportunities
  getSampleOpportunities() {
    return this.sampleOpportunities;
  }

  // Get sample profiles
  getSampleProfiles() {
    return this.sampleProfiles;
  }

  // Initialize demo data in storage
  async initializeDemoData() {
    try {
      console.log('🎭 Initializing AI Matching demo data...');
      
      // Store opportunities
      if (window.impactDataLayer) {
        // Add to existing data
        const existingSeedboard = await window.impactDataLayer.getData('seedboardIdeas') || [];
        const existingOpenCalls = await window.impactDataLayer.getData('openCalls') || [];
        const existingTeams = await window.impactDataLayer.getData('teams') || [];
        
        // Convert opportunities to different formats for different systems
        const seedboardData = this.sampleOpportunities.filter(opp => opp.impactArea === 'education' || opp.impactArea === 'technology').map(opp => ({
          id: opp.id,
          title: opp.title,
          description: opp.description,
          author: opp.organizer,
          tags: opp.tags,
          votes: Math.floor(Math.random() * 50) + 10,
          status: opp.status,
          timestamp: opp.createdAt
        }));

        const openCallsData = this.sampleOpportunities.filter(opp => opp.urgency === 'high').map(opp => ({
          id: opp.id,
          title: opp.title,
          description: opp.description,
          location: opp.location,
          urgency: opp.urgency,
          skills: opp.requiredSkills,
          organizer: opp.organizer,
          volunteers: opp.participants,
          maxVolunteers: opp.maxParticipants,
          status: 'active',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }));

        const teamsData = this.sampleOpportunities.filter(opp => opp.teamSize === 'small' || opp.teamSize === 'medium').map(opp => ({
          id: opp.id,
          name: opp.title,
          description: opp.description,
          leader: opp.organizer,
          members: opp.participants,
          maxMembers: opp.maxParticipants,
          skills: opp.requiredSkills,
          project: opp.impactArea,
          status: 'recruiting'
        }));

        // Save enhanced data
        await window.impactDataLayer.saveData('seedboardIdeas', [...existingSeedboard, ...seedboardData]);
        await window.impactDataLayer.saveData('openCalls', [...existingOpenCalls, ...openCallsData]);
        await window.impactDataLayer.saveData('teams', [...existingTeams, ...teamsData]);
        
        console.log('✅ Demo data saved to Firebase');
      } else {
        // Fallback to localStorage
        const existingSeedboard = JSON.parse(localStorage.getItem('seedboardIdeas') || '[]');
        const existingOpenCalls = JSON.parse(localStorage.getItem('openCalls') || '[]');
        const existingTeams = JSON.parse(localStorage.getItem('teams') || '[]');

        // Convert and save data
        const seedboardData = this.sampleOpportunities.filter(opp => opp.impactArea === 'education' || opp.impactArea === 'technology').map(opp => ({
          id: opp.id,
          title: opp.title,
          description: opp.description,
          author: opp.organizer,
          tags: opp.tags,
          votes: Math.floor(Math.random() * 50) + 10,
          status: opp.status,
          timestamp: opp.createdAt
        }));

        localStorage.setItem('seedboardIdeas', JSON.stringify([...existingSeedboard, ...seedboardData]));
        console.log('✅ Demo data saved to localStorage');
      }

      // Create sample user profiles for demonstration
      if (!localStorage.getItem('demoProfilesInitialized')) {
        if (window.impactDataLayer) {
          await window.impactDataLayer.saveData('sampleProfiles', this.sampleProfiles);
        } else {
          localStorage.setItem('sampleProfiles', JSON.stringify(this.sampleProfiles));
        }
        localStorage.setItem('demoProfilesInitialized', 'true');
        console.log('✅ Sample user profiles created');
      }

      console.log('🎉 AI Matching demo data initialization complete!');
      return true;
    } catch (error) {
      console.error('❌ Error initializing demo data:', error);
      return false;
    }
  }

  // Get a sample profile for quick setup
  getSampleProfile(profileId = 'profile_developer') {
    return this.sampleProfiles.find(profile => profile.id === profileId) || this.sampleProfiles[0];
  }

  // Generate realistic match scores for demonstration
  generateDemoMatchScores() {
    return this.sampleOpportunities.map(opp => ({
      ...opp,
      demoMatchScore: Math.random() * 0.4 + 0.6, // 60-100% for demo
      demoMatchReasons: this.generateDemoReasons(opp)
    }));
  }

  // Generate demo match reasons
  generateDemoReasons(opportunity) {
    const reasons = [
      'Your skills align perfectly with this opportunity',
      'Location matches your preferences',
      'Time commitment fits your availability',
      'Impact area matches your interests',
      'Experience level is appropriate for you',
      'Team size suits your working style'
    ];

    // Return 2-3 random reasons
    const shuffled = reasons.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
  }
}

// Initialize demo data when script loads
window.aiMatchingDemoData = new AIMatchingDemoData();

// Auto-initialize demo data on page load
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other systems to load
  setTimeout(async () => {
    if (!localStorage.getItem('aiDemoDataInitialized')) {
      const success = await window.aiMatchingDemoData.initializeDemoData();
      if (success) {
        localStorage.setItem('aiDemoDataInitialized', 'true');
        console.log('🎭 AI Matching demo environment ready!');
      }
    }
  }, 3000);
});
