/**
 * Enhanced Authentication & Profile System for IMPACT Platform
 * Supports Firebase Auth, Google/GitHub OAuth, and guest profiles
 */

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authStateListeners = [];
    this.profileData = null;
    this.init();
  }

  async init() {
    console.log('🔐 Initializing Authentication Manager...');
    
    // Wait for Firebase to be ready
    await this.waitForFirebase();
    
    // Check for existing session
    await this.checkExistingSession();
    
    // Set up Firebase Auth if available
    if (window.firebaseAuth && window.firebaseAuthMethods) {
      this.setupFirebaseAuth();
    }
    
    // Set up authentication UI handlers
    this.setupAuthUI();
    
    console.log('✅ Authentication Manager ready');
  }

  // Wait for Firebase to be available
  async waitForFirebase() {
    let attempts = 0;
    while (!window.firebaseAuth && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (window.firebaseAuth) {
      console.log('🔥 Firebase Auth available');
    } else {
      console.log('⚠️ Firebase Auth not available, using fallback mode');
    }
  }

  // Check for existing user session
  async checkExistingSession() {
    try {
      // Check Firebase auth state
      if (window.firebaseAuth && window.firebaseAuthMethods) {
        window.firebaseAuthMethods.onAuthStateChanged(window.firebaseAuth, async (user) => {
          if (user) {
            await this.handleAuthenticatedUser(user);
          } else {
            await this.handleGuestUser();
          }
        });
      } else {
        // Check local storage for guest session
        const guestProfile = localStorage.getItem('guestProfile');
        if (guestProfile) {
          this.currentUser = JSON.parse(guestProfile);
          this.isAuthenticated = false; // Guest user
          await this.loadUserProfile();
          this.notifyAuthStateChange();
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      await this.handleGuestUser();
    }
  }

  // Set up Firebase authentication
  setupFirebaseAuth() {
    // Configure Firebase Auth providers
    const { GoogleAuthProvider, GithubAuthProvider } = window.firebaseAuthMethods;
    
    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');

    const githubProvider = new GithubAuthProvider();
    githubProvider.addScope('user:email');

    this.providers = {
      google: googleProvider,
      github: githubProvider
    };

    console.log('🔥 Firebase Auth providers configured');
  }

  // Handle authenticated user
  async handleAuthenticatedUser(firebaseUser) {
    this.currentUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      provider: firebaseUser.providerData[0]?.providerId || 'email',
      emailVerified: firebaseUser.emailVerified,
      createdAt: firebaseUser.metadata.creationTime,
      lastLoginAt: firebaseUser.metadata.lastSignInTime
    };
    
    this.isAuthenticated = true;
    await this.loadUserProfile();
    this.notifyAuthStateChange();
    
    console.log('✅ User authenticated:', this.currentUser.displayName || this.currentUser.email);
  }

  // Handle guest user
  async handleGuestUser() {
    // Create temporary guest profile
    const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    this.currentUser = {
      id: guestId,
      email: null,
      displayName: 'Guest User',
      photoURL: null,
      provider: 'guest',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    
    this.isAuthenticated = false;
    
    // Save guest profile locally
    localStorage.setItem('guestProfile', JSON.stringify(this.currentUser));
    
    await this.loadUserProfile();
    this.notifyAuthStateChange();
    
    console.log('👤 Guest user session created');
  }

  // Load user profile data
  async loadUserProfile() {
    try {
      let profile = null;
      
      if (this.isAuthenticated && window.impactDataLayer) {
        // Load from Firebase for authenticated users
        profile = await window.impactDataLayer.getData(`profiles/${this.currentUser.id}`);
      } else {
        // Load from localStorage for guests
        profile = JSON.parse(localStorage.getItem(`profile_${this.currentUser.id}`) || 'null');
      }

      if (!profile) {
        // Create default profile
        profile = this.createDefaultProfile();
        await this.saveUserProfile(profile);
      }

      this.profileData = profile;
      console.log('📊 User profile loaded');
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.profileData = this.createDefaultProfile();
    }
  }

  // Create default user profile
  createDefaultProfile() {
    return {
      id: this.currentUser.id,
      personalInfo: {
        displayName: this.currentUser.displayName || 'New User',
        email: this.currentUser.email,
        photoURL: this.currentUser.photoURL,
        bio: '',
        location: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language || 'en',
        joinedAt: new Date().toISOString()
      },
      volunteerProfile: {
        skills: [],
        interests: [],
        experience: 'beginner',
        availability: [],
        timeCommitment: 'flexible',
        workStyle: 'team',
        preferredImpactAreas: [],
        causes: []
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          newOpportunities: true,
          teamUpdates: true,
          achievements: true,
          weeklyDigest: true
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showLocation: true,
          showStats: true
        },
        ai: {
          enableMatching: true,
          diversityRecommendations: true,
          learningFromInteractions: true
        }
      },
      stats: {
        totalVolunteerHours: 0,
        projectsCompleted: 0,
        teamsJoined: 0,
        impactPoints: 0,
        streakDays: 0,
        lastActiveDate: new Date().toISOString()
      },
      achievements: [],
      badges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Save user profile
  async saveUserProfile(profileData = null) {
    try {
      const profile = profileData || this.profileData;
      profile.updatedAt = new Date().toISOString();
      
      if (this.isAuthenticated && window.impactDataLayer) {
        await window.impactDataLayer.saveData(`profiles/${this.currentUser.id}`, profile);
      } else {
        localStorage.setItem(`profile_${this.currentUser.id}`, JSON.stringify(profile));
      }
      
      this.profileData = profile;
      console.log('💾 User profile saved');
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Authentication methods
  async signInWithGoogle() {
    try {
      if (!this.providers?.google) throw new Error('Google provider not configured');
      
      const { signInWithPopup } = window.firebaseAuthMethods;
      const result = await signInWithPopup(window.firebaseAuth, this.providers.google);
      console.log('✅ Google sign-in successful');
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signInWithGitHub() {
    try {
      if (!this.providers?.github) throw new Error('GitHub provider not configured');
      
      const { signInWithPopup } = window.firebaseAuthMethods;
      const result = await signInWithPopup(window.firebaseAuth, this.providers.github);
      console.log('✅ GitHub sign-in successful');
      return result.user;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  }

  async signInWithEmail(email, password) {
    try {
      // Check if Firebase is properly configured
      if (!window.firebaseAuth || !window.firebaseAuthMethods) {
        throw new Error('Firebase not properly configured. Please check your Firebase setup.');
      }

      const { signInWithEmailAndPassword } = window.firebaseAuthMethods;
      const result = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
      console.log('✅ Email sign-in successful');
      return result.user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      
      // If Firebase isn't configured properly, try demo account
      if (error.message.includes('Firebase not properly configured')) {
        console.log('🔧 Checking for demo account...');
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          const user = JSON.parse(demoUser);
          if (user.email === email) {
            await this.handleAuthenticatedUser(user);
            console.log('✅ Demo account sign-in successful');
            return user;
          }
        }
        throw new Error('Demo account not found. Please sign up first.');
      }
      
      throw error;
    }
  }

  async signUpWithEmail(email, password, displayName) {
    try {
      // Check if Firebase is properly configured
      if (!window.firebaseAuth || !window.firebaseAuthMethods) {
        throw new Error('Firebase not properly configured. Please check your Firebase setup.');
      }

      const { createUserWithEmailAndPassword, updateProfile } = window.firebaseAuthMethods;
      const result = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
      
      // Update profile with display name
      await updateProfile(result.user, {
        displayName: displayName
      });
      
      console.log('✅ Email sign-up successful');
      return result.user;
    } catch (error) {
      console.error('Email sign-up error:', error);
      
      // If Firebase isn't configured properly, create a local demo account
      if (error.message.includes('Firebase not properly configured')) {
        console.log('🔧 Creating demo account locally...');
        return await this.createDemoAccount(email, displayName);
      }
      
      throw error;
    }
  }

  // Create a demo account for when Firebase isn't configured
  async createDemoAccount(email, displayName) {
    const demoUser = {
      uid: 'demo_' + Date.now(),
      email: email,
      displayName: displayName,
      photoURL: null,
      provider: 'demo',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isDemo: true
    };

    // Store demo user locally
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    
    // Simulate auth state change
    await this.handleAuthenticatedUser(demoUser);
    
    console.log('✅ Demo account created successfully');
    return demoUser;
  }

  async signOut() {
    try {
      if (window.firebaseAuth && window.firebaseAuthMethods) {
        const { signOut } = window.firebaseAuthMethods;
        await signOut(window.firebaseAuth);
      }
      
      // Clear local data
      if (this.currentUser?.isGuest) {
        localStorage.removeItem('guestProfile');
        localStorage.removeItem(`profile_${this.currentUser.id}`);
      }
      
      this.currentUser = null;
      this.isAuthenticated = false;
      this.profileData = null;
      
      // Create new guest session
      await this.handleGuestUser();
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Profile management
  async updateProfile(updates) {
    if (!this.profileData) return false;
    
    // Deep merge updates
    this.profileData = this.deepMerge(this.profileData, updates);
    await this.saveUserProfile();
    
    this.notifyAuthStateChange();
    return true;
  }

  async updatePersonalInfo(info) {
    return await this.updateProfile({
      personalInfo: info
    });
  }

  async updateVolunteerProfile(volunteerInfo) {
    return await this.updateProfile({
      volunteerProfile: volunteerInfo
    });
  }

  async updatePreferences(preferences) {
    return await this.updateProfile({
      preferences: preferences
    });
  }

  // Stats and achievements
  async updateStats(statUpdates) {
    const currentStats = this.profileData?.stats || {};
    const updatedStats = { ...currentStats, ...statUpdates };
    
    return await this.updateProfile({
      stats: updatedStats
    });
  }

  async addAchievement(achievement) {
    const achievements = this.profileData?.achievements || [];
    achievements.push({
      ...achievement,
      earnedAt: new Date().toISOString()
    });
    
    return await this.updateProfile({
      achievements: achievements
    });
  }

  async addBadge(badge) {
    const badges = this.profileData?.badges || [];
    badges.push({
      ...badge,
      earnedAt: new Date().toISOString()
    });
    
    return await this.updateProfile({
      badges: badges
    });
  }

  // Utility methods
  deepMerge(target, source) {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    
    return output;
  }

  // Auth state management
  onAuthStateChange(listener) {
    this.authStateListeners.push(listener);
  }

  notifyAuthStateChange() {
    this.authStateListeners.forEach(listener => {
      listener({
        user: this.currentUser,
        isAuthenticated: this.isAuthenticated,
        profile: this.profileData
      });
    });
  }

  // Setup authentication UI handlers
  setupAuthUI() {
    // These will be connected to UI elements
    document.addEventListener('DOMContentLoaded', () => {
      // Sign in buttons
      const googleSignInBtn = document.getElementById('googleSignIn');
      if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => this.signInWithGoogle());
      }

      const githubSignInBtn = document.getElementById('githubSignIn');
      if (githubSignInBtn) {
        githubSignInBtn.addEventListener('click', () => this.signInWithGitHub());
      }

      // Sign out button
      const signOutBtn = document.getElementById('signOut');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', () => this.signOut());
      }

      // Profile update forms will be handled separately
    });
  }

  // Public getters
  getCurrentUser() {
    return this.currentUser;
  }

  getProfile() {
    return this.profileData;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  isGuestUser() {
    return this.currentUser?.isGuest || false;
  }

  // Migration helpers
  async upgradeGuestToAuthenticated(firebaseUser) {
    if (!this.currentUser?.isGuest) return;
    
    try {
      // Migrate guest data to authenticated user
      const guestProfile = this.profileData;
      const guestId = this.currentUser.id;
      
      // Handle the new authenticated user
      await this.handleAuthenticatedUser(firebaseUser);
      
      // Merge guest data with new profile
      if (guestProfile) {
        await this.updateProfile(guestProfile);
      }
      
      // Clean up guest data
      localStorage.removeItem('guestProfile');
      localStorage.removeItem(`profile_${guestId}`);
      
      console.log('✅ Successfully upgraded guest to authenticated user');
      return true;
    } catch (error) {
      console.error('Error upgrading guest account:', error);
      return false;
    }
  }

  // Data export for user
  async exportUserData() {
    return {
      user: this.currentUser,
      profile: this.profileData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }
}

// Global authentication manager
window.authManager = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for Firebase to be ready
  setTimeout(async () => {
    try {
      window.authManager = new AuthManager();
      console.log('🔐 Authentication system ready globally');
    } catch (error) {
      console.error('❌ Failed to initialize Authentication Manager:', error);
    }
  }, 1000);
});
