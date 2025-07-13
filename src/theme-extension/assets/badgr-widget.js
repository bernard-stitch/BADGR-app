/**
 * BADGR BNPL Widget JavaScript
 * Theme App Extension script for Shopify stores
 */

class BADGRWidget {
  constructor(element) {
    this.element = element;
    this.productId = element.dataset.productId;
    this.productPrice = parseFloat(element.dataset.productPrice);
    this.productCurrency = element.dataset.productCurrency || 'USD';
    this.widgetId = element.dataset.widgetId || 'default';
    this.placement = element.dataset.placement || 'below_price';
    this.showLogos = element.dataset.showLogos !== 'false';
    this.enabledProviders = this.getEnabledProviders();
    this.apiBaseUrl = this.getApiBaseUrl();
    
    this.init();
  }

  getEnabledProviders() {
    const providersStr = this.element.querySelector('.badgr-bnpl-options')?.dataset.enabledProviders;
    return providersStr ? providersStr.split(',').map(p => p.trim()).filter(Boolean) : [];
  }

  getApiBaseUrl() {
    // Try to get API URL from app settings or fall back to default
    const shopDomain = window.Shopify?.shop || window.location.hostname;
    return window.BADGR_API_URL || `https://${shopDomain}/apps/badgr/api`;
  }

  async init() {
    try {
      await this.loadBNPLOptions();
    } catch (error) {
      console.error('BADGR Widget Error:', error);
      this.showError('Failed to load payment options');
    }
  }

  async loadBNPLOptions() {
    const optionsContainer = this.element.querySelector('.badgr-bnpl-options');
    
    if (!optionsContainer) {
      throw new Error('BNPL options container not found');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/widgets/${this.widgetId}/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Shop-Domain': window.Shopify?.shop || window.location.hostname
        },
        body: JSON.stringify({
          productId: this.productId,
          price: this.productPrice,
          currency: this.productCurrency,
          enabledProviders: this.enabledProviders,
          placement: this.placement
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      this.renderBNPLOptions(data.options || []);
      
    } catch (error) {
      console.error('Failed to fetch BNPL options:', error);
      this.showError('Unable to load payment options');
    }
  }

  renderBNPLOptions(options) {
    const optionsContainer = this.element.querySelector('.badgr-bnpl-options');
    
    if (!options || options.length === 0) {
      optionsContainer.innerHTML = '<div class="badgr-error">No payment options available for this product</div>';
      return;
    }

    const optionsHTML = options.map(option => this.createOptionHTML(option)).join('');
    optionsContainer.innerHTML = optionsHTML;
    
    // Add event listeners
    this.addEventListeners();
    
    // Track widget load
    this.trackEvent('widget_loaded', {
      productId: this.productId,
      optionsCount: options.length,
      providers: options.map(o => o.provider)
    });
  }

  createOptionHTML(option) {
    const {
      provider,
      displayName,
      logoUrl,
      installmentText,
      terms,
      isEligible,
      redirectUrl
    } = option;

    if (!isEligible) {
      return '';
    }

    const logoHTML = this.showLogos && logoUrl 
      ? `<img src="${logoUrl}" alt="${displayName}" class="badgr-bnpl-logo" loading="lazy">`
      : '';

    return `
      <div 
        class="badgr-bnpl-option" 
        data-provider="${provider}"
        data-redirect-url="${redirectUrl || '#'}"
        role="button"
        tabindex="0"
        aria-label="Pay with ${displayName}: ${installmentText}"
      >
        ${logoHTML}
        <div class="badgr-bnpl-text">
          <div class="badgr-bnpl-price">${installmentText}</div>
          ${terms ? `<div class="badgr-bnpl-terms">${terms}</div>` : ''}
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const options = this.element.querySelectorAll('.badgr-bnpl-option');
    
    options.forEach(option => {
      option.addEventListener('click', (e) => this.handleOptionClick(e));
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleOptionClick(e);
        }
      });
    });
  }

  handleOptionClick(event) {
    const option = event.currentTarget;
    const provider = option.dataset.provider;
    const redirectUrl = option.dataset.redirectUrl;
    
    // Track selection
    this.trackEvent('option_selected', {
      productId: this.productId,
      provider: provider,
      price: this.productPrice
    });

    // Visual feedback
    this.element.querySelectorAll('.badgr-bnpl-option').forEach(opt => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-selected', 'false');
    });
    
    option.classList.add('selected');
    option.setAttribute('aria-selected', 'true');

    // Handle redirect
    if (redirectUrl && redirectUrl !== '#') {
      // Small delay for visual feedback
      setTimeout(() => {
        if (redirectUrl.startsWith('http')) {
          window.open(redirectUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = redirectUrl;
        }
      }, 150);
    } else {
      console.warn(`No redirect URL for provider: ${provider}`);
    }
  }

  showError(message) {
    const optionsContainer = this.element.querySelector('.badgr-bnpl-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = `<div class="badgr-error">${message}</div>`;
    }
  }

  trackEvent(eventName, data = {}) {
    // Track events for analytics
    try {
      // Shopify Analytics
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track(`BADGR ${eventName}`, data);
      }

      // Google Analytics
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'BADGR_Widget',
          custom_map: data
        });
      }

      // Custom tracking endpoint
      if (this.apiBaseUrl) {
        fetch(`${this.apiBaseUrl}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        }).catch(err => console.warn('Tracking failed:', err));
      }
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  }
}

// Provider logos mapping (fallback if not served from API)
const PROVIDER_LOGOS = {
  klarna: '/apps/badgr/assets/klarna-logo.svg',
  afterpay: '/apps/badgr/assets/afterpay-logo.svg',
  affirm: '/apps/badgr/assets/affirm-logo.svg',
  sezzle: '/apps/badgr/assets/sezzle-logo.svg',
  zip: '/apps/badgr/assets/zip-logo.svg',
  paypal_credit: '/apps/badgr/assets/paypal-credit-logo.svg'
};

// Initialize widgets when DOM is loaded
function initBADGRWidgets() {
  const widgets = document.querySelectorAll('.badgr-bnpl-widget');
  
  widgets.forEach(widget => {
    try {
      new BADGRWidget(widget);
    } catch (error) {
      console.error('Failed to initialize BADGR widget:', error);
    }
  });
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBADGRWidgets);
} else {
  initBADGRWidgets();
}

// Re-initialize on Shopify section loads (for theme editor)
document.addEventListener('shopify:section:load', initBADGRWidgets);

// Export for manual initialization
window.BADGR = {
  initWidgets: initBADGRWidgets,
  Widget: BADGRWidget,
  version: '1.0.0'
}; 