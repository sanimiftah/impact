// Toast Notification System for IMPACT Platform
class ToastManager {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'info', duration = 4000) {
    const toast = this.createToast(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('opacity-100', 'translate-x-0');
      toast.classList.remove('opacity-0', 'translate-x-full');
    }, 10);

    // Auto remove
    setTimeout(() => {
      this.remove(toast);
    }, duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `
      toast opacity-0 translate-x-full transform transition-all duration-300 ease-out
      max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5
      overflow-hidden
    `;

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="p-4 ${colors[type]} border-l-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-lg">${icons[type]}</span>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium">${message}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none" onclick="toastManager.remove(this.closest('.toast'))">
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    return toast;
  }

  remove(toast) {
    toast.classList.add('opacity-0', 'translate-x-full');
    toast.classList.remove('opacity-100', 'translate-x-0');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }

  success(message) {
    return this.show(message, 'success');
  }

  error(message) {
    return this.show(message, 'error');
  }

  warning(message) {
    return this.show(message, 'warning');
  }

  info(message) {
    return this.show(message, 'info');
  }
}

// Loading Spinner Component
class LoadingManager {
  constructor() {
    this.overlay = null;
  }

  show(message = 'Loading...') {
    this.hide(); // Remove any existing overlay
    
    this.overlay = document.createElement('div');
    this.overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    this.overlay.innerHTML = `
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-2xl">
        <div class="spinner w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full"></div>
        <span class="text-gray-700 font-medium">${message}</span>
      </div>
    `;
    
    document.body.appendChild(this.overlay);
    
    // Animate in
    setTimeout(() => {
      this.overlay.classList.add('opacity-100');
    }, 10);
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.add('opacity-0');
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
      }, 300);
    }
  }
}

// Modal Manager
class ModalManager {
  constructor() {
    this.modals = [];
  }

  create(title, content, actions = []) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
    
    const actionsHTML = actions.map(action => 
      `<button class="btn-animate px-4 py-2 rounded ${action.class || 'bg-blue-500 text-white hover:bg-blue-600'}" onclick="${action.onclick}">${action.text}</button>`
    ).join('');

    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform scale-95 transition-transform duration-300">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            <button class="text-gray-400 hover:text-gray-600" onclick="modalManager.close(this.closest('.fixed'))">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mb-6">${content}</div>
          <div class="flex justify-end space-x-3">
            ${actionsHTML}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modals.push(modal);

    // Animate in
    setTimeout(() => {
      modal.classList.add('opacity-100');
      modal.querySelector('.bg-white').classList.add('scale-100');
      modal.querySelector('.bg-white').classList.remove('scale-95');
    }, 10);

    return modal;
  }

  close(modal) {
    modal.classList.add('opacity-0');
    modal.querySelector('.bg-white').classList.add('scale-95');
    modal.querySelector('.bg-white').classList.remove('scale-100');
    
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      this.modals = this.modals.filter(m => m !== modal);
    }, 300);
  }

  confirm(title, message, onConfirm) {
    return this.create(title, `<p>${message}</p>`, [
      {
        text: 'Cancel',
        class: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
        onclick: 'modalManager.close(this.closest(".fixed"))'
      },
      {
        text: 'Confirm',
        class: 'bg-red-500 text-white hover:bg-red-600',
        onclick: `(${onConfirm.toString()})(); modalManager.close(this.closest(".fixed"));`
      }
    ]);
  }
}

// Animation Utilities
class AnimationUtils {
  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  static slideIn(element, direction = 'up', duration = 300) {
    const transforms = {
      up: 'translateY(20px)',
      down: 'translateY(-20px)',
      left: 'translateX(20px)',
      right: 'translateX(-20px)'
    };

    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    setTimeout(() => {
      element.style.transform = 'translate(0)';
      element.style.opacity = '1';
    }, 10);
  }

  static staggerChildren(container, delay = 100) {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * delay);
    });
  }
}

// Progress Indicator
class ProgressIndicator {
  constructor(container, steps) {
    this.container = container;
    this.steps = steps;
    this.currentStep = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="flex items-center justify-between mb-8">
        ${this.steps.map((step, index) => `
          <div class="flex items-center ${index < this.steps.length - 1 ? 'flex-1' : ''}">
            <div class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
              index <= this.currentStep 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }">
              ${index < this.currentStep ? '✓' : index + 1}
            </div>
            <span class="ml-2 text-sm font-medium ${
              index <= this.currentStep ? 'text-blue-600' : 'text-gray-500'
            }">${step}</span>
            ${index < this.steps.length - 1 ? `
              <div class="flex-1 mx-4 h-1 rounded-full ${
                index < this.currentStep ? 'bg-blue-600' : 'bg-gray-200'
              } transition-all duration-300"></div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  }

  previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  goTo(step) {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
      this.render();
    }
  }
}

// Initialize global managers
const toastManager = new ToastManager();
const loadingManager = new LoadingManager();
const modalManager = new ModalManager();

// Global utility functions
window.showToast = (message, type) => toastManager.show(message, type);
window.showLoading = (message) => loadingManager.show(message);
window.hideLoading = () => loadingManager.hide();
window.showModal = (title, content, actions) => modalManager.create(title, content, actions);
window.confirmAction = (title, message, callback) => modalManager.confirm(title, message, callback);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to existing elements
  const cards = document.querySelectorAll('.bg-white.rounded-lg, .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50');
  cards.forEach(card => {
    card.classList.add('card-hover');
  });

  const buttons = document.querySelectorAll('button, .btn, [type="submit"]');
  buttons.forEach(button => {
    button.classList.add('btn-animate');
  });

  // Stagger animate elements on page load
  const animateElements = document.querySelectorAll('.space-y-4 > div, .grid > div');
  if (animateElements.length > 0) {
    animateElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
});
