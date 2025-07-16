/**
 * BADGR BNPL Widget JavaScript
 * Theme App Extension script for Shopify stores
 * 
 * This script provides a complete BNPL (Buy Now Pay Later) widget implementation
 * that integrates with Shopify themes and the BADGR backend API.
 * 
 * Features:
 * - Dynamic configuration loading from API
 * - Cross-browser compatibility with graceful degradation
 * - Intelligent placement handling for different themes
 * - Comprehensive BNPL provider support
 * - Analytics tracking and error handling
 * - Accessibility compliance with WCAG standards
 * 
 * @version 1.3.0
 * @author BADGR Team
 * @license MIT
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
    
    // Browser detection and compatibility
    this.browserInfo = this.detectBrowser();
    this.applyBrowserCompatibility();
    
    this.init();
  }

  getEnabledProviders() {
    const providersStr = this.element.querySelector('.badgr-bnpl-options')?.dataset.enabledProviders;
    return providersStr ? providersStr.split(',').map(p => p.trim()).filter(Boolean) : [];
  }

  parseEnabledProviders(providers) {
    if (!providers) return null;
    
    if (Array.isArray(providers)) {
      return providers.filter(Boolean);
    }
    
    if (typeof providers === 'string') {
      return providers.split(',').map(p => p.trim()).filter(Boolean);
    }
    
    return null;
  }

  getApiBaseUrl() {
    // Try to get API URL from app settings or fall back to default
    const shopDomain = window.Shopify?.shop || window.location.hostname;
    
    // Check for configured API URL first
    if (window.BADGR_API_URL) {
      return window.BADGR_API_URL;
    }
    
    // Development/staging environment detection
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('ngrok')) {
      return 'http://localhost:3000/api';
    }
    
    // Production environment - use app proxy URL
    return `https://${shopDomain}/apps/badgr/api`;
  }

  detectBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    const browser = {
      name: 'unknown',
      version: 'unknown',
      isIE: false,
      isEdge: false,
      isChrome: false,
      isFirefox: false,
      isSafari: false,
      isMobile: false
    };

    // Internet Explorer
    if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
      browser.name = 'ie';
      browser.isIE = true;
      const version = userAgent.match(/(?:msie |rv:)(\d+(\.\d+)?)/i);
      browser.version = version ? version[1] : 'unknown';
    }
    // Edge
    else if (userAgent.indexOf('edge') !== -1 || userAgent.indexOf('edg') !== -1) {
      browser.name = 'edge';
      browser.isEdge = true;
      const version = userAgent.match(/edge?\/(\d+(\.\d+)?)/i);
      browser.version = version ? version[1] : 'unknown';
    }
    // Chrome
    else if (userAgent.indexOf('chrome') !== -1) {
      browser.name = 'chrome';
      browser.isChrome = true;
      const version = userAgent.match(/chrome\/(\d+(\.\d+)?)/i);
      browser.version = version ? version[1] : 'unknown';
    }
    // Firefox
    else if (userAgent.indexOf('firefox') !== -1) {
      browser.name = 'firefox';
      browser.isFirefox = true;
      const version = userAgent.match(/firefox\/(\d+(\.\d+)?)/i);
      browser.version = version ? version[1] : 'unknown';
    }
    // Safari
    else if (userAgent.indexOf('safari') !== -1) {
      browser.name = 'safari';
      browser.isSafari = true;
      const version = userAgent.match(/version\/(\d+(\.\d+)?)/i);
      browser.version = version ? version[1] : 'unknown';
    }

    // Mobile detection
    browser.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    return browser;
  }

  applyBrowserCompatibility() {
    // Add browser-specific CSS classes
    this.element.classList.add(`badgr-browser-${this.browserInfo.name}`);
    
    if (this.browserInfo.isMobile) {
      this.element.classList.add('badgr-mobile');
    }

    // IE compatibility fixes
    if (this.browserInfo.isIE) {
      this.element.classList.add('badgr-ie');
      console.warn('BADGR Widget: Internet Explorer detected. Some features may not work properly.');
    }

    // Safari-specific fixes
    if (this.browserInfo.isSafari) {
      this.element.classList.add('badgr-safari');
    }

    // Firefox-specific fixes
    if (this.browserInfo.isFirefox) {
      this.element.classList.add('badgr-firefox');
    }

    console.log('Browser compatibility applied:', this.browserInfo);
  }

  supportsFetch() {
    return typeof fetch !== 'undefined' && typeof Promise !== 'undefined';
  }

  supportsAsyncAwait() {
    try {
      return (async () => {})().constructor === Promise;
    } catch (e) {
      return false;
    }
  }

  supportsES6() {
    try {
      return typeof Symbol !== 'undefined' && 
             typeof Array.from === 'function' &&
             typeof Object.assign === 'function';
    } catch (e) {
      return false;
    }
  }

  async init() {
    try {
      // First load widget configuration from API
      await this.loadWidgetConfiguration();
      
      // Handle widget placement
      this.handlePlacement();
      
      // Then load BNPL options
      await this.loadBNPLOptions();
    } catch (error) {
      console.error('BADGR Widget Error:', error);
      this.showError('Failed to load payment options');
    }
  }

  async loadWidgetConfiguration() {
    try {
      const shopDomain = window.Shopify?.shop || window.location.hostname;
      
      if (!shopDomain) {
        console.warn('Shop domain not found, using default configuration');
        return;
      }
      
      // Check for fetch support
      if (!this.supportsFetch()) {
        console.warn('Fetch API not supported, using default configuration');
        return;
      }
      
      const response = await fetch(`${this.apiBaseUrl}/widgets/${shopDomain}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Shop-Domain': shopDomain
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const config = result.data;
        
        // Merge API configuration with template settings
        if (config) {
                     this.widgetConfig = {
             widget_enabled: config.widget_enabled !== false,
             bnpl_enabled: config.bnpl_enabled !== false,
             logo_selection: config.logo_selection || 'default',
             widget_placement: config.widget_placement || this.placement,
             custom_settings: config.custom_settings || {},
             // Override enabled providers from API if available
             enabled_providers: this.parseEnabledProviders(config.custom_settings?.enabled_providers) || this.enabledProviders,
             show_logos: config.custom_settings?.show_logos !== false && this.showLogos
           };
          
                     // Update instance properties with API configuration
           this.enabledProviders = Array.isArray(this.widgetConfig.enabled_providers) 
             ? this.widgetConfig.enabled_providers 
             : this.enabledProviders;
           this.showLogos = this.widgetConfig.show_logos;
           this.placement = this.widgetConfig.widget_placement;
           
           console.log('Widget configuration loaded:', {
             widget_enabled: this.widgetConfig.widget_enabled,
             bnpl_enabled: this.widgetConfig.bnpl_enabled,
             enabled_providers: this.enabledProviders,
             show_logos: this.showLogos,
             placement: this.placement
           });
          
          // If widget is disabled, hide it
          if (!this.widgetConfig.widget_enabled) {
            this.element.style.display = 'none';
            return;
          }
        }
      } else {
        console.warn('Failed to load widget configuration, using template settings');
      }
    } catch (error) {
      console.warn('Error loading widget configuration:', error);
      // Continue with template settings if API fails
    }
  }

  handlePlacement() {
    // Add placement-specific CSS class
    this.element.classList.add(`badgr-placement-${this.placement}`);
    
    // Handle dynamic positioning based on placement
    switch (this.placement) {
      case 'above_price':
        this.positionAbovePrice();
        break;
      case 'below_price':
        this.positionBelowPrice();
        break;
      case 'below_add_to_cart':
        this.positionBelowAddToCart();
        break;
      case 'custom':
        this.positionCustom();
        break;
      default:
        this.positionBelowPrice(); // Default fallback
    }
  }

  positionAbovePrice() {
    const priceElement = this.findPriceElement();
    if (priceElement) {
      this.repositionWidget(priceElement, 'before');
    }
  }

  positionBelowPrice() {
    const priceElement = this.findPriceElement();
    if (priceElement) {
      this.repositionWidget(priceElement, 'after');
    }
  }

  positionBelowAddToCart() {
    const addToCartButton = this.findAddToCartButton();
    if (addToCartButton) {
      this.repositionWidget(addToCartButton, 'after');
    } else {
      // Fallback to below price if add to cart button not found
      this.positionBelowPrice();
    }
  }

  positionCustom() {
    // For custom position, keep widget where it was placed in the template
    // This allows merchants to place the widget block manually
    console.log('Widget using custom placement - no automatic repositioning');
  }

  findPriceElement() {
    // Try multiple selectors to find the price element
    const priceSelectors = [
      // Dawn theme
      '.price__container', '.price__regular', '.price__sale',
      // Debut theme
      '.product-single__price', '.price-item',
      // Generic selectors
      '.price', '.product-price', '.price-area', '.price-wrapper',
      '[data-price]', '.money', '.product__price',
      '.price-container', '.price-box', '.product-price-area',
      // Common theme patterns
      '.product-price__amount', '.current-price', '.regular-price',
      '.product-single__price-container', '.price-section'
    ];
    
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element && this.isVisibleElement(element)) {
        return element;
      }
    }
    
    console.warn('Price element not found for placement');
    return null;
  }

  findAddToCartButton() {
    // Try multiple selectors to find the add to cart button
    const buttonSelectors = [
      // Dawn theme
      '.product-form__buttons .btn', '.product-form__cart-submit',
      // Debut theme
      '.product-single__cart-submit', '.btn--add-to-cart',
      // Generic selectors
      '[name="add"]', '.btn-addtocart', '.add-to-cart', '.addtocart',
      '.product-form__buttons button', '.shopify-payment-button',
      '.btn-cart', '.add-cart-btn', '.product-form button[type="submit"]',
      // Common patterns
      '.add-to-cart-button', '.atc-button', '.cart-button',
      '.product-add-to-cart'
    ];
    
    for (const selector of buttonSelectors) {
      const element = document.querySelector(selector);
      if (element && this.isVisibleElement(element)) {
        const text = element.textContent.toLowerCase();
        if (text.includes('add') || text.includes('cart') || element.getAttribute('name') === 'add') {
          return element;
        }
      }
    }
    
    console.warn('Add to cart button not found for placement');
    return null;
  }

  isVisibleElement(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
  }

  repositionWidget(targetElement, position) {
    if (!targetElement) return;
    
    // Check if widget has already been repositioned
    if (this.element.dataset.repositioned === 'true') {
      console.log('Widget already repositioned, skipping');
      return;
    }
    
    try {
      const parent = targetElement.parentNode;
      
      if (position === 'before') {
        parent.insertBefore(this.element, targetElement);
      } else if (position === 'after') {
        // Insert after the target element
        if (targetElement.nextSibling) {
          parent.insertBefore(this.element, targetElement.nextSibling);
        } else {
          parent.appendChild(this.element);
        }
      }
      
      // Mark as repositioned
      this.element.dataset.repositioned = 'true';
      
      console.log(`Widget repositioned ${position} element:`, targetElement);
    } catch (error) {
      console.error('Error repositioning widget:', error);
    }
  }

  async loadBNPLOptions() {
    const optionsContainer = this.element.querySelector('.badgr-bnpl-options');
    
    if (!optionsContainer) {
      throw new Error('BNPL options container not found');
    }

    // Check for fetch support
    if (!this.supportsFetch()) {
      this.showError('Browser not supported');
      return;
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
      if (this.apiBaseUrl && this.supportsFetch()) {
        fetch(`${this.apiBaseUrl}/widgets/track`, {
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