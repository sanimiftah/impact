// Advanced Features: User Profiles and Notifications for IMPACT Platform

// User Profile System
class UserProfileManager {
  constructor() {
    this.currentUser = this.loadProfile();
    this.initializeProfile();
  }

  loadProfile() {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: '',
      email: '',
      skills: [],
      interests: [],
      location: '',
      joinDate: new Date().toISOString(),
      avatar: '👤',
      level: 1,
      experience: 0,
      badges: [],
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      },
      stats: {
        ideasSubmitted: 0,
        teamsJoined: 0,
        callsAnswered: 0,
        reflectionsWritten: 0,
        impactScore: 0
      }
    };
  }

  saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(this.currentUser));
    this.updateUserDisplay();
  }

  updateProfile(updates) {
    Object.assign(this.currentUser, updates);
    this.saveProfile();
    this.checkLevelUp();
  }

  addExperience(points, action) {
    this.currentUser.experience += points;
    this.currentUser.stats.impactScore += points;
    
    // Update specific stats
    switch(action) {
      case 'idea_submitted':
        this.currentUser.stats.ideasSubmitted++;
        break;
      case 'team_joined':
        this.currentUser.stats.teamsJoined++;
        break;
      case 'call_answered':
        this.currentUser.stats.callsAnswered++;
        break;
      case 'reflection_written':
        this.currentUser.stats.reflectionsWritten++;
        break;
    }

    this.saveProfile();
    this.checkAchievements(action);
    
    showToast(`+${points} XP earned! ${this.getActionMessage(action)}`, 'success');
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.currentUser.experience / 100) + 1;
    if (newLevel > this.currentUser.level) {
      this.currentUser.level = newLevel;
      this.showLevelUpModal(newLevel);
    }
  }

  showLevelUpModal(level) {
    showModal(
      '🎉 Level Up!',
      `<div class="text-center">
        <div class="text-6xl mb-4">🌟</div>
        <h3 class="text-2xl font-bold text-green-600 mb-2">Congratulations!</h3>
        <p class="text-lg mb-4">You've reached Level ${level}!</p>
        <p class="text-gray-600">Your growing impact is making a real difference in the community.</p>
      </div>`,
      [{ text: 'Continue Making Impact!', class: 'bg-green-500 text-white hover:bg-green-600', onclick: 'modalManager.close(this.closest(".fixed"))' }]
    );
  }

  checkAchievements(action) {
    const achievements = [
      { id: 'first_idea', name: '🌱 First Seed', condition: () => this.currentUser.stats.ideasSubmitted >= 1, message: 'Posted your first idea!' },
      { id: 'idea_expert', name: '💡 Idea Generator', condition: () => this.currentUser.stats.ideasSubmitted >= 5, message: 'Posted 5 ideas!' },
      { id: 'team_player', name: '🤝 Team Player', condition: () => this.currentUser.stats.teamsJoined >= 3, message: 'Joined 3 teams!' },
      { id: 'first_responder', name: '🚨 First Responder', condition: () => this.currentUser.stats.callsAnswered >= 1, message: 'Answered your first urgent call!' },
      { id: 'reflective_soul', name: '📖 Reflective Soul', condition: () => this.currentUser.stats.reflectionsWritten >= 10, message: 'Written 10 reflections!' },
      { id: 'impact_maker', name: '🌟 Impact Maker', condition: () => this.currentUser.stats.impactScore >= 500, message: 'Reached 500 impact points!' }
    ];

    achievements.forEach(achievement => {
      if (!this.currentUser.badges.includes(achievement.id) && achievement.condition()) {
        this.currentUser.badges.push(achievement.id);
        this.showAchievementNotification(achievement);
      }
    });
  }

  showAchievementNotification(achievement) {
    showToast(`🏆 Achievement Unlocked: ${achievement.name} - ${achievement.message}`, 'success', 6000);
  }

  getActionMessage(action) {
    const messages = {
      'idea_submitted': 'Great idea! 💡',
      'team_joined': 'Welcome to the team! 🤝',
      'call_answered': 'Thank you for helping! 🙏',
      'reflection_written': 'Self-reflection grows wisdom! 📖'
    };
    return messages[action] || 'Keep making an impact!';
  }

  initializeProfile() {
    this.updateUserDisplay();
    if (!this.currentUser.name) {
      this.showProfileSetup();
    }
  }

  showProfileSetup() {
    const setupHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input type="text" id="setupName" class="w-full border border-gray-300 rounded p-2" placeholder="Enter your name">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" id="setupLocation" class="w-full border border-gray-300 rounded p-2" placeholder="City, Country">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Choose an avatar</label>
          <div class="flex space-x-2">
            ${['👤', '🧑‍💼', '👩‍🎓', '🧑‍🌾', '👩‍⚕️', '🧑‍🏫', '👩‍💻', '🧑‍🎨'].map(avatar => 
              `<button class="text-2xl p-2 border rounded hover:bg-gray-100" onclick="document.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('bg-blue-100')); this.classList.add('bg-blue-100'); this.classList.add('avatar-btn');" data-avatar="${avatar}">${avatar}</button>`
            ).join('')}
          </div>
        </div>
      </div>
    `;

    showModal(
      '🌱 Welcome to IMPACT!',
      setupHTML,
      [{
        text: 'Get Started',
        class: 'bg-green-500 text-white hover:bg-green-600',
        onclick: `
          const name = document.getElementById('setupName').value;
          const location = document.getElementById('setupLocation').value;
          const avatar = document.querySelector('.avatar-btn.bg-blue-100')?.dataset.avatar || '👤';
          if (name) {
            userProfile.updateProfile({ name, location, avatar });
            modalManager.close(this.closest('.fixed'));
            showToast('Welcome aboard! Let\\'s start making an impact together! 🚀', 'success');
          } else {
            showToast('Please enter your name to continue', 'warning');
          }
        `
      }]
    );
  }

  updateUserDisplay() {
    // Update user info in navigation or header if present
    const userDisplays = document.querySelectorAll('.user-display');
    userDisplays.forEach(display => {
      display.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-xl">${this.currentUser.avatar}</span>
          <div class="text-sm">
            <div class="font-semibold">${this.currentUser.name || 'Guest'}</div>
            <div class="text-gray-500">Level ${this.currentUser.level}</div>
          </div>
        </div>
      `;
    });
  }

  showProfile() {
    const profileHTML = `
      <div class="space-y-6">
        <div class="text-center">
          <div class="text-6xl mb-2">${this.currentUser.avatar}</div>
          <h3 class="text-xl font-bold">${this.currentUser.name}</h3>
          <p class="text-gray-500">Level ${this.currentUser.level} • ${this.currentUser.location}</p>
          <div class="mt-2 bg-gray-200 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" style="width: ${(this.currentUser.experience % 100)}%"></div>
          </div>
          <p class="text-xs text-gray-500 mt-1">${this.currentUser.experience % 100}/100 XP to next level</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="bg-gray-50 p-3 rounded">
            <div class="text-2xl font-bold text-green-600">${this.currentUser.stats.ideasSubmitted}</div>
            <div class="text-xs text-gray-500">Ideas Shared</div>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <div class="text-2xl font-bold text-blue-600">${this.currentUser.stats.teamsJoined}</div>
            <div class="text-xs text-gray-500">Teams Joined</div>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <div class="text-2xl font-bold text-red-600">${this.currentUser.stats.callsAnswered}</div>
            <div class="text-xs text-gray-500">Calls Answered</div>
          </div>
          <div class="bg-gray-50 p-3 rounded">
            <div class="text-2xl font-bold text-purple-600">${this.currentUser.stats.impactScore}</div>
            <div class="text-xs text-gray-500">Impact Score</div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-2">🏆 Achievements</h4>
          <div class="flex flex-wrap gap-2">
            ${this.currentUser.badges.length > 0 
              ? this.currentUser.badges.map(badge => this.getBadgeDisplay(badge)).join('')
              : '<span class="text-gray-500 text-sm">No achievements yet. Keep making an impact!</span>'
            }
          </div>
        </div>
      </div>
    `;

    showModal('Your Profile', profileHTML, [
      { text: 'Edit Profile', class: 'bg-blue-500 text-white hover:bg-blue-600', onclick: 'userProfile.editProfile(); modalManager.close(this.closest(".fixed"));' },
      { text: 'Close', class: 'bg-gray-300 text-gray-700 hover:bg-gray-400', onclick: 'modalManager.close(this.closest(".fixed"))' }
    ]);
  }

  getBadgeDisplay(badgeId) {
    const badges = {
      'first_idea': '🌱',
      'idea_expert': '💡',
      'team_player': '🤝',
      'first_responder': '🚨',
      'reflective_soul': '📖',
      'impact_maker': '🌟'
    };
    return `<span class="text-lg" title="${badgeId.replace('_', ' ')}">${badges[badgeId] || '🏆'}</span>`;
  }

  editProfile() {
    // Implementation for profile editing
    showToast('Profile editing coming soon!', 'info');
  }
}

