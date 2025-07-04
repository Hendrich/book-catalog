/**
 * Notification Manager
 * Handles all user notifications with proper styling and behavior
 */

class NotificationManager {
  constructor() {
    this.container = this.createContainer();
    this.notifications = new Map();
    this.nextId = 1;

    document.body.appendChild(this.container);
    this.addStyles();
  }

  createContainer() {
    const container = document.createElement("div");
    container.className = "notification-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-label", "Notifications");
    return container;
  }

  addStyles() {
    if (document.getElementById("notification-styles")) return;

    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        max-width: 400px;
      }
      
      .notification {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        margin-bottom: 12px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification.hide {
        transform: translateX(100%);
        opacity: 0;
      }
      
      .notification::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: rgba(255, 255, 255, 0.3);
      }
      
      .notification-success {
        background: linear-gradient(135deg, #10b981, #059669);
      }
      
      .notification-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
      }
      
      .notification-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }
      
      .notification-info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }
      
      .notification-icon {
        margin-right: 12px;
        font-size: 18px;
        flex-shrink: 0;
      }
      
      .notification-content {
        flex: 1;
      }
      
      .notification-title {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .notification-message {
        opacity: 0.9;
      }
      
      .notification-close {
        margin-left: 12px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.7;
        transition: opacity 0.2s;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .notification-close:hover {
        opacity: 1;
      }
      
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        transition: width linear;
      }
      
      @media (max-width: 640px) {
        .notification-container {
          left: 20px;
          right: 20px;
          top: 10px;
          max-width: none;
        }
        
        .notification {
          transform: translateY(-100%);
        }
        
        .notification.show {
          transform: translateY(0);
        }
        
        .notification.hide {
          transform: translateY(-100%);
        }
      }
    `;

    document.head.appendChild(styles);
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons.info;
  }

  show(message, type = "info", options = {}) {
    const {
      title = null,
      duration = 5000,
      persistent = false,
      onClick = null,
    } = options;

    const id = this.nextId++;
    const notification = this.createNotification(
      id,
      message,
      type,
      title,
      persistent,
      onClick
    );

    this.container.appendChild(notification);
    this.notifications.set(id, { element: notification, timer: null });

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Auto-remove unless persistent
    if (!persistent && duration > 0) {
      this.startAutoRemove(id, duration);
    }

    return id;
  }

  createNotification(id, message, type, title, persistent, onClick) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("data-id", id);

    const icon = this.getIcon(type);

    let content = `
      <div class="notification-icon">${icon}</div>
      <div class="notification-content">
        ${
          title
            ? `<div class="notification-title">${this.escapeHtml(title)}</div>`
            : ""
        }
        <div class="notification-message">${this.escapeHtml(message)}</div>
      </div>
    `;

    if (!persistent) {
      content += `
        <button class="notification-close" type="button" aria-label="Close notification">
          ×
        </button>
      `;
    }

    notification.innerHTML = content;

    // Add click handlers
    if (onClick) {
      notification.style.cursor = "pointer";
      notification.addEventListener("click", (e) => {
        if (!e.target.classList.contains("notification-close")) {
          onClick();
        }
      });
    }

    // Add close button handler
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.remove(id);
      });
    }

    return notification;
  }

  startAutoRemove(id, duration) {
    const notificationData = this.notifications.get(id);
    if (!notificationData) return;

    // Add progress bar
    const notification = notificationData.element;
    const progressBar = document.createElement("div");
    progressBar.className = "notification-progress";
    progressBar.style.width = "100%";
    notification.appendChild(progressBar);

    // Animate progress bar
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${duration}ms linear`;
      progressBar.style.width = "0%";
    });

    // Set removal timer
    notificationData.timer = setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id) {
    const notificationData = this.notifications.get(id);
    if (!notificationData) return;

    const { element, timer } = notificationData;

    // Clear timer
    if (timer) {
      clearTimeout(timer);
    }

    // Animate out
    element.classList.add("hide");

    // Remove from DOM after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.notifications.delete(id);
    }, 300);
  }

  removeAll() {
    this.notifications.forEach((_, id) => {
      this.remove(id);
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Convenience methods
  success(message, options = {}) {
    return this.show(message, "success", options);
  }

  error(message, options = {}) {
    return this.show(message, "error", { duration: 8000, ...options });
  }

  warning(message, options = {}) {
    return this.show(message, "warning", { duration: 6000, ...options });
  }

  info(message, options = {}) {
    return this.show(message, "info", options);
  }
}

// Create global instance
const notificationManager = new NotificationManager();

// Make it available globally for legacy code
window.showNotification = (message, type = "info") => {
  return notificationManager.show(message, type);
};

export default notificationManager;
