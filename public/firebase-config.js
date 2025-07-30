// Firebase Configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  // You'll need to create a Firebase project at https://console.firebase.google.com
  // and replace these with your actual config values
  apiKey: "your-api-key-here",
  authDomain: "impact-platform.firebaseapp.com",
  databaseURL: "https://impact-platform-default-rtdb.firebaseio.com/",
  projectId: "impact-platform",
  storageBucket: "impact-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push, onValue, off } from 'firebase/database';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Export Firebase services for use in other modules
window.firebaseApp = app;
window.firebaseDatabase = database;
window.firebaseAuth = auth;
window.firebaseAuthMethods = {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
};

// Enhanced data management with Firebase
class ImpactDataManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.setupOfflineSync();
    this.initAuth();
  }

  async initAuth() {
    try {
      // Sign in anonymously for now (can upgrade to full auth later)
      await signInAnonymously(auth);
      console.log('✅ Firebase Auth: Anonymous sign-in successful');
    } catch (error) {
      console.warn('⚠️ Firebase Auth failed, falling back to localStorage:', error);
    }
  }

  setupOfflineSync() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Save data with automatic fallback
  async saveData(path, data) {
    try {
      if (this.isOnline) {
        const dataRef = ref(database, path);
        await set(dataRef, {
          ...data,
          lastUpdated: Date.now(),
          updatedBy: auth.currentUser?.uid || 'anonymous'
        });
        
        // Also save to localStorage as backup
        localStorage.setItem(path, JSON.stringify(data));
        console.log(`✅ Data saved to Firebase: ${path}`);
        return true;
      } else {
        throw new Error('Offline');
      }
    } catch (error) {
      console.warn(`⚠️ Firebase save failed, using localStorage: ${path}`, error);
      localStorage.setItem(path, JSON.stringify(data));
      this.syncQueue.push({ path, data, action: 'save' });
      return false;
    }
  }

  // Load data with automatic fallback
  async loadData(path, defaultValue = []) {
    try {
      if (this.isOnline) {
        const dataRef = ref(database, path);
        const snapshot = await get(dataRef);
        
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          // Also update localStorage cache
          localStorage.setItem(path, JSON.stringify(firebaseData));
          console.log(`✅ Data loaded from Firebase: ${path}`);
          return firebaseData;
        }
      }
      throw new Error('No Firebase data or offline');
    } catch (error) {
      console.warn(`⚠️ Firebase load failed, using localStorage: ${path}`, error);
      const localData = localStorage.getItem(path);
      return localData ? JSON.parse(localData) : defaultValue;
    }
  }

  // Real-time listener for live updates
  subscribeToUpdates(path, callback) {
    if (!this.isOnline) return null;

    try {
      const dataRef = ref(database, path);
      const unsubscribe = onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          callback(data);
          // Update localStorage cache
          localStorage.setItem(path, JSON.stringify(data));
        }
      });
      
      console.log(`✅ Subscribed to real-time updates: ${path}`);
      return unsubscribe;
    } catch (error) {
      console.warn(`⚠️ Real-time subscription failed: ${path}`, error);
      return null;
    }
  }

  // Sync pending data when back online
  async syncPendingData() {
    if (this.syncQueue.length === 0) return;

    console.log(`🔄 Syncing ${this.syncQueue.length} pending items...`);
    
    for (const item of this.syncQueue) {
      try {
        if (item.action === 'save') {
          await this.saveData(item.path, item.data);
        }
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }
    
    this.syncQueue = [];
    console.log('✅ Sync complete');
  }

  // Add new item to a list
  async addToList(path, newItem) {
    try {
      if (this.isOnline) {
        const listRef = ref(database, path);
        const newItemRef = push(listRef);
        await set(newItemRef, {
          ...newItem,
          id: newItemRef.key,
          createdAt: Date.now(),
          createdBy: auth.currentUser?.uid || 'anonymous'
        });
        console.log(`✅ Item added to Firebase list: ${path}`);
        return newItemRef.key;
      } else {
        throw new Error('Offline');
      }
    } catch (error) {
      console.warn(`⚠️ Firebase add failed, using localStorage: ${path}`, error);
      
      // Fallback to localStorage
      const currentList = JSON.parse(localStorage.getItem(path) || '[]');
      const newId = Date.now().toString();
      const itemWithId = { ...newItem, id: newId, createdAt: Date.now() };
      currentList.push(itemWithId);
      localStorage.setItem(path, JSON.stringify(currentList));
      
      this.syncQueue.push({ path, data: currentList, action: 'save' });
      return newId;
    }
  }
}

// Global instance
window.impactData = new ImpactDataManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ImpactDataManager, database, auth };
}
