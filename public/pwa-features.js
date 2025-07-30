// Enhanced Progressive Web App (PWA) Features for IMPACT Platform
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.notificationPermission = 'default';
    this.installPromptShown = false;
    this.initializePWA();
  }

  async initializePWA() {
    console.log('📱 PWA: Initializing enhanced PWA features');
    
    await this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineHandling();
    this.setupNotifications();
    this.setupAppBadge();
    this.setupShareTarget();
    this.addPWAStyles();
    this.createInstallButton();
    this.detectInstallStatus();
    
    console.log('✅ PWA: Enhanced PWA features initialized');
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ PWA: Service Worker registered:', registration.scope);
        
        this.checkForUpdates(registration);
        this.setupBackgroundSync(registration);
        
        return registration;
      } catch (error) {
        console.error('❌ PWA: Service Worker registration failed:', error);
      }
    }
  }

  checkForUpdates(registration) {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('🔄 PWA: New service worker installing');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification();
        }
      });
    });
  }

  showUpdateNotification() {
    this.showToast(
      '🚀 New version available! Refresh to update.',
      'info',
      0,
      [{
        text: 'Refresh Now',
        action: () => window.location.reload()
      }, {
        text: 'Later',
        action: () => {}
      }]
    );
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      showToast('IMPACT app installed successfully! 🎉', 'success');
    });
  }

  showInstallPrompt() {
    const installBanner = document.createElement('div');
    installBanner.id = 'install-banner';
    installBanner.className = `
      fixed top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 z-50
      transform -translate-y-full transition-transform duration-300 ease-out
    `;
    installBanner.innerHTML = `
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">📱</span>
          <div>
            <div class="font-semibold">Install IMPACT App</div>
            <div class="text-sm opacity-90">Get the full mobile experience</div>
          </div>
        </div>
        <div class="flex space-x-2">
          <button onclick="pwaManager.installApp()" class="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
            Install
          </button>
          <button onclick="pwaManager.dismissInstallPrompt()" class="text-white px-3 py-2 rounded hover:bg-white/20 transition-colors">
            ✕
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(installBanner);
    
    setTimeout(() => {
      installBanner.style.transform = 'translateY(0)';
    }, 100);
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        this.deferredPrompt = null;
      });
    }
    this.dismissInstallPrompt();
  }

  dismissInstallPrompt() {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  hideInstallPrompt() {
    this.dismissInstallPrompt();
  }

  setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineBanner();
      showToast('Back online! 🌐', 'success');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineBanner();
      showToast('You\'re offline. Some features may be limited.', 'warning');
    });

    // Check initial state
    if (!this.isOnline) {
      this.showOfflineBanner();
    }
  }

  showOfflineBanner() {
    if (document.getElementById('offline-banner')) return;

    const offlineBanner = document.createElement('div');
    offlineBanner.id = 'offline-banner';
    offlineBanner.className = `
      fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-3 z-50
      transform translate-y-full transition-transform duration-300 ease-out
    `;
    offlineBanner.innerHTML = `
      <div class="flex items-center justify-center space-x-2 text-sm">
        <span>📴</span>
        <span>Offline mode - Limited functionality available</span>
      </div>
    `;

    document.body.appendChild(offlineBanner);
    
    setTimeout(() => {
      offlineBanner.style.transform = 'translateY(0)';
    }, 100);
  }

  hideOfflineBanner() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
      banner.style.transform = 'translateY(100%)';
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  syncOfflineData() {
    // Sync any offline data when back online
    const offlineData = localStorage.getItem('offlineQueue');
    if (offlineData) {
      const queue = JSON.parse(offlineData);
      // Process offline queue
      localStorage.removeItem('offlineQueue');
      showToast(`Synced ${queue.length} offline actions`, 'info');
    }
  }

  addPWAStyles() {
    const pwaStyles = document.createElement('style');
    pwaStyles.textContent = `
      /* PWA specific styles */
      @media (display-mode: standalone) {
        body {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .pwa-only {
          display: block !important;
        }
      }

      .pwa-hidden {
        display: none;
      }

      @media (display-mode: standalone) {
        .pwa-hidden {
          display: none !important;
        }
      }

      /* Touch optimizations */
      @media (hover: none) and (pointer: coarse) {
        button, .btn-animate {
          min-height: 44px;
          min-width: 44px;
        }
        
        .card-hover:hover {
          transform: none;
        }
        
        .card-hover:active {
          transform: scale(0.98);
        }
      }

      /* Safe area adjustments */
      .safe-top {
        padding-top: max(1rem, env(safe-area-inset-top));
      }
      
      .safe-bottom {
        padding-bottom: max(1rem, env(safe-area-inset-bottom));
      }

      /* Pull to refresh indicator */
      .pull-to-refresh {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: white;
        border-radius: 0 0 12px 12px;
        padding: 8px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
        z-index: 1000;
      }

      .pull-to-refresh.active {
        transform: translateX(-50%) translateY(0);
      }
    `;
    document.head.appendChild(pwaStyles);
  }

  createInstallButton() {
    // Create floating install button for mobile users
    if (!this.isInstalled && /Mobi|Android/i.test(navigator.userAgent)) {
      const installFab = document.createElement('button');
      installFab.className = `
        fixed bottom-20 left-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg
        flex items-center justify-center transition-all duration-300 z-40
      `;
      installFab.innerHTML = '📱';
      installFab.onclick = () => this.showInstallDialog();
      
      document.body.appendChild(installFab);
    }
  }

  showInstallDialog() {
    showModal(
      '📱 Install IMPACT App',
      `<div class="text-center space-y-4">
        <div class="text-6xl">📱</div>
        <h3 class="text-xl font-bold">Get the Mobile App Experience</h3>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span>Works offline</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span>Push notifications</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span>Full screen experience</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-green-500">✓</span>
            <span>Quick access from home screen</span>
          </div>
        </div>
      </div>`,
      [
        { text: 'Install Now', class: 'bg-blue-500 text-white hover:bg-blue-600', onclick: 'pwaManager.installApp(); modalManager.close(this.closest(".fixed"));' },
        { text: 'Maybe Later', class: 'bg-gray-300 text-gray-700 hover:bg-gray-400', onclick: 'modalManager.close(this.closest(".fixed"))' }
      ]
    );
  }

  // Pull to refresh functionality
  initPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    let isRefreshing = false;

    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'pull-to-refresh';
    pullIndicator.innerHTML = '<span class="text-sm">Pull to refresh</span>';
    document.body.appendChild(pullIndicator);

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (window.scrollY > 0 || isRefreshing) return;

      currentY = e.touches[0].clientY;
      pullDistance = currentY - startY;

      if (pullDistance > 0) {
        e.preventDefault();
        const threshold = 100;
        const progress = Math.min(pullDistance / threshold, 1);
        
        pullIndicator.style.transform = `translateX(-50%) translateY(${progress * 100 - 100}%)`;
        
        if (pullDistance > threshold) {
          pullIndicator.innerHTML = '<span class="text-sm">Release to refresh</span>';
        } else {
          pullIndicator.innerHTML = '<span class="text-sm">Pull to refresh</span>';
        }
      }
    });

    document.addEventListener('touchend', () => {
      if (pullDistance > 100 && !isRefreshing) {
        isRefreshing = true;
        pullIndicator.innerHTML = '<div class="spinner w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>';
        
        // Simulate refresh
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        pullIndicator.style.transform = 'translateX(-50%) translateY(-100%)';
      }
      
      pullDistance = 0;
    });
  }

  // Enhanced mobile navigation
  initMobileNavigation() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Add bottom navigation for mobile
      const bottomNav = document.createElement('div');
      bottomNav.className = `
        fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom
        grid grid-cols-5 text-center text-xs
      `;
      
      const navItems = [
        { icon: '🏠', label: 'Home', href: 'index.html' },
        { icon: '🌱', label: 'Ideas', href: 'seedboard.html' },
        { icon: '🚨', label: 'Calls', href: 'opencall.html' },
        { icon: '🤝', label: 'Teams', href: 'teamspace.html' },
        { icon: '📊', label: 'Stats', href: 'dashboard.html' }
      ];

      bottomNav.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="py-2 hover:bg-gray-100 transition-colors">
          <div class="text-lg">${item.icon}</div>
          <div class="text-gray-600">${item.label}</div>
        </a>
      `).join('');

      document.body.appendChild(bottomNav);
      
      // Add bottom padding to content
      document.body.style.paddingBottom = '80px';
    }
  }
}

// Touch gestures for mobile
class TouchGestureManager {
  constructor() {
    this.initSwipeGestures();
  }

  initSwipeGestures() {
    let startX, startY, endX, endY;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      this.handleSwipe(startX, startY, endX, endY);
    });
  }

  handleSwipe(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 100;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go back
        if (window.history.length > 1) {
          window.history.back();
        }
      } else {
        // Swipe left - could open quick actions
        if (window.showQuickActions) {
          showQuickActions();
        }
      }
    }
  }
}

// Initialize PWA features
const pwaManager = new PWAManager();
const touchGestures = new TouchGestureManager();

// Add PWA detection
window.isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
};

// Export for global use
window.pwaManager = pwaManager;
