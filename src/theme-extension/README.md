# BADGR Theme App Extension

A Shopify Theme App Extension for displaying Buy Now Pay Later (BNPL) options on product pages.

## Overview

The BADGR Theme App Extension allows merchants to display BNPL payment options directly on their product pages, providing customers with flexible payment choices from multiple providers like Klarna, Afterpay, Affirm, Sezzle, Zip, and PayPal Credit.

## Features

- 🎨 **Customizable Widget**: Configurable placement, styling, and providers
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🌐 **Internationalization**: Multi-language support
- ♿ **Accessibility**: WCAG compliant with keyboard navigation
- 🎯 **Analytics**: Built-in tracking and event reporting
- 🔧 **Developer Friendly**: Easy to customize and extend

## Installation

### Prerequisites
- Shopify CLI 3.0+
- Node.js 16+
- A Shopify Partner account
- BADGR backend API running

### Setup

1. **Install dependencies**:
```bash
cd src/theme-extension
npm install
```

2. **Configure your app**:
```bash
shopify app configure
```

3. **Start development**:
```bash
npm run dev
```

## Usage

### As an App Block (Recommended)

1. **Add to theme**: Merchants can add the BADGR BNPL Widget through the theme editor
2. **Configure settings**: Use the theme editor to customize widget behavior
3. **Position widget**: Place on product pages where BNPL options should appear

### Programmatic Usage

Use the provided snippet for custom implementations:

```liquid
{% render 'badgr-widget-embed', 
   product: product, 
   widget_id: 'my-widget',
   placement: 'below_price',
   enabled_providers: 'klarna,afterpay,affirm',
   show_logos: true,
   custom_text: 'Choose your payment method:' %}
```

## Configuration

### Widget Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `widget_id` | string | 'default' | Unique identifier for this widget |
| `show_logos` | boolean | true | Display provider logos |
| `placement` | string | 'below_price' | Widget position on page |
| `enabled_providers` | array | [] | List of enabled BNPL providers |
| `custom_text` | string | '' | Custom text above options |
| `loading_text` | string | 'Loading...' | Loading state text |

### Placement Options

- `above_price` - Above product price
- `below_price` - Below product price  
- `below_add_to_cart` - Below add to cart button
- `custom` - Custom position (requires theme modification)

### Supported Providers

- **Klarna** - Pay in 4 interest-free installments
- **Afterpay** - Pay in 4 fortnightly payments
- **Affirm** - Monthly payment plans
- **Sezzle** - Pay in 4 over 6 weeks
- **Zip** - Pay in 4 interest-free
- **PayPal Credit** - PayPal Pay in 4

## Customization

### Styling

The widget uses CSS custom properties for easy theming:

```css
.badgr-bnpl-widget {
  --badgr-primary-color: #007ace;
  --badgr-border-radius: 8px;
  --badgr-spacing: 1rem;
}
```

### JavaScript API

Access the widget programmatically:

```javascript
// Initialize widgets manually
window.BADGR.initWidgets();

// Create a new widget instance
const widget = new window.BADGR.Widget(element);

// Listen for widget events
document.addEventListener('badgr:widget:loaded', (event) => {
  console.log('Widget loaded:', event.detail);
});
```

### Events

The widget dispatches custom events:

- `badgr:widget:loaded` - Widget successfully loaded
- `badgr:option:selected` - Payment option selected
- `badgr:error` - Widget error occurred

## API Integration

The widget communicates with the BADGR backend API:

### Endpoints

- `POST /api/widgets/{widgetId}/options` - Fetch BNPL options
- `POST /api/track` - Analytics tracking

### Request Format

```json
{
  "productId": "123456789",
  "price": 99.99,
  "currency": "USD", 
  "enabledProviders": ["klarna", "afterpay"],
  "placement": "below_price"
}
```

### Response Format

```json
{
  "options": [
    {
      "provider": "klarna",
      "displayName": "Klarna",
      "logoUrl": "https://example.com/klarna-logo.svg",
      "installmentText": "4 payments of $25.00",
      "terms": "Interest-free",
      "isEligible": true,
      "redirectUrl": "https://klarna.com/checkout/..."
    }
  ]
}
```

## Development

### File Structure

```
src/theme-extension/
├── shopify.extension.toml    # Extension configuration
├── blocks/
│   └── bnpl-widget.liquid    # Main app block
├── assets/
│   ├── badgr-widget.css      # Widget styles
│   └── badgr-widget.js       # Widget functionality
├── snippets/
│   ├── badgr-widget-embed.liquid     # Embed snippet
│   └── badgr-provider-info.liquid    # Provider info snippet
├── locales/
│   └── en.default.json       # English translations
└── package.json              # Dependencies and scripts
```

### Build Process

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Deploy to Shopify
npm run deploy
```

### Testing

Test the extension in development stores:

1. Create a development store
2. Install the app
3. Add the widget to product pages
4. Test with different products and configurations

## Troubleshooting

### Common Issues

**Widget not loading**
- Check that BADGR backend API is accessible
- Verify widget configuration in theme editor
- Check browser console for JavaScript errors

**Styling issues**
- Ensure CSS is properly loaded
- Check for theme conflicts
- Verify responsive breakpoints

**API errors**
- Confirm API endpoint URLs
- Check authentication/authorization
- Verify request/response formats

### Debug Mode

Enable debug logging:

```javascript
window.BADGR_DEBUG = true;
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- All API requests include shop domain validation
- No sensitive data stored in localStorage
- HTTPS required for production
- Content Security Policy compliant

## Performance

- Lazy loading for images
- Minimal JavaScript bundle size
- Efficient CSS with minimal specificity
- Debounced API requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, contact:
- Email: support@badgr.app
- Documentation: https://docs.badgr.app
- GitHub Issues: https://github.com/badgr/theme-extension/issues 