// Notification System
class NotificationManager {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    this.isEnabled = JSON.parse(localStorage.getItem('notificationsEnabled') || 'true');
  }

  add(title, message, type = 'info', actionUrl = null) {
    if (!this.isEnabled) return;

    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      actionUrl,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(notification);
    this.save();
    this.showBrowserNotification(title, message);
    this.updateBadge();
  }

  showBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>'
      });
    }
  }

  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showToast('Notifications enabled! You\'ll receive updates about community activities.', 'success');
        }
      });
    }
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.save();
      this.updateBadge();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.save();
    this.updateBadge();
  }

  save() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  updateBadge() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    const badges = document.querySelectorAll('.notification-badge');
    badges.forEach(badge => {
      badge.textContent = unreadCount > 0 ? unreadCount : '';
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    });
  }

  showNotificationPanel() {
    const notificationsHTML = this.notifications.length > 0 
      ? this.notifications.slice(0, 10).map(n => `
          <div class="notification-item p-3 border-b ${n.read ? 'bg-gray-50' : 'bg-blue-50'} hover:bg-gray-100 cursor-pointer" onclick="notificationManager.markAsRead(${n.id}); ${n.actionUrl ? `window.location.href='${n.actionUrl}'` : ''}">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-sm">${n.title}</h4>
                <p class="text-xs text-gray-600 mt-1">${n.message}</p>
                <p class="text-xs text-gray-400 mt-1">${new Date(n.timestamp).toLocaleString()}</p>
              </div>
              ${!n.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>' : ''}
            </div>
          </div>
        `).join('')
      : '<div class="p-4 text-center text-gray-500">No notifications yet</div>';

    showModal(
      'Notifications',
      `<div class="max-h-96 overflow-y-auto">${notificationsHTML}</div>`,
      [
        { text: 'Mark All Read', class: 'bg-blue-500 text-white hover:bg-blue-600', onclick: 'notificationManager.markAllAsRead(); modalManager.close(this.closest(".fixed"));' },
        { text: 'Close', class: 'bg-gray-300 text-gray-700 hover:bg-gray-400', onclick: 'modalManager.close(this.closest(".fixed"))' }
      ]
    );
  }
}

// Initialize advanced features
const userProfile = new UserProfileManager();
const notificationManager = new NotificationManager();

// Global functions for integration
window.userProfile = userProfile;
window.notificationManager = notificationManager;

// Auto-request notification permission after a short delay
setTimeout(() => {
  notificationManager.requestPermission();
}, 3000);

// Add example notifications for demonstration
setTimeout(() => {
  if (Math.random() > 0.7) { // 30% chance
    notificationManager.add(
      'Community Update',
      'New urgent call posted in your area - check OpenCall for details!',
      'urgent',
      'opencall.html'
    );
  }
}, 10000);
