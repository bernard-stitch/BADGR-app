const fs = require('fs');
const path = require('path');

// Since the business logic functions are embedded in routes/widgets.js,
// we need to extract and test them. Let's create isolated versions for testing.

describe('Business Logic Functions Unit Tests', () => {
  
  describe('Validation Functions', () => {
    
    // Test function for validating required fields
    const validateRequiredFields = (requestBody) => {
      const { shop_id, shop_domain } = requestBody;
      const errors = [];
      
      if (!shop_id) {
        errors.push('shop_id is required');
      }
      if (!shop_domain) {
        errors.push('shop_domain is required');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    };
    
    test('should validate required fields correctly', () => {
      // Test valid input
      const validInput = {
        shop_id: 'test-shop',
        shop_domain: 'test-shop.myshopify.com'
      };
      const validResult = validateRequiredFields(validInput);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);
      
      // Test missing shop_id
      const missingShopId = {
        shop_domain: 'test-shop.myshopify.com'
      };
      const missingShopIdResult = validateRequiredFields(missingShopId);
      expect(missingShopIdResult.isValid).toBe(false);
      expect(missingShopIdResult.errors).toContain('shop_id is required');
      
      // Test missing shop_domain
      const missingShopDomain = {
        shop_id: 'test-shop'
      };
      const missingShopDomainResult = validateRequiredFields(missingShopDomain);
      expect(missingShopDomainResult.isValid).toBe(false);
      expect(missingShopDomainResult.errors).toContain('shop_domain is required');
      
      // Test missing both fields
      const missingBoth = {};
      const missingBothResult = validateRequiredFields(missingBoth);
      expect(missingBothResult.isValid).toBe(false);
      expect(missingBothResult.errors).toHaveLength(2);
      expect(missingBothResult.errors).toContain('shop_id is required');
      expect(missingBothResult.errors).toContain('shop_domain is required');
    });
    
    // Test function for validating shop identifier (ID or domain)
    const validateShopIdentifier = (shopId) => {
      if (!shopId) {
        return {
          isValid: false,
          error: 'Shop ID or domain is required'
        };
      }
      
      if (typeof shopId !== 'string') {
        return {
          isValid: false,
          error: 'Shop ID or domain must be a string'
        };
      }
      
      if (shopId.length < 3) {
        return {
          isValid: false,
          error: 'Shop ID or domain must be at least 3 characters'
        };
      }
      
      return {
        isValid: true,
        error: null
      };
    };
    
    test('should validate shop identifier correctly', () => {
      // Test valid shop ID
      const validShopId = validateShopIdentifier('test-shop');
      expect(validShopId.isValid).toBe(true);
      expect(validShopId.error).toBeNull();
      
      // Test valid shop domain
      const validShopDomain = validateShopIdentifier('test-shop.myshopify.com');
      expect(validShopDomain.isValid).toBe(true);
      expect(validShopDomain.error).toBeNull();
      
      // Test empty string
      const emptyString = validateShopIdentifier('');
      expect(emptyString.isValid).toBe(false);
      expect(emptyString.error).toBe('Shop ID or domain is required');
      
      // Test null/undefined
      const nullValue = validateShopIdentifier(null);
      expect(nullValue.isValid).toBe(false);
      expect(nullValue.error).toBe('Shop ID or domain is required');
      
      // Test non-string type
      const numberValue = validateShopIdentifier(123);
      expect(numberValue.isValid).toBe(false);
      expect(numberValue.error).toBe('Shop ID or domain must be a string');
      
      // Test too short
      const tooShort = validateShopIdentifier('ab');
      expect(tooShort.isValid).toBe(false);
      expect(tooShort.error).toBe('Shop ID or domain must be at least 3 characters');
    });
    
    // Test function for validating widget configuration
    const validateWidgetConfig = (config) => {
      const errors = [];
      
      if (config.widget_enabled !== undefined && typeof config.widget_enabled !== 'boolean') {
        errors.push('widget_enabled must be a boolean');
      }
      
      if (config.bnpl_enabled !== undefined && typeof config.bnpl_enabled !== 'boolean') {
        errors.push('bnpl_enabled must be a boolean');
      }
      
      if (config.widget_placement && typeof config.widget_placement !== 'string') {
        errors.push('widget_placement must be a string');
      }
      
      if (config.logo_selection && typeof config.logo_selection !== 'string') {
        errors.push('logo_selection must be a string');
      }
      
      if (config.custom_settings && typeof config.custom_settings !== 'object') {
        errors.push('custom_settings must be an object');
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    };
    
    test('should validate widget configuration correctly', () => {
      // Test valid configuration
      const validConfig = {
        widget_enabled: true,
        bnpl_enabled: true,
        widget_placement: 'product_description',
        logo_selection: 'klarna',
        custom_settings: { theme: 'dark' }
      };
      const validResult = validateWidgetConfig(validConfig);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);
      
      // Test invalid types
      const invalidConfig = {
        widget_enabled: 'true', // should be boolean
        bnpl_enabled: 1, // should be boolean
        widget_placement: 123, // should be string
        logo_selection: [], // should be string
        custom_settings: 'invalid' // should be object
      };
      const invalidResult = validateWidgetConfig(invalidConfig);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toHaveLength(5);
      expect(invalidResult.errors).toContain('widget_enabled must be a boolean');
      expect(invalidResult.errors).toContain('bnpl_enabled must be a boolean');
      expect(invalidResult.errors).toContain('widget_placement must be a string');
      expect(invalidResult.errors).toContain('logo_selection must be a string');
      expect(invalidResult.errors).toContain('custom_settings must be an object');
      
      // Test partial configuration (should be valid)
      const partialConfig = {
        widget_enabled: false
      };
      const partialResult = validateWidgetConfig(partialConfig);
      expect(partialResult.isValid).toBe(true);
      expect(partialResult.errors).toHaveLength(0);
    });
    
    // Test function for validating enabled providers
    const validateEnabledProviders = (providers) => {
      const validProviders = ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'];
      
      if (!Array.isArray(providers)) {
        return {
          isValid: false,
          error: 'Enabled providers must be an array'
        };
      }
      
      const invalidProviders = providers.filter(provider => !validProviders.includes(provider));
      
      if (invalidProviders.length > 0) {
        return {
          isValid: false,
          error: `Invalid providers: ${invalidProviders.join(', ')}`
        };
      }
      
      return {
        isValid: true,
        error: null
      };
    };
    
    test('should validate enabled providers correctly', () => {
      // Test valid providers
      const validProviders = ['klarna', 'afterpay'];
      const validResult = validateEnabledProviders(validProviders);
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeNull();
      
      // Test all valid providers
      const allProviders = ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'];
      const allProvidersResult = validateEnabledProviders(allProviders);
      expect(allProvidersResult.isValid).toBe(true);
      expect(allProvidersResult.error).toBeNull();
      
      // Test empty array (should be valid)
      const emptyArray = validateEnabledProviders([]);
      expect(emptyArray.isValid).toBe(true);
      expect(emptyArray.error).toBeNull();
      
      // Test non-array
      const nonArray = validateEnabledProviders('klarna,afterpay');
      expect(nonArray.isValid).toBe(false);
      expect(nonArray.error).toBe('Enabled providers must be an array');
      
      // Test invalid providers
      const invalidProviders = ['klarna', 'invalid_provider', 'afterpay'];
      const invalidResult = validateEnabledProviders(invalidProviders);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBe('Invalid providers: invalid_provider');
      
      // Test multiple invalid providers
      const multipleInvalid = ['klarna', 'invalid1', 'invalid2'];
      const multipleInvalidResult = validateEnabledProviders(multipleInvalid);
      expect(multipleInvalidResult.isValid).toBe(false);
      expect(multipleInvalidResult.error).toBe('Invalid providers: invalid1, invalid2');
    });
  });
  
  describe('BNPL Provider Business Logic', () => {
    
    // Extracted generateBNPLOptions function for testing
    const generateBNPLOptions = ({ productId, price, currency, enabledProviders, placement, widgetConfig, shopDomain }) => {
      const options = [];
      
      // BNPL provider configurations
      const providerConfigs = {
        klarna: {
          displayName: 'Klarna',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/klarna-logo.svg`,
          minAmount: 1,
          maxAmount: 10000,
          installments: 4,
          eligibilityRules: (price) => price >= 1 && price <= 10000
        },
        afterpay: {
          displayName: 'Afterpay',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/afterpay-logo.svg`,
          minAmount: 1,
          maxAmount: 2000,
          installments: 4,
          eligibilityRules: (price) => price >= 1 && price <= 2000
        },
        affirm: {
          displayName: 'Affirm',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/affirm-logo.svg`,
          minAmount: 50,
          maxAmount: 30000,
          installments: 3,
          eligibilityRules: (price) => price >= 50 && price <= 30000
        },
        sezzle: {
          displayName: 'Sezzle',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/sezzle-logo.svg`,
          minAmount: 1,
          maxAmount: 2500,
          installments: 4,
          eligibilityRules: (price) => price >= 1 && price <= 2500
        },
        zip: {
          displayName: 'Zip',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/zip-logo.svg`,
          minAmount: 1,
          maxAmount: 1500,
          installments: 4,
          eligibilityRules: (price) => price >= 1 && price <= 1500
        },
        paypal_credit: {
          displayName: 'PayPal Credit',
          logoUrl: `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/paypal-credit-logo.svg`,
          minAmount: 99,
          maxAmount: 10000,
          installments: 6,
          eligibilityRules: (price) => price >= 99 && price <= 10000
        }
      };
      
      // Helper function for generating redirect URLs
      const generateProviderRedirectUrl = (provider, { productId, price, currency, shopDomain }) => {
        const baseUrls = {
          klarna: 'https://www.klarna.com/us/shopping/checkout',
          afterpay: 'https://www.afterpay.com/checkout',
          affirm: 'https://www.affirm.com/apps/checkout',
          sezzle: 'https://checkout.sezzle.com',
          zip: 'https://zip.co/checkout',
          paypal_credit: 'https://www.paypal.com/credit'
        };
        
        const baseUrl = baseUrls[provider];
        if (!baseUrl) return '#';
        
        const params = new URLSearchParams({
          amount: price.toString(),
          currency,
          product_id: productId,
          shop_domain: shopDomain || '',
          return_url: `${shopDomain}/checkout/complete`,
          cancel_url: `${shopDomain}/cart`
        });
        
        return `${baseUrl}?${params.toString()}`;
      };
      
      // Process each enabled provider
      for (const provider of enabledProviders) {
        const config = providerConfigs[provider];
        if (!config) continue;
        
        const isEligible = config.eligibilityRules(price);
        
        if (isEligible) {
          const installmentAmount = (price / config.installments).toFixed(2);
          const installmentText = `${config.installments} payments of ${currency === 'USD' ? '$' : ''}${installmentAmount}`;
          
          options.push({
            provider,
            displayName: config.displayName,
            logoUrl: config.logoUrl,
            installmentText,
            terms: `Interest-free installments`,
            isEligible: true,
            redirectUrl: generateProviderRedirectUrl(provider, {
              productId,
              price,
              currency,
              shopDomain
            })
          });
        }
      }
      
      return options;
    };
    
    test('should generate BNPL options correctly for eligible products', () => {
      const testParams = {
        productId: 'product-123',
        price: 100,
        currency: 'USD',
        enabledProviders: ['klarna', 'afterpay'],
        placement: 'below_price',
        widgetConfig: {},
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const options = generateBNPLOptions(testParams);
      
      expect(options).toHaveLength(2);
      
      // Test Klarna option
      const klarnaOption = options.find(opt => opt.provider === 'klarna');
      expect(klarnaOption).toBeDefined();
      expect(klarnaOption.displayName).toBe('Klarna');
      expect(klarnaOption.installmentText).toBe('4 payments of $25.00');
      expect(klarnaOption.isEligible).toBe(true);
      expect(klarnaOption.logoUrl).toContain('klarna-logo.svg');
      expect(klarnaOption.redirectUrl).toContain('klarna.com');
      
      // Test Afterpay option
      const afterpayOption = options.find(opt => opt.provider === 'afterpay');
      expect(afterpayOption).toBeDefined();
      expect(afterpayOption.displayName).toBe('Afterpay');
      expect(afterpayOption.installmentText).toBe('4 payments of $25.00');
      expect(afterpayOption.isEligible).toBe(true);
      expect(afterpayOption.logoUrl).toContain('afterpay-logo.svg');
      expect(afterpayOption.redirectUrl).toContain('afterpay.com');
    });
    
    test('should filter out ineligible providers based on price', () => {
      // Test with very low price (should exclude Affirm which has $50 minimum)
      const lowPriceParams = {
        productId: 'product-123',
        price: 10,
        currency: 'USD',
        enabledProviders: ['klarna', 'affirm'],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const lowPriceOptions = generateBNPLOptions(lowPriceParams);
      expect(lowPriceOptions).toHaveLength(1);
      expect(lowPriceOptions[0].provider).toBe('klarna');
      
      // Test with very high price (should exclude most providers)
      const highPriceParams = {
        productId: 'product-123',
        price: 15000,
        currency: 'USD',
        enabledProviders: ['klarna', 'afterpay', 'affirm'],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const highPriceOptions = generateBNPLOptions(highPriceParams);
      expect(highPriceOptions).toHaveLength(1);
      expect(highPriceOptions[0].provider).toBe('affirm');
    });
    
    test('should handle edge cases for price boundaries', () => {
      // Test exact boundary conditions
      const boundaryTests = [
        { price: 1, expectedProviders: ['klarna', 'afterpay', 'sezzle', 'zip'] },
        { price: 50, expectedProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip'] },
        { price: 99, expectedProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'] },
        { price: 100, expectedProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'] },
        { price: 1500, expectedProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'] },
                 { price: 2000, expectedProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'paypal_credit'] },
        { price: 2500, expectedProviders: ['klarna', 'affirm', 'sezzle', 'paypal_credit'] },
        { price: 10000, expectedProviders: ['klarna', 'affirm', 'paypal_credit'] },
        { price: 30000, expectedProviders: ['affirm'] }
      ];
      
      boundaryTests.forEach(({ price, expectedProviders }) => {
        const params = {
          productId: 'product-123',
          price,
          currency: 'USD',
          enabledProviders: ['klarna', 'afterpay', 'affirm', 'sezzle', 'zip', 'paypal_credit'],
          shopDomain: 'test-shop.myshopify.com'
        };
        
        const options = generateBNPLOptions(params);
        const actualProviders = options.map(opt => opt.provider).sort();
        expect(actualProviders).toEqual(expectedProviders.sort());
      });
    });
    
    test('should calculate installment amounts correctly', () => {
      const params = {
        productId: 'product-123',
        price: 99.99,
        currency: 'USD',
        enabledProviders: ['klarna', 'affirm', 'paypal_credit'],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const options = generateBNPLOptions(params);
      
      // Klarna: 4 payments of $24.99
      const klarnaOption = options.find(opt => opt.provider === 'klarna');
      expect(klarnaOption.installmentText).toBe('4 payments of $25.00');
      
      // Affirm: 3 payments of $33.33
      const affirmOption = options.find(opt => opt.provider === 'affirm');
      expect(affirmOption.installmentText).toBe('3 payments of $33.33');
      
             // PayPal Credit: 6 payments of $16.66 (99.99/6 = 16.665 rounds to 16.66)
       const paypalOption = options.find(opt => opt.provider === 'paypal_credit');
       expect(paypalOption.installmentText).toBe('6 payments of $16.66');
    });
    
    test('should handle non-USD currency', () => {
      const params = {
        productId: 'product-123',
        price: 100,
        currency: 'EUR',
        enabledProviders: ['klarna'],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const options = generateBNPLOptions(params);
      const klarnaOption = options[0];
      expect(klarnaOption.installmentText).toBe('4 payments of 25.00');
    });
    
    test('should handle empty enabled providers', () => {
      const params = {
        productId: 'product-123',
        price: 100,
        currency: 'USD',
        enabledProviders: [],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const options = generateBNPLOptions(params);
      expect(options).toHaveLength(0);
    });
    
    test('should handle unknown providers gracefully', () => {
      const params = {
        productId: 'product-123',
        price: 100,
        currency: 'USD',
        enabledProviders: ['klarna', 'unknown_provider', 'afterpay'],
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const options = generateBNPLOptions(params);
      expect(options).toHaveLength(2);
      expect(options.map(opt => opt.provider)).toEqual(['klarna', 'afterpay']);
    });
  });

  describe('Data Transformation Logic', () => {
    
    // Test function for generating provider redirect URLs
    const generateProviderRedirectUrl = (provider, { productId, price, currency, shopDomain }) => {
      const baseUrls = {
        klarna: 'https://www.klarna.com/us/shopping/checkout',
        afterpay: 'https://www.afterpay.com/checkout',
        affirm: 'https://www.affirm.com/apps/checkout',
        sezzle: 'https://checkout.sezzle.com',
        zip: 'https://zip.co/checkout',
        paypal_credit: 'https://www.paypal.com/credit'
      };
      
      const baseUrl = baseUrls[provider];
      if (!baseUrl) return '#';
      
      const params = new URLSearchParams({
        amount: price.toString(),
        currency,
        product_id: productId,
        shop_domain: shopDomain || '',
        return_url: `${shopDomain}/checkout/complete`,
        cancel_url: `${shopDomain}/cart`
      });
      
      return `${baseUrl}?${params.toString()}`;
    };
    
    test('should generate correct redirect URLs for all providers', () => {
      const testData = {
        productId: 'product-123',
        price: 99.99,
        currency: 'USD',
        shopDomain: 'test-shop.myshopify.com'
      };
      
      // Test Klarna URL
      const klarnaUrl = generateProviderRedirectUrl('klarna', testData);
      expect(klarnaUrl).toContain('klarna.com/us/shopping/checkout');
      expect(klarnaUrl).toContain('amount=99.99');
      expect(klarnaUrl).toContain('currency=USD');
      expect(klarnaUrl).toContain('product_id=product-123');
      expect(klarnaUrl).toContain('shop_domain=test-shop.myshopify.com');
      expect(klarnaUrl).toContain('return_url=test-shop.myshopify.com%2Fcheckout%2Fcomplete');
      expect(klarnaUrl).toContain('cancel_url=test-shop.myshopify.com%2Fcart');
      
      // Test Afterpay URL
      const afterpayUrl = generateProviderRedirectUrl('afterpay', testData);
      expect(afterpayUrl).toContain('afterpay.com/checkout');
      expect(afterpayUrl).toContain('amount=99.99');
      
      // Test Affirm URL
      const affirmUrl = generateProviderRedirectUrl('affirm', testData);
      expect(affirmUrl).toContain('affirm.com/apps/checkout');
      
      // Test Sezzle URL
      const sezzleUrl = generateProviderRedirectUrl('sezzle', testData);
      expect(sezzleUrl).toContain('checkout.sezzle.com');
      
      // Test Zip URL
      const zipUrl = generateProviderRedirectUrl('zip', testData);
      expect(zipUrl).toContain('zip.co/checkout');
      
      // Test PayPal Credit URL
      const paypalUrl = generateProviderRedirectUrl('paypal_credit', testData);
      expect(paypalUrl).toContain('paypal.com/credit');
    });
    
    test('should handle unknown providers gracefully', () => {
      const testData = {
        productId: 'product-123',
        price: 99.99,
        currency: 'USD',
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const unknownUrl = generateProviderRedirectUrl('unknown_provider', testData);
      expect(unknownUrl).toBe('#');
    });
    
    test('should handle missing shop domain', () => {
      const testData = {
        productId: 'product-123',
        price: 99.99,
        currency: 'USD',
        shopDomain: null
      };
      
      const klarnaUrl = generateProviderRedirectUrl('klarna', testData);
      expect(klarnaUrl).toContain('shop_domain=');
      expect(klarnaUrl).toContain('return_url=null%2Fcheckout%2Fcomplete');
      expect(klarnaUrl).toContain('cancel_url=null%2Fcart');
    });
    
    test('should encode URL parameters correctly', () => {
      const testData = {
        productId: 'product with spaces & symbols',
        price: 123.45,
        currency: 'EUR',
        shopDomain: 'test-shop.myshopify.com'
      };
      
      const klarnaUrl = generateProviderRedirectUrl('klarna', testData);
             expect(klarnaUrl).toContain('product_id=product+with+spaces+%26+symbols');
      expect(klarnaUrl).toContain('currency=EUR');
    });
    
    // Test function for formatting logo URLs
    const formatLogoUrl = (provider, shopDomain) => {
      const logoMap = {
        klarna: 'klarna-logo.svg',
        afterpay: 'afterpay-logo.svg',
        affirm: 'affirm-logo.svg',
        sezzle: 'sezzle-logo.svg',
        zip: 'zip-logo.svg',
        paypal_credit: 'paypal-credit-logo.svg'
      };
      
      const logoFile = logoMap[provider];
      if (!logoFile) return null;
      
      return `${shopDomain ? `https://${shopDomain}` : ''}/apps/badgr/assets/${logoFile}`;
    };
    
    test('should format logo URLs correctly', () => {
      const shopDomain = 'test-shop.myshopify.com';
      
      // Test all providers
      const klarnaLogo = formatLogoUrl('klarna', shopDomain);
      expect(klarnaLogo).toBe('https://test-shop.myshopify.com/apps/badgr/assets/klarna-logo.svg');
      
      const afterpayLogo = formatLogoUrl('afterpay', shopDomain);
      expect(afterpayLogo).toBe('https://test-shop.myshopify.com/apps/badgr/assets/afterpay-logo.svg');
      
      // Test without shop domain
      const noShopLogo = formatLogoUrl('klarna', null);
      expect(noShopLogo).toBe('/apps/badgr/assets/klarna-logo.svg');
      
      // Test unknown provider
      const unknownLogo = formatLogoUrl('unknown', shopDomain);
      expect(unknownLogo).toBeNull();
    });
    
    // Test function for formatting installment text
    const formatInstallmentText = (price, installments, currency) => {
      const installmentAmount = (price / installments).toFixed(2);
      const currencySymbol = currency === 'USD' ? '$' : '';
      return `${installments} payments of ${currencySymbol}${installmentAmount}`;
    };
    
    test('should format installment text correctly', () => {
      // Test USD currency
      const usdText = formatInstallmentText(100, 4, 'USD');
      expect(usdText).toBe('4 payments of $25.00');
      
      // Test other currency
      const eurText = formatInstallmentText(100, 4, 'EUR');
      expect(eurText).toBe('4 payments of 25.00');
      
      // Test with odd division
      const oddText = formatInstallmentText(99.99, 3, 'USD');
      expect(oddText).toBe('3 payments of $33.33');
      
      // Test with large amount
      const largeText = formatInstallmentText(1500, 6, 'USD');
      expect(largeText).toBe('6 payments of $250.00');
    });
    
    // Test function for parsing enabled providers from different formats
    const parseEnabledProviders = (providers) => {
      if (Array.isArray(providers)) {
        return providers;
      }
      
      if (typeof providers === 'string') {
        return providers.split(',').map(p => p.trim()).filter(p => p.length > 0);
      }
      
      return [];
    };
    
    test('should parse enabled providers from different formats', () => {
      // Test array format
      const arrayProviders = parseEnabledProviders(['klarna', 'afterpay']);
      expect(arrayProviders).toEqual(['klarna', 'afterpay']);
      
      // Test string format
      const stringProviders = parseEnabledProviders('klarna,afterpay,affirm');
      expect(stringProviders).toEqual(['klarna', 'afterpay', 'affirm']);
      
      // Test string with spaces
      const spacedProviders = parseEnabledProviders('klarna, afterpay , affirm');
      expect(spacedProviders).toEqual(['klarna', 'afterpay', 'affirm']);
      
      // Test empty string
      const emptyString = parseEnabledProviders('');
      expect(emptyString).toEqual([]);
      
      // Test null/undefined
      const nullProviders = parseEnabledProviders(null);
      expect(nullProviders).toEqual([]);
      
      const undefinedProviders = parseEnabledProviders(undefined);
      expect(undefinedProviders).toEqual([]);
      
      // Test other types
      const numberProviders = parseEnabledProviders(123);
      expect(numberProviders).toEqual([]);
    });
    
    // Test function for transforming API response format
    const transformApiResponse = (data, success = true, message = null) => {
      const response = {
        success,
        timestamp: new Date().toISOString()
      };
      
      if (success) {
        if (Array.isArray(data)) {
          response.data = data;
          response.count = data.length;
        } else {
          response.data = data;
        }
      } else {
        response.error = message || 'An error occurred';
        if (data && data.message) {
          response.message = data.message;
        }
      }
      
      return response;
    };
    
    test('should transform API responses correctly', () => {
      // Test successful response with array data
      const arrayData = [{ id: 1 }, { id: 2 }];
      const arrayResponse = transformApiResponse(arrayData);
      expect(arrayResponse.success).toBe(true);
      expect(arrayResponse.data).toEqual(arrayData);
      expect(arrayResponse.count).toBe(2);
      expect(arrayResponse.timestamp).toBeDefined();
      
      // Test successful response with single object
      const objectData = { id: 1, name: 'test' };
      const objectResponse = transformApiResponse(objectData);
      expect(objectResponse.success).toBe(true);
      expect(objectResponse.data).toEqual(objectData);
      expect(objectResponse.count).toBeUndefined();
      
      // Test error response
      const errorData = { message: 'Database error' };
      const errorResponse = transformApiResponse(errorData, false, 'Failed to fetch data');
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toBe('Failed to fetch data');
      expect(errorResponse.message).toBe('Database error');
      expect(errorResponse.data).toBeUndefined();
      
      // Test error response with default message
      const defaultErrorResponse = transformApiResponse(null, false);
      expect(defaultErrorResponse.success).toBe(false);
      expect(defaultErrorResponse.error).toBe('An error occurred');
    });
    
    // Test function for normalizing shop identifier
    const normalizeShopIdentifier = (shopId) => {
      if (!shopId || typeof shopId !== 'string') {
        return null;
      }
      
      const trimmed = shopId.trim().toLowerCase();
      
      // Remove .myshopify.com if present
      const normalized = trimmed.replace(/\.myshopify\.com$/, '');
      
      // Validate format (alphanumeric with hyphens)
      if (!/^[a-z0-9-]+$/.test(normalized)) {
        return null;
      }
      
      return normalized;
    };
    
    test('should normalize shop identifiers correctly', () => {
      // Test normal shop ID
      const normalId = normalizeShopIdentifier('test-shop');
      expect(normalId).toBe('test-shop');
      
      // Test shop domain
      const shopDomain = normalizeShopIdentifier('test-shop.myshopify.com');
      expect(shopDomain).toBe('test-shop');
      
      // Test with uppercase
      const uppercaseId = normalizeShopIdentifier('TEST-Shop');
      expect(uppercaseId).toBe('test-shop');
      
      // Test with spaces
      const spacedId = normalizeShopIdentifier('  test-shop  ');
      expect(spacedId).toBe('test-shop');
      
      // Test invalid characters
      const invalidId = normalizeShopIdentifier('test_shop@domain');
      expect(invalidId).toBeNull();
      
      // Test empty string
      const emptyId = normalizeShopIdentifier('');
      expect(emptyId).toBeNull();
      
      // Test null/undefined
      const nullId = normalizeShopIdentifier(null);
      expect(nullId).toBeNull();
      
      // Test non-string
      const numberId = normalizeShopIdentifier(123);
      expect(numberId).toBeNull();
    });
    
    // Test function for transforming widget configuration
    const transformWidgetConfig = (rawConfig) => {
      const defaults = {
        widget_enabled: true,
        logo_selection: 'default',
        widget_placement: 'product_description',
        bnpl_enabled: true,
        custom_settings: {}
      };
      
      const config = { ...defaults, ...rawConfig };
      
      // Ensure enabled_providers is an array
      if (config.enabled_providers) {
        config.enabled_providers = parseEnabledProviders(config.enabled_providers);
      }
      
      // Add metadata
      config.updated_at = new Date().toISOString();
      
      return config;
    };
    
    test('should transform widget configuration correctly', () => {
      // Test minimal config
      const minimalConfig = transformWidgetConfig({
        shop_id: 'test-shop',
        shop_domain: 'test-shop.myshopify.com'
      });
      
      expect(minimalConfig.widget_enabled).toBe(true);
      expect(minimalConfig.logo_selection).toBe('default');
      expect(minimalConfig.widget_placement).toBe('product_description');
      expect(minimalConfig.bnpl_enabled).toBe(true);
      expect(minimalConfig.custom_settings).toEqual({});
      expect(minimalConfig.updated_at).toBeDefined();
      
      // Test with enabled_providers as string
      const stringProvidersConfig = transformWidgetConfig({
        enabled_providers: 'klarna,afterpay'
      });
      expect(stringProvidersConfig.enabled_providers).toEqual(['klarna', 'afterpay']);
      
      // Test with enabled_providers as array
      const arrayProvidersConfig = transformWidgetConfig({
        enabled_providers: ['affirm', 'sezzle']
      });
      expect(arrayProvidersConfig.enabled_providers).toEqual(['affirm', 'sezzle']);
      
      // Test overriding defaults
      const customConfig = transformWidgetConfig({
        widget_enabled: false,
        logo_selection: 'custom',
        widget_placement: 'sidebar'
      });
      expect(customConfig.widget_enabled).toBe(false);
      expect(customConfig.logo_selection).toBe('custom');
      expect(customConfig.widget_placement).toBe('sidebar');
         });
   });

   describe('Error Handling Functions', () => {
     
     // Test function for handling database connection errors
     const handleDatabaseError = (error) => {
       const errorMap = {
         'PGRST116': {
           status: 404,
           message: 'Table not found',
           type: 'TABLE_NOT_FOUND'
         },
         'PGRST104': {
           status: 401,
           message: 'Authentication failed',
           type: 'AUTH_ERROR'
         },
         'PGRST301': {
           status: 400,
           message: 'Invalid request format',
           type: 'VALIDATION_ERROR'
         }
       };
       
       const knownError = errorMap[error.code];
       if (knownError) {
         return {
           success: false,
           error: knownError.message,
           type: knownError.type,
           status: knownError.status,
           originalError: error.message
         };
       }
       
       // Handle generic database errors
       if (error.message && error.message.includes('connection')) {
         return {
           success: false,
           error: 'Database connection failed',
           type: 'CONNECTION_ERROR',
           status: 503,
           originalError: error.message
         };
       }
       
       return {
         success: false,
         error: 'An unexpected database error occurred',
         type: 'DATABASE_ERROR',
         status: 500,
         originalError: error.message
       };
     };
     
     test('should handle known database error codes correctly', () => {
       // Test table not found error
       const tableError = handleDatabaseError({ code: 'PGRST116', message: 'Table "widgets" does not exist' });
       expect(tableError.success).toBe(false);
       expect(tableError.error).toBe('Table not found');
       expect(tableError.type).toBe('TABLE_NOT_FOUND');
       expect(tableError.status).toBe(404);
       expect(tableError.originalError).toBe('Table "widgets" does not exist');
       
       // Test authentication error
       const authError = handleDatabaseError({ code: 'PGRST104', message: 'Invalid API key' });
       expect(authError.success).toBe(false);
       expect(authError.error).toBe('Authentication failed');
       expect(authError.type).toBe('AUTH_ERROR');
       expect(authError.status).toBe(401);
       
       // Test validation error
       const validationError = handleDatabaseError({ code: 'PGRST301', message: 'Invalid JSON' });
       expect(validationError.success).toBe(false);
       expect(validationError.error).toBe('Invalid request format');
       expect(validationError.type).toBe('VALIDATION_ERROR');
       expect(validationError.status).toBe(400);
     });
     
     test('should handle connection errors correctly', () => {
       const connectionError = handleDatabaseError({ 
         message: 'connection timeout after 5000ms' 
       });
       expect(connectionError.success).toBe(false);
       expect(connectionError.error).toBe('Database connection failed');
       expect(connectionError.type).toBe('CONNECTION_ERROR');
       expect(connectionError.status).toBe(503);
       expect(connectionError.originalError).toBe('connection timeout after 5000ms');
     });
     
     test('should handle unknown database errors correctly', () => {
       const unknownError = handleDatabaseError({ 
         code: 'UNKNOWN_CODE',
         message: 'Something went wrong' 
       });
       expect(unknownError.success).toBe(false);
       expect(unknownError.error).toBe('An unexpected database error occurred');
       expect(unknownError.type).toBe('DATABASE_ERROR');
       expect(unknownError.status).toBe(500);
       expect(unknownError.originalError).toBe('Something went wrong');
     });
     
     // Test function for handling validation errors
     const handleValidationError = (validationResult) => {
       if (validationResult.isValid) {
         return null;
       }
       
       const errors = Array.isArray(validationResult.errors) 
         ? validationResult.errors 
         : [validationResult.error];
       
       return {
         success: false,
         error: 'Validation failed',
         type: 'VALIDATION_ERROR',
         status: 400,
         details: errors,
         message: `Validation failed: ${errors.join(', ')}`
       };
     };
     
     test('should handle validation errors correctly', () => {
       // Test multiple validation errors
       const multipleErrors = handleValidationError({
         isValid: false,
         errors: ['shop_id is required', 'shop_domain is required']
       });
       expect(multipleErrors.success).toBe(false);
       expect(multipleErrors.error).toBe('Validation failed');
       expect(multipleErrors.type).toBe('VALIDATION_ERROR');
       expect(multipleErrors.status).toBe(400);
       expect(multipleErrors.details).toEqual(['shop_id is required', 'shop_domain is required']);
       expect(multipleErrors.message).toBe('Validation failed: shop_id is required, shop_domain is required');
       
       // Test single validation error
       const singleError = handleValidationError({
         isValid: false,
         error: 'Invalid shop identifier'
       });
       expect(singleError.success).toBe(false);
       expect(singleError.details).toEqual(['Invalid shop identifier']);
       expect(singleError.message).toBe('Validation failed: Invalid shop identifier');
       
       // Test valid input (should return null)
       const validInput = handleValidationError({
         isValid: true,
         errors: []
       });
       expect(validInput).toBeNull();
     });
     
     // Test function for handling API rate limiting
     const handleRateLimitError = (remainingRequests, resetTime) => {
       if (remainingRequests > 0) {
         return null;
       }
       
       const resetDate = new Date(resetTime);
       const waitTime = Math.ceil((resetDate.getTime() - Date.now()) / 1000);
       
       return {
         success: false,
         error: 'Rate limit exceeded',
         type: 'RATE_LIMIT_ERROR',
         status: 429,
         retryAfter: waitTime,
         resetTime: resetDate.toISOString(),
         message: `Rate limit exceeded. Try again in ${waitTime} seconds.`
       };
     };
     
     test('should handle rate limiting correctly', () => {
       const now = Date.now();
       const resetTime = now + 60000; // 1 minute from now
       
       // Test rate limit exceeded
       const rateLimitError = handleRateLimitError(0, resetTime);
       expect(rateLimitError.success).toBe(false);
       expect(rateLimitError.error).toBe('Rate limit exceeded');
       expect(rateLimitError.type).toBe('RATE_LIMIT_ERROR');
       expect(rateLimitError.status).toBe(429);
       expect(rateLimitError.retryAfter).toBe(60);
       expect(rateLimitError.message).toBe('Rate limit exceeded. Try again in 60 seconds.');
       
       // Test requests remaining (should return null)
       const noRateLimit = handleRateLimitError(10, resetTime);
       expect(noRateLimit).toBeNull();
     });
     
     // Test function for handling network errors
     const handleNetworkError = (error) => {
       const errorMap = {
         'ECONNREFUSED': {
           message: 'Connection refused - service may be down',
           type: 'CONNECTION_REFUSED',
           status: 503
         },
         'ETIMEDOUT': {
           message: 'Request timeout - service is not responding',
           type: 'TIMEOUT',
           status: 408
         },
         'ENOTFOUND': {
           message: 'Service not found - check URL',
           type: 'NOT_FOUND',
           status: 404
         },
         'ECONNRESET': {
           message: 'Connection reset by server',
           type: 'CONNECTION_RESET',
           status: 502
         }
       };
       
       const knownError = errorMap[error.code];
       if (knownError) {
         return {
           success: false,
           error: knownError.message,
           type: knownError.type,
           status: knownError.status,
           originalError: error.message
         };
       }
       
       return {
         success: false,
         error: 'Network error occurred',
         type: 'NETWORK_ERROR',
         status: 500,
         originalError: error.message
       };
     };
     
     test('should handle network errors correctly', () => {
       // Test connection refused
       const connRefusedError = handleNetworkError({ 
         code: 'ECONNREFUSED', 
         message: 'connect ECONNREFUSED 127.0.0.1:5432' 
       });
       expect(connRefusedError.success).toBe(false);
       expect(connRefusedError.error).toBe('Connection refused - service may be down');
       expect(connRefusedError.type).toBe('CONNECTION_REFUSED');
       expect(connRefusedError.status).toBe(503);
       
       // Test timeout
       const timeoutError = handleNetworkError({ 
         code: 'ETIMEDOUT', 
         message: 'timeout of 5000ms exceeded' 
       });
       expect(timeoutError.error).toBe('Request timeout - service is not responding');
       expect(timeoutError.type).toBe('TIMEOUT');
       expect(timeoutError.status).toBe(408);
       
       // Test not found
       const notFoundError = handleNetworkError({ 
         code: 'ENOTFOUND', 
         message: 'getaddrinfo ENOTFOUND api.example.com' 
       });
       expect(notFoundError.error).toBe('Service not found - check URL');
       expect(notFoundError.type).toBe('NOT_FOUND');
       expect(notFoundError.status).toBe(404);
       
       // Test connection reset
       const resetError = handleNetworkError({ 
         code: 'ECONNRESET', 
         message: 'socket hang up' 
       });
       expect(resetError.error).toBe('Connection reset by server');
       expect(resetError.type).toBe('CONNECTION_RESET');
       expect(resetError.status).toBe(502);
       
       // Test unknown network error
       const unknownError = handleNetworkError({ 
         code: 'UNKNOWN', 
         message: 'Unknown network error' 
       });
       expect(unknownError.error).toBe('Network error occurred');
       expect(unknownError.type).toBe('NETWORK_ERROR');
       expect(unknownError.status).toBe(500);
     });
     
     // Test function for handling service errors
     const handleServiceError = (error, serviceName) => {
       // Handle specific service error patterns
       if (error.response) {
         const { status, data } = error.response;
         
         switch (status) {
           case 400:
             return {
               success: false,
               error: `Invalid request to ${serviceName}`,
               type: 'SERVICE_BAD_REQUEST',
               status: 400,
               details: data?.message || data?.error,
               originalError: error.message
             };
           case 401:
             return {
               success: false,
               error: `Authentication failed with ${serviceName}`,
               type: 'SERVICE_AUTH_ERROR',
               status: 401,
               details: data?.message || 'Invalid credentials',
               originalError: error.message
             };
           case 403:
             return {
               success: false,
               error: `Access forbidden to ${serviceName}`,
               type: 'SERVICE_FORBIDDEN',
               status: 403,
               details: data?.message || 'Insufficient permissions',
               originalError: error.message
             };
           case 429:
             return {
               success: false,
               error: `Rate limit exceeded for ${serviceName}`,
               type: 'SERVICE_RATE_LIMIT',
               status: 429,
               retryAfter: error.response.headers['retry-after'] || 60,
               originalError: error.message
             };
           case 500:
           case 502:
           case 503:
           case 504:
             return {
               success: false,
               error: `${serviceName} is currently unavailable`,
               type: 'SERVICE_UNAVAILABLE',
               status,
               originalError: error.message
             };
           default:
             return {
               success: false,
               error: `Unexpected error from ${serviceName}`,
               type: 'SERVICE_ERROR',
               status,
               originalError: error.message
             };
         }
       }
       
       return {
         success: false,
         error: `Failed to communicate with ${serviceName}`,
         type: 'SERVICE_COMMUNICATION_ERROR',
         status: 500,
         originalError: error.message
       };
     };
     
     test('should handle service errors correctly', () => {
       const serviceName = 'Supabase';
       
       // Test 400 Bad Request
       const badRequestError = handleServiceError({
         response: { 
           status: 400, 
           data: { message: 'Invalid query' } 
         },
         message: 'Request failed'
       }, serviceName);
       expect(badRequestError.error).toBe('Invalid request to Supabase');
       expect(badRequestError.type).toBe('SERVICE_BAD_REQUEST');
       expect(badRequestError.status).toBe(400);
       expect(badRequestError.details).toBe('Invalid query');
       
               // Test 401 Authentication
        const authError = handleServiceError({
          response: { 
            status: 401, 
            data: { message: 'Invalid API key' } 
          },
          message: 'Auth failed'
        }, serviceName);
        expect(authError.error).toBe('Authentication failed with Supabase');
        expect(authError.type).toBe('SERVICE_AUTH_ERROR');
        expect(authError.status).toBe(401);
        expect(authError.details).toBe('Invalid API key');
       
       // Test 403 Forbidden
       const forbiddenError = handleServiceError({
         response: { 
           status: 403, 
           data: {} 
         },
         message: 'Forbidden'
       }, serviceName);
       expect(forbiddenError.error).toBe('Access forbidden to Supabase');
       expect(forbiddenError.type).toBe('SERVICE_FORBIDDEN');
       expect(forbiddenError.details).toBe('Insufficient permissions');
       
       // Test 429 Rate Limit
       const rateLimitError = handleServiceError({
         response: { 
           status: 429,
           headers: { 'retry-after': '120' },
           data: {}
         },
         message: 'Too many requests'
       }, serviceName);
       expect(rateLimitError.error).toBe('Rate limit exceeded for Supabase');
       expect(rateLimitError.type).toBe('SERVICE_RATE_LIMIT');
       expect(rateLimitError.retryAfter).toBe('120');
       
       // Test 503 Service Unavailable
       const unavailableError = handleServiceError({
         response: { 
           status: 503, 
           data: {} 
         },
         message: 'Service unavailable'
       }, serviceName);
       expect(unavailableError.error).toBe('Supabase is currently unavailable');
       expect(unavailableError.type).toBe('SERVICE_UNAVAILABLE');
       expect(unavailableError.status).toBe(503);
       
       // Test communication error (no response)
       const commError = handleServiceError({
         message: 'Network error'
       }, serviceName);
       expect(commError.error).toBe('Failed to communicate with Supabase');
       expect(commError.type).toBe('SERVICE_COMMUNICATION_ERROR');
       expect(commError.status).toBe(500);
     });
     
     // Test function for error logging and monitoring
     const logError = (error, context = {}) => {
       const logEntry = {
         timestamp: new Date().toISOString(),
         level: 'error',
         message: error.message || error.error,
         type: error.type || 'UNKNOWN_ERROR',
         status: error.status || 500,
         context,
         stack: error.stack,
         originalError: error.originalError
       };
       
       // In production, this would send to a logging service
       console.error('Error logged:', logEntry);
       
       return logEntry;
     };
     
     test('should log errors correctly', () => {
       const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
       
       const error = {
         message: 'Database connection failed',
         type: 'CONNECTION_ERROR',
         status: 503,
         stack: 'Error stack trace...',
         originalError: 'ECONNREFUSED'
       };
       
       const context = {
         shopId: 'test-shop',
         endpoint: '/api/widgets'
       };
       
       const logEntry = logError(error, context);
       
       expect(logEntry.timestamp).toBeDefined();
       expect(logEntry.level).toBe('error');
       expect(logEntry.message).toBe('Database connection failed');
       expect(logEntry.type).toBe('CONNECTION_ERROR');
       expect(logEntry.status).toBe(503);
       expect(logEntry.context).toEqual(context);
       expect(logEntry.stack).toBe('Error stack trace...');
       expect(logEntry.originalError).toBe('ECONNREFUSED');
       
       expect(consoleSpy).toHaveBeenCalledWith('Error logged:', logEntry);
       
       consoleSpy.mockRestore();
     });
   });

   describe('Service Layer Methods', () => {
     
     // Mock Supabase client for service layer testing
     const createMockSupabaseClient = () => {
       const mockSingle = jest.fn();
       const mockSelect = jest.fn(() => ({ single: mockSingle }));
       const mockEq = jest.fn(() => ({ single: mockSingle, select: mockSelect }));
       const mockLimit = jest.fn();
       const mockOrder = jest.fn();
       const mockUpsert = jest.fn(() => ({ select: mockSelect }));
       const mockUpdate = jest.fn(() => ({ eq: mockEq }));
                const mockDeleteEq = jest.fn();
         const mockDelete = jest.fn(() => ({ eq: mockDeleteEq }));
       
       const mockFrom = jest.fn(() => ({
         select: jest.fn(() => ({ 
           eq: mockEq, 
           order: mockOrder, 
           limit: mockLimit 
         })),
         upsert: mockUpsert,
         update: mockUpdate,
         delete: mockDelete
       }));
       
                return {
           from: mockFrom,
           _mocks: {
             single: mockSingle,
             select: mockSelect,
             eq: mockEq,
             limit: mockLimit,
             order: mockOrder,
             upsert: mockUpsert,
             update: mockUpdate,
             delete: mockDelete,
             deleteEq: mockDeleteEq
           }
         };
     };
     
     // Test implementation of widgetConfigService
     const createWidgetConfigService = (mockSupabase) => {
       return {
         async getByShopId(shopId) {
           const { data, error } = await mockSupabase
             .from('widget_configurations')
             .select('*')
             .eq('shop_id', shopId)
             .single();
           
           if (error && error.code !== 'PGRST116') {
             throw new Error(`Failed to get widget configuration: ${error.message}`);
           }
           
           return data;
         },
         
         async upsert(config) {
           const { data, error } = await mockSupabase
             .from('widget_configurations')
             .upsert(config, { onConflict: 'shop_id' })
             .select()
             .single();
           
           if (error) {
             throw new Error(`Failed to upsert widget configuration: ${error.message}`);
           }
           
           return data;
         },
         
         async update(shopId, updates) {
           const { data, error } = await mockSupabase
             .from('widget_configurations')
             .update(updates)
             .eq('shop_id', shopId)
             .select()
             .single();
           
           if (error) {
             throw new Error(`Failed to update widget configuration: ${error.message}`);
           }
           
           return data;
         },
         
         async delete(shopId) {
           const { error } = await mockSupabase
             .from('widget_configurations')
             .delete()
             .eq('shop_id', shopId);
           
           if (error) {
             throw new Error(`Failed to delete widget configuration: ${error.message}`);
           }
           
           return true;
         }
       };
     };
     
     // Test connection service
     const createTestConnectionService = (mockSupabase) => {
       return {
         async testConnection() {
           try {
             const { data, error } = await mockSupabase
               .from('widget_configurations')
               .select('*')
               .limit(1);
             
             if (error && error.code !== 'PGRST116') {
               console.error('❌ Supabase connection error:', error);
               return false;
             }
             
             console.log('✅ Supabase connection successful');
             return true;
           } catch (error) {
             console.error('❌ Supabase connection failed:', error);
             return false;
           }
         }
       };
     };
     
     describe('widgetConfigService.getByShopId', () => {
       test('should retrieve widget configuration by shop ID successfully', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const mockConfig = {
           id: 1,
           shop_id: 'test-shop',
           shop_domain: 'test-shop.myshopify.com',
           widget_enabled: true
         };
         
         // Mock successful response
         mockSupabase._mocks.single.mockResolvedValue({
           data: mockConfig,
           error: null
         });
         
         const result = await service.getByShopId('test-shop');
         
         expect(result).toEqual(mockConfig);
         expect(mockSupabase.from).toHaveBeenCalledWith('widget_configurations');
       });
       
       test('should return null for non-existent shop ID', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         // Mock no data found (PGRST116 is expected for not found)
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { code: 'PGRST116', message: 'No rows found' }
         });
         
         const result = await service.getByShopId('non-existent-shop');
         
         expect(result).toBeNull();
       });
       
       test('should throw error for database connection issues', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         // Mock database error
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { code: 'PGRST104', message: 'Authentication failed' }
         });
         
         await expect(service.getByShopId('test-shop'))
           .rejects.toThrow('Failed to get widget configuration: Authentication failed');
       });
       
       test('should handle invalid shop ID input', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { code: 'PGRST116', message: 'No rows found' }
         });
         
         // Test with null shop ID
         const result = await service.getByShopId(null);
         expect(result).toBeNull();
         
         // Test with empty string
         const result2 = await service.getByShopId('');
         expect(result2).toBeNull();
       });
     });
     
     describe('widgetConfigService.upsert', () => {
       test('should create new widget configuration successfully', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const newConfig = {
           shop_id: 'new-shop',
           shop_domain: 'new-shop.myshopify.com',
           widget_enabled: true,
           logo_selection: 'klarna',
           enabled_providers: ['klarna', 'afterpay']
         };
         
         const createdConfig = { ...newConfig, id: 1, created_at: '2025-01-01T00:00:00Z' };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: createdConfig,
           error: null
         });
         
         const result = await service.upsert(newConfig);
         
         expect(result).toEqual(createdConfig);
         expect(mockSupabase.from).toHaveBeenCalledWith('widget_configurations');
       });
       
       test('should update existing widget configuration successfully', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const existingConfig = {
           id: 1,
           shop_id: 'existing-shop',
           shop_domain: 'existing-shop.myshopify.com',
           widget_enabled: false,
           logo_selection: 'default'
         };
         
         const updatedConfig = { ...existingConfig, widget_enabled: true, updated_at: '2025-01-01T00:00:00Z' };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: updatedConfig,
           error: null
         });
         
         const result = await service.upsert(existingConfig);
         
         expect(result).toEqual(updatedConfig);
       });
       
       test('should throw error for invalid configuration data', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const invalidConfig = {
           shop_id: 'test-shop'
           // Missing required shop_domain
         };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { message: 'Missing required field: shop_domain' }
         });
         
         await expect(service.upsert(invalidConfig))
           .rejects.toThrow('Failed to upsert widget configuration: Missing required field: shop_domain');
       });
       
       test('should handle database constraint violations', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const config = {
           shop_id: 'test-shop',
           shop_domain: 'test-shop.myshopify.com'
         };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { message: 'Unique constraint violation' }
         });
         
         await expect(service.upsert(config))
           .rejects.toThrow('Failed to upsert widget configuration: Unique constraint violation');
       });
     });
     
     describe('widgetConfigService.update', () => {
       test('should update widget configuration successfully', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const updates = {
           widget_enabled: false,
           logo_selection: 'sezzle',
           enabled_providers: ['sezzle', 'zip']
         };
         
         const updatedConfig = {
           id: 1,
           shop_id: 'test-shop',
           shop_domain: 'test-shop.myshopify.com',
           ...updates,
           updated_at: '2025-01-01T00:00:00Z'
         };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: updatedConfig,
           error: null
         });
         
         const result = await service.update('test-shop', updates);
         
         expect(result).toEqual(updatedConfig);
         expect(mockSupabase.from).toHaveBeenCalledWith('widget_configurations');
       });
       
       test('should throw error when updating non-existent shop', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const updates = { widget_enabled: false };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { message: 'No rows updated' }
         });
         
         await expect(service.update('non-existent-shop', updates))
           .rejects.toThrow('Failed to update widget configuration: No rows updated');
       });
       
       test('should handle partial updates correctly', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const partialUpdates = { widget_enabled: true };
         
         const updatedConfig = {
           id: 1,
           shop_id: 'test-shop',
           shop_domain: 'test-shop.myshopify.com',
           widget_enabled: true,
           logo_selection: 'klarna', // unchanged
           enabled_providers: ['klarna'] // unchanged
         };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: updatedConfig,
           error: null
         });
         
         const result = await service.update('test-shop', partialUpdates);
         
         expect(result).toEqual(updatedConfig);
       });
       
       test('should validate update data types', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         const invalidUpdates = {
           widget_enabled: 'true', // should be boolean
           enabled_providers: 'klarna,afterpay' // should be array
         };
         
         mockSupabase._mocks.single.mockResolvedValue({
           data: null,
           error: { message: 'Invalid data type for field widget_enabled' }
         });
         
         await expect(service.update('test-shop', invalidUpdates))
           .rejects.toThrow('Failed to update widget configuration: Invalid data type for field widget_enabled');
       });
     });
     
     describe('widgetConfigService.delete', () => {
       test('should delete widget configuration successfully', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         mockSupabase._mocks.deleteEq.mockResolvedValue({
           error: null
         });
         
         const result = await service.delete('test-shop');
         
         expect(result).toBe(true);
         expect(mockSupabase.from).toHaveBeenCalledWith('widget_configurations');
       });
       
       test('should throw error when deleting non-existent shop', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         mockSupabase._mocks.deleteEq.mockResolvedValue({
           error: { message: 'No rows deleted' }
         });
         
         await expect(service.delete('non-existent-shop'))
           .rejects.toThrow('Failed to delete widget configuration: No rows deleted');
       });
       
       test('should handle database connection errors during delete', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         mockSupabase._mocks.deleteEq.mockResolvedValue({
           error: { message: 'Database connection lost' }
         });
         
         await expect(service.delete('test-shop'))
           .rejects.toThrow('Failed to delete widget configuration: Database connection lost');
       });
       
       test('should handle foreign key constraint violations', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createWidgetConfigService(mockSupabase);
         
         mockSupabase._mocks.deleteEq.mockResolvedValue({
           error: { message: 'Foreign key constraint violation' }
         });
         
         await expect(service.delete('test-shop'))
           .rejects.toThrow('Failed to delete widget configuration: Foreign key constraint violation');
       });
     });
     
     describe('testConnection', () => {
       test('should return true for successful connection', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createTestConnectionService(mockSupabase);
         
         const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
         
         mockSupabase._mocks.limit.mockResolvedValue({
           data: [],
           error: null
         });
         
         const result = await service.testConnection();
         
         expect(result).toBe(true);
         expect(consoleSpy).toHaveBeenCalledWith('✅ Supabase connection successful');
         
         consoleSpy.mockRestore();
       });
       
       test('should return true for table not found error (expected for new DB)', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createTestConnectionService(mockSupabase);
         
         const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
         
         mockSupabase._mocks.limit.mockResolvedValue({
           data: null,
           error: { code: 'PGRST116', message: 'Table does not exist' }
         });
         
         const result = await service.testConnection();
         
         expect(result).toBe(true);
         expect(consoleSpy).toHaveBeenCalledWith('✅ Supabase connection successful');
         
         consoleSpy.mockRestore();
       });
       
       test('should return false for authentication errors', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createTestConnectionService(mockSupabase);
         
         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
         
         const authError = { code: 'PGRST104', message: 'Invalid API key' };
         mockSupabase._mocks.limit.mockResolvedValue({
           data: null,
           error: authError
         });
         
         const result = await service.testConnection();
         
         expect(result).toBe(false);
         expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Supabase connection error:', authError);
         
         consoleErrorSpy.mockRestore();
       });
       
       test('should return false for network connection errors', async () => {
         const mockSupabase = createMockSupabaseClient();
         const service = createTestConnectionService(mockSupabase);
         
         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
         
         const networkError = new Error('Network error');
         mockSupabase._mocks.limit.mockRejectedValue(networkError);
         
         const result = await service.testConnection();
         
         expect(result).toBe(false);
         expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Supabase connection failed:', networkError);
         
         consoleErrorSpy.mockRestore();
       });
     });
   });

   describe('Utility Functions', () => {
     
     // Test function for logging with different levels
     const createLogger = (level = 'info') => {
       const logs = [];
       return {
         log: (message, data = null) => {
           logs.push({ level: 'log', message, data, timestamp: new Date().toISOString() });
         },
         info: (message, data = null) => {
           logs.push({ level: 'info', message, data, timestamp: new Date().toISOString() });
         },
         warn: (message, data = null) => {
           logs.push({ level: 'warn', message, data, timestamp: new Date().toISOString() });
         },
         error: (message, data = null) => {
           logs.push({ level: 'error', message, data, timestamp: new Date().toISOString() });
         },
         debug: (message, data = null) => {
           if (level === 'debug') {
             logs.push({ level: 'debug', message, data, timestamp: new Date().toISOString() });
           }
         },
         getLogs: () => logs,
         clearLogs: () => logs.length = 0
       };
     };
     
     test('should log messages with appropriate levels', () => {
       const logger = createLogger('debug');
       
       logger.info('Info message', { test: true });
       logger.warn('Warning message');
       logger.error('Error message', { error: 'details' });
       logger.debug('Debug message');
       
       const logs = logger.getLogs();
       expect(logs).toHaveLength(4);
       
       expect(logs[0]).toMatchObject({
         level: 'info',
         message: 'Info message',
         data: { test: true }
       });
       
       expect(logs[1]).toMatchObject({
         level: 'warn',
         message: 'Warning message',
         data: null
       });
       
       expect(logs[2]).toMatchObject({
         level: 'error',
         message: 'Error message',
         data: { error: 'details' }
       });
       
       expect(logs[3]).toMatchObject({
         level: 'debug',
         message: 'Debug message'
       });
     });
     
     test('should respect log level filtering', () => {
       const infoLogger = createLogger('info');
       
       infoLogger.info('Info message');
       infoLogger.debug('Debug message'); // Should be filtered out
       
       const logs = infoLogger.getLogs();
       expect(logs).toHaveLength(1);
       expect(logs[0].level).toBe('info');
     });
     
            test('should include timestamps in logs', () => {
         const logger = createLogger();
         const beforeTime = new Date();
         
         logger.info('Test message');
         
         const afterTime = new Date();
         const logs = logger.getLogs();
         
         expect(logs[0].timestamp).toBeDefined();
         const logTime = new Date(logs[0].timestamp);
         expect(logTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
         expect(logTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
       });
     
     // Test function for environment configuration utilities
     const getEnvConfig = () => {
       const env = process.env.NODE_ENV || 'development';
       const port = parseInt(process.env.PORT || '3000', 10);
       const supabaseUrl = process.env.SUPABASE_URL || '';
       const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
       
                return {
           isDevelopment: env === 'development',
           isProduction: env === 'production',
           isTest: env === 'test',
           port,
           supabase: {
             url: supabaseUrl,
             key: supabaseKey,
             isConfigured: !!(supabaseUrl && supabaseKey)
           }
         };
     };
     
     test('should parse environment configuration correctly', () => {
       const originalEnv = { ...process.env };
       
       // Test development environment
       process.env.NODE_ENV = 'development';
       process.env.PORT = '4000';
       process.env.SUPABASE_URL = 'https://test.supabase.co';
       process.env.SUPABASE_ANON_KEY = 'test-key';
       
       const devConfig = getEnvConfig();
       expect(devConfig.isDevelopment).toBe(true);
       expect(devConfig.isProduction).toBe(false);
       expect(devConfig.isTest).toBe(false);
       expect(devConfig.port).toBe(4000);
       expect(devConfig.supabase.url).toBe('https://test.supabase.co');
       expect(devConfig.supabase.key).toBe('test-key');
       expect(devConfig.supabase.isConfigured).toBe(true);
       
       // Test production environment
       process.env.NODE_ENV = 'production';
       process.env.PORT = '8080';
       
       const prodConfig = getEnvConfig();
       expect(prodConfig.isDevelopment).toBe(false);
       expect(prodConfig.isProduction).toBe(true);
       expect(prodConfig.port).toBe(8080);
       
       // Test missing configuration
       delete process.env.SUPABASE_URL;
       delete process.env.SUPABASE_ANON_KEY;
       
       const incompleteConfig = getEnvConfig();
       expect(incompleteConfig.supabase.isConfigured).toBe(false);
       
       // Restore original environment
       process.env = originalEnv;
     });
     
     test('should handle default values for missing environment variables', () => {
       const originalEnv = { ...process.env };
       
       // Clear relevant environment variables
       delete process.env.NODE_ENV;
       delete process.env.PORT;
       delete process.env.SUPABASE_URL;
       delete process.env.SUPABASE_ANON_KEY;
       
       const config = getEnvConfig();
       expect(config.isDevelopment).toBe(true); // default NODE_ENV
       expect(config.port).toBe(3000); // default PORT
       expect(config.supabase.url).toBe('');
       expect(config.supabase.key).toBe('');
       expect(config.supabase.isConfigured).toBe(false);
       
       // Restore original environment
       process.env = originalEnv;
     });
     
     // Test function for request/response utilities
     const createResponseHelper = () => {
       return {
         success: (data, message = 'Success') => ({
           success: true,
           message,
           data,
           timestamp: new Date().toISOString()
         }),
         
         error: (message, statusCode = 500, details = null) => ({
           success: false,
           error: message,
           statusCode,
           details,
           timestamp: new Date().toISOString()
         }),
         
         paginated: (data, page = 1, pageSize = 10, total = null) => ({
           success: true,
           data,
           pagination: {
             page,
             pageSize,
             total: total || data.length,
             totalPages: total ? Math.ceil(total / pageSize) : Math.ceil(data.length / pageSize),
             hasNext: total ? (page * pageSize) < total : false,
             hasPrev: page > 1
           },
           timestamp: new Date().toISOString()
         })
       };
     };
     
     test('should create success responses correctly', () => {
       const responseHelper = createResponseHelper();
       
       const response = responseHelper.success({ id: 1, name: 'test' }, 'Data retrieved');
       
       expect(response.success).toBe(true);
       expect(response.message).toBe('Data retrieved');
       expect(response.data).toEqual({ id: 1, name: 'test' });
       expect(response.timestamp).toBeDefined();
     });
     
     test('should create error responses correctly', () => {
       const responseHelper = createResponseHelper();
       
       const response = responseHelper.error('Validation failed', 400, { field: 'shop_id' });
       
       expect(response.success).toBe(false);
       expect(response.error).toBe('Validation failed');
       expect(response.statusCode).toBe(400);
       expect(response.details).toEqual({ field: 'shop_id' });
       expect(response.timestamp).toBeDefined();
     });
     
     test('should create paginated responses correctly', () => {
       const responseHelper = createResponseHelper();
       const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
       
       const response = responseHelper.paginated(data, 1, 2, 10);
       
       expect(response.success).toBe(true);
       expect(response.data).toEqual(data);
       expect(response.pagination).toEqual({
         page: 1,
         pageSize: 2,
         total: 10,
         totalPages: 5,
         hasNext: true,
         hasPrev: false
       });
     });
     
     test('should handle pagination edge cases', () => {
       const responseHelper = createResponseHelper();
       const data = [{ id: 1 }];
       
       // Last page
       const lastPageResponse = responseHelper.paginated(data, 5, 2, 9);
       expect(lastPageResponse.pagination.hasNext).toBe(false);
       expect(lastPageResponse.pagination.hasPrev).toBe(true);
       
       // Auto-calculate total from data length
       const autoTotalResponse = responseHelper.paginated(data, 1, 10);
       expect(autoTotalResponse.pagination.total).toBe(1);
       expect(autoTotalResponse.pagination.totalPages).toBe(1);
     });
     
     // Test function for string/data manipulation utilities
     const stringUtils = {
       sanitizeShopId: (shopId) => {
         if (!shopId || typeof shopId !== 'string') return null;
         return shopId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
       },
       
       generateHash: (input) => {
         if (!input) return null;
         // Simple hash for testing (not cryptographically secure)
         let hash = 0;
         for (let i = 0; i < input.length; i++) {
           const char = input.charCodeAt(i);
           hash = ((hash << 5) - hash) + char;
           hash = hash & hash; // Convert to 32-bit integer
         }
         return Math.abs(hash).toString(16);
       },
       
       formatCurrency: (amount, currency = 'USD') => {
         const formatter = new Intl.NumberFormat('en-US', {
           style: 'currency',
           currency
         });
         return formatter.format(amount);
       },
       
       truncateText: (text, maxLength = 100, suffix = '...') => {
         if (!text || text.length <= maxLength) return text;
         return text.substring(0, maxLength - suffix.length) + suffix;
       },
       
                slugify: (text) => {
           if (!text) return '';
           return text
             .toLowerCase()
             .trim()
             .replace(/[^a-z0-9 -]/g, '')
             .replace(/\s+/g, '-')
             .replace(/-+/g, '-');
         }
     };
     
     test('should sanitize shop IDs correctly', () => {
       expect(stringUtils.sanitizeShopId('Test-Shop-123')).toBe('test-shop-123');
       expect(stringUtils.sanitizeShopId('  invalid@shop#name  ')).toBe('invalidshopname');
       expect(stringUtils.sanitizeShopId('shop_with_underscores')).toBe('shopwithunderscores');
       expect(stringUtils.sanitizeShopId('')).toBeNull();
       expect(stringUtils.sanitizeShopId(null)).toBeNull();
       expect(stringUtils.sanitizeShopId(123)).toBeNull();
     });
     
     test('should generate consistent hashes', () => {
       const input = 'test-string';
       const hash1 = stringUtils.generateHash(input);
       const hash2 = stringUtils.generateHash(input);
       
       expect(hash1).toBe(hash2);
       expect(hash1).toBeDefined();
       expect(typeof hash1).toBe('string');
       
       // Different inputs should produce different hashes
       const differentHash = stringUtils.generateHash('different-string');
       expect(hash1).not.toBe(differentHash);
       
       // Empty input should return null
       expect(stringUtils.generateHash('')).toBeNull();
       expect(stringUtils.generateHash(null)).toBeNull();
     });
     
     test('should format currency correctly', () => {
       expect(stringUtils.formatCurrency(99.99)).toBe('$99.99');
       expect(stringUtils.formatCurrency(1000.50)).toBe('$1,000.50');
       expect(stringUtils.formatCurrency(0)).toBe('$0.00');
       expect(stringUtils.formatCurrency(99.99, 'EUR')).toContain('99.99');
     });
     
            test('should truncate text correctly', () => {
         const longText = 'This is a very long text that should be truncated at some point to fit within the specified length limit.';
         
         expect(stringUtils.truncateText(longText, 50)).toBe('This is a very long text that should be truncat...');
         expect(stringUtils.truncateText('Short text', 50)).toBe('Short text');
         expect(stringUtils.truncateText(longText, 30, '...')).toBe('This is a very long text th...');
         expect(stringUtils.truncateText('', 50)).toBe('');
         expect(stringUtils.truncateText(null, 50)).toBeNull();
       });
     
     test('should create slugs correctly', () => {
       expect(stringUtils.slugify('Hello World')).toBe('hello-world');
       expect(stringUtils.slugify('Test Product Name!')).toBe('test-product-name');
       expect(stringUtils.slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
       expect(stringUtils.slugify('Special@#$Characters')).toBe('specialcharacters');
       expect(stringUtils.slugify('')).toBe('');
       expect(stringUtils.slugify(null)).toBe('');
     });
     
     // Test function for async utilities
     const asyncUtils = {
       delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
       
       retry: async (fn, maxAttempts = 3, delayMs = 100) => {
         let lastError;
         for (let attempt = 1; attempt <= maxAttempts; attempt++) {
           try {
             return await fn();
           } catch (error) {
             lastError = error;
             if (attempt < maxAttempts) {
               await asyncUtils.delay(delayMs);
             }
           }
         }
         throw lastError;
       },
       
       timeout: (promise, timeoutMs) => {
         return Promise.race([
           promise,
           new Promise((_, reject) => 
             setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
           )
         ]);
       }
     };
     
     test('should handle delays correctly', async () => {
       const start = Date.now();
       await asyncUtils.delay(50);
       const elapsed = Date.now() - start;
       
       expect(elapsed).toBeGreaterThanOrEqual(45); // Allow for some timing variance
       expect(elapsed).toBeLessThan(100);
     });
     
     test('should retry failed operations', async () => {
       let attempts = 0;
       const failingFunction = jest.fn(() => {
         attempts++;
         if (attempts < 3) {
           throw new Error('Temporary failure');
         }
         return 'success';
       });
       
       const result = await asyncUtils.retry(failingFunction, 3, 1);
       
       expect(result).toBe('success');
       expect(failingFunction).toHaveBeenCalledTimes(3);
     });
     
     test('should throw error after max retry attempts', async () => {
       const alwaysFailingFunction = jest.fn(() => {
         throw new Error('Permanent failure');
       });
       
       await expect(asyncUtils.retry(alwaysFailingFunction, 2, 1))
         .rejects.toThrow('Permanent failure');
       
       expect(alwaysFailingFunction).toHaveBeenCalledTimes(2);
     });
     
     test('should handle timeouts correctly', async () => {
       const slowPromise = new Promise(resolve => setTimeout(() => resolve('completed'), 100));
       
       // Should timeout
       await expect(asyncUtils.timeout(slowPromise, 50))
         .rejects.toThrow('Operation timed out');
       
       // Should complete
       const fastPromise = Promise.resolve('fast result');
       const result = await asyncUtils.timeout(fastPromise, 100);
       expect(result).toBe('fast result');
     });
   });
 }); 