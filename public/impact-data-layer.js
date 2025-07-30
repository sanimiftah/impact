// Enhanced IMPACT Data Layer with Firebase Integration
// This layer maintains backward compatibility while adding real-time features

class ImpactDataLayer {
  constructor() {
    this.isFirebaseReady = false;
    this.realtimeListeners = new Map();
    this.initializeFirebase();
  }

  async initializeFirebase() {
    try {
      // Wait for Firebase to be ready
      if (window.impactData) {
        this.isFirebaseReady = true;
        console.log('✅ IMPACT Data Layer: Firebase integration ready');
        await this.migrateLocalStorageToFirebase();
      } else {
        console.warn('⚠️ IMPACT Data Layer: Firebase not available, using localStorage only');
      }
    } catch (error) {
      console.warn('⚠️ Firebase initialization failed:', error);
    }
  }

  // Migrate existing localStorage data to Firebase
  async migrateLocalStorageToFirebase() {
    const dataKeys = [
      'seedboardIdeas',
      'volunteers', 
      'teams',
      'openCalls',
      'impactEntries',
      'volunteerSpotlight'
    ];

    for (const key of dataKeys) {
      const localData = localStorage.getItem(key);
      if (localData && localData !== '[]') {
        try {
          const parsedData = JSON.parse(localData);
          await window.impactData.saveData(key, parsedData);
          console.log(`✅ Migrated ${key} to Firebase`);
        } catch (error) {
          console.warn(`⚠️ Migration failed for ${key}:`, error);
        }
      }
    }
  }

  // Enhanced methods for each data type
  async getSeedboardIdeas() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('seedboardIdeas', []);
    }
    return JSON.parse(localStorage.getItem('seedboardIdeas') || '[]');
  }

  async saveSeedboardIdeas(ideas) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('seedboardIdeas', ideas);
    } else {
      localStorage.setItem('seedboardIdeas', JSON.stringify(ideas));
    }
  }

  async addSeedboardIdea(idea) {
    if (this.isFirebaseReady) {
      return await window.impactData.addToList('seedboardIdeas', idea);
    } else {
      const ideas = await this.getSeedboardIdeas();
      const newIdea = { ...idea, id: Date.now().toString(), createdAt: Date.now() };
      ideas.push(newIdea);
      await this.saveSeedboardIdeas(ideas);
      return newIdea.id;
    }
  }

  async getVolunteers() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('volunteers', []);
    }
    return JSON.parse(localStorage.getItem('volunteers') || '[]');
  }

  async saveVolunteers(volunteers) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('volunteers', volunteers);
    } else {
      localStorage.setItem('volunteers', JSON.stringify(volunteers));
    }
  }

  async getTeams() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('teams', []);
    }
    return JSON.parse(localStorage.getItem('teams') || '[]');
  }

  async saveTeams(teams) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('teams', teams);
    } else {
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  }

  async getOpenCalls() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('openCalls', []);
    }
    return JSON.parse(localStorage.getItem('openCalls') || '[]');
  }

  async saveOpenCalls(calls) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('openCalls', calls);
    } else {
      localStorage.setItem('openCalls', JSON.stringify(calls));
    }
  }

  async getImpactEntries() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('impactEntries', []);
    }
    return JSON.parse(localStorage.getItem('impactEntries') || '[]');
  }

  async saveImpactEntries(entries) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('impactEntries', entries);
    } else {
      localStorage.setItem('impactEntries', JSON.stringify(entries));
    }
  }

  async getVolunteerSpotlight() {
    if (this.isFirebaseReady) {
      return await window.impactData.loadData('volunteerSpotlight', []);
    }
    return JSON.parse(localStorage.getItem('volunteerSpotlight') || '[]');
  }

  async saveVolunteerSpotlight(spotlight) {
    if (this.isFirebaseReady) {
      await window.impactData.saveData('volunteerSpotlight', spotlight);
    } else {
      localStorage.setItem('volunteerSpotlight', JSON.stringify(spotlight));
    }
  }

  // Real-time subscriptions
  subscribeToSeedboardUpdates(callback) {
    if (this.isFirebaseReady) {
      const unsubscribe = window.impactData.subscribeToUpdates('seedboardIdeas', callback);
      this.realtimeListeners.set('seedboardIdeas', unsubscribe);
      return unsubscribe;
    }
    return null;
  }

  subscribeToVolunteerUpdates(callback) {
    if (this.isFirebaseReady) {
      const unsubscribe = window.impactData.subscribeToUpdates('volunteers', callback);
      this.realtimeListeners.set('volunteers', unsubscribe);
      return unsubscribe;
    }
    return null;
  }

  subscribeToTeamUpdates(callback) {
    if (this.isFirebaseReady) {
      const unsubscribe = window.impactData.subscribeToUpdates('teams', callback);
      this.realtimeListeners.set('teams', unsubscribe);
      return unsubscribe;
    }
    return null;
  }

  subscribeToOpenCallUpdates(callback) {
    if (this.isFirebaseReady) {
      const unsubscribe = window.impactData.subscribeToUpdates('openCalls', callback);
      this.realtimeListeners.set('openCalls', unsubscribe);
      return unsubscribe;
    }
    return null;
  }

  // Cleanup
  unsubscribeAll() {
    this.realtimeListeners.forEach((unsubscribe, key) => {
      if (unsubscribe) {
        unsubscribe();
        console.log(`✅ Unsubscribed from ${key}`);
      }
    });
    this.realtimeListeners.clear();
  }

  // Analytics and insights
  async getGlobalStats() {
    const [ideas, volunteers, teams, calls, entries] = await Promise.all([
      this.getSeedboardIdeas(),
      this.getVolunteers(),
      this.getTeams(),
      this.getOpenCalls(),
      this.getImpactEntries()
    ]);

    return {
      totalIdeas: ideas.length,
      activeIdeas: ideas.filter(idea => idea.status === 'active').length,
      totalVolunteers: volunteers.length,
      totalTeams: teams.length,
      activeTeams: teams.filter(team => team.status === 'active').length,
      totalCalls: calls.length,
      urgentCalls: calls.filter(call => call.priority === 'urgent').length,
      totalEntries: entries.length,
      totalImpactHours: entries.reduce((sum, entry) => sum + (entry.hours || 0), 0),
      lastUpdated: Date.now()
    };
  }

  // Search and filtering
  async searchAll(query) {
    const [ideas, volunteers, teams, calls] = await Promise.all([
      this.getSeedboardIdeas(),
      this.getVolunteers(),
      this.getTeams(),
      this.getOpenCalls()
    ]);

    const searchTerm = query.toLowerCase();
    
    return {
      ideas: ideas.filter(item => 
        item.title?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      ),
      volunteers: volunteers.filter(item =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.skills?.some(skill => skill.toLowerCase().includes(searchTerm))
      ),
      teams: teams.filter(item =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      ),
      calls: calls.filter(item =>
        item.title?.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      )
    };
  }
}

// Global instance
window.impactDataLayer = new ImpactDataLayer();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImpactDataLayer;
}
