/**
 * Accessibility utilities for Shopify Polaris compliance
 * Ensures proper ARIA attributes, keyboard navigation, and screen reader support
 */

// Generate unique IDs for form elements and ARIA relationships
export const generateId = (prefix = 'badgr') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate color contrast ratios for accessibility
export const validateColorContrast = (foreground, background) => {
  // Simple contrast ratio validation
  // In a real implementation, you would use a proper color contrast library
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
};

// Calculate contrast ratio between two colors
const calculateContrastRatio = (color1, color2) => {
  // Simplified calculation - in practice, use a proper library
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Get relative luminance of a color (simplified)
const getRelativeLuminance = (color) => {
  // This is a simplified version - use a proper color library in production
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle Enter and Space key presses for custom interactive elements
  handleActivation: (callback) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(event);
    }
  },
  
  // Handle arrow key navigation in lists
  handleArrowKeys: (currentIndex, totalItems, callback) => (event) => {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        break;
      case 'ArrowDown':
        newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = totalItems - 1;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    callback(newIndex);
  }
};

// ARIA attributes helpers
export const ariaAttributes = {
  // Create proper ARIA attributes for form fields
  formField: (id, label, error = null, required = false) => ({
    id,
    'aria-label': label,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
  }),
  
  // Create ARIA attributes for buttons
  button: (pressed = null, expanded = null, controls = null) => ({
    'aria-pressed': pressed !== null ? pressed : undefined,
    'aria-expanded': expanded !== null ? expanded : undefined,
    'aria-controls': controls,
  }),
  
  // Create ARIA attributes for lists
  list: (size) => ({
    'aria-label': `List with ${size} items`,
    role: 'list',
  }),
  
  // Create ARIA attributes for list items
  listItem: (index, total) => ({
    'aria-posinset': index + 1,
    'aria-setsize': total,
    role: 'listitem',
  }),
  
  // Create ARIA attributes for tabs
  tab: (id, panelId, selected = false) => ({
    id,
    'aria-controls': panelId,
    'aria-selected': selected,
    role: 'tab',
    tabIndex: selected ? 0 : -1,
  }),
  
  // Create ARIA attributes for tab panels
  tabPanel: (id, tabId) => ({
    id,
    'aria-labelledby': tabId,
    role: 'tabpanel',
  }),
};

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after it's been read
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const focusManagement = {
  // Trap focus within a modal or dialog
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            event.preventDefault();
          }
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },
  
  // Set focus to first focusable element in container
  focusFirst: (container) => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) {
      focusable.focus();
    }
  },
  
  // Restore focus to previously focused element
  restoreFocus: (element) => {
    if (element && element.focus) {
      element.focus();
    }
  },
};

// Validation helpers for forms
export const validation = {
  // Validate required fields
  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },
  
  // Validate email format
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  // Validate file types
  fileType: (file, allowedTypes) => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
  
  // Validate file size
  fileSize: (file, maxSize) => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`;
    }
    return null;
  },
};

// Error handling utilities
export const errorHandling = {
  // Format error messages for display
  formatError: (error, fieldName) => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && error.message) {
      return error.message;
    }
    
    return `An error occurred with ${fieldName}`;
  },
  
  // Create error ID for ARIA association
  createErrorId: (fieldId) => `${fieldId}-error`,
  
  // Create help text ID for ARIA association
  createHelpId: (fieldId) => `${fieldId}-help`,
};

// Responsive utilities
export const responsive = {
  // Check if device is touch-enabled
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Get current breakpoint
  getBreakpoint: () => {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },
};

// Export all utilities
export default {
  generateId,
  validateColorContrast,
  keyboardNavigation,
  ariaAttributes,
  announceToScreenReader,
  focusManagement,
  validation,
  errorHandling,
  responsive,
}; 