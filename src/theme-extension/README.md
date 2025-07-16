# BADGR Theme App Extension

A Shopify Theme App Extension that displays Buy Now Pay Later (BNPL) options on product pages, helping merchants offer flexible payment solutions to their customers.

## Overview

The BADGR widget integrates seamlessly with Shopify themes to display financing options from major BNPL providers including Klarna, Afterpay, Affirm, Sezzle, Zip, and PayPal Credit. The widget automatically calculates payment options based on product price and merchant configuration.

## Features

- **🏪 Multi-Provider Support**: Klarna, Afterpay, Affirm, Sezzle, Zip, PayPal Credit
- **📱 Responsive Design**: Works perfectly on mobile and desktop
- **🎨 Theme Compatible**: Integrates with any Shopify theme
- **⚡ Fast Loading**: Lightweight and optimized for performance
- **♿ Accessible**: WCAG compliant with keyboard navigation
- **🌍 Cross-Browser**: Works in all modern browsers
- **⚙️ Configurable**: Flexible placement and styling options

## Installation

1. Install the BADGR app from the Shopify App Store
2. Configure your BNPL provider settings in the app admin
3. Add the widget block to your product pages via the theme editor

## Theme Editor Configuration

### Adding the Widget Block

1. Go to **Online Store > Themes** in your Shopify admin
2. Click **Customize** on your active theme
3. Navigate to a product page
4. Click **Add block** in the product section
5. Select **BADGR BNPL Widget** from the app blocks
6. Configure the widget settings

### Widget Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Widget ID** | Unique identifier for this widget instance | `default` |
| **Show provider logos** | Display BNPL provider logos | `true` |
| **Widget placement** | Where to position the widget | `Below price` |
| **Enabled providers** | Which BNPL providers to show | All enabled |
| **Custom text** | Optional text above payment options | Empty |
| **Loading text** | Text shown while loading | `Loading payment options...` |

### Placement Options

- **Above price**: Displays the widget above the product price
- **Below price**: Displays the widget below the product price (recommended)
- **Below add to cart**: Displays the widget below the add to cart button
- **Custom position**: Manual positioning (no automatic placement)

## API Configuration

The widget automatically syncs with your BADGR app configuration, but you can also override settings programmatically:

```javascript
// Override API URL for custom deployments
window.BADGR_API_URL = 'https://your-api-domain.com/api';

// Enable debug mode for troubleshooting
window.BADGR_DEBUG = true;
```

## File Structure

```
src/theme-extension/
├── shopify.extension.toml    # Extension configuration
├── README.md                 # This file
├── WIDGET_DOCUMENTATION.md   # Technical documentation
├── BROWSER_TESTING.md        # Cross-browser testing guide
├── blocks/
│   └── bnpl-widget.liquid    # Widget block template
├── assets/
│   ├── badgr-widget.js       # Widget JavaScript
│   ├── badgr-widget.css      # Widget styles
│   └── *.svg                 # Provider logos
└── snippets/
    └── badgr-widget-embed.liquid  # Embed snippet (optional)
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| IE | 11 | ⚠️ Limited |

## Customization

### Styling

You can customize the widget appearance using CSS:

```css
/* Override widget container styling */
.badgr-bnpl-widget {
  border: 2px solid #your-brand-color;
  border-radius: 12px;
}

/* Customize option buttons */
.badgr-bnpl-option {
  background: #your-background-color;
}

/* Provider-specific styling */
.badgr-bnpl-option[data-provider="klarna"] {
  border-color: #ff0080;
}
```

### Placement Customization

For advanced placement control, you can use the custom position option and place the widget block exactly where you want it in your theme.

### Event Handling

Listen to widget events for custom analytics:

```javascript
document.addEventListener('badgr:widget:loaded', (event) => {
  console.log('Widget loaded:', event.detail);
});

document.addEventListener('badgr:option:selected', (event) => {
  console.log('Option selected:', event.detail);
  // Custom analytics tracking
});
```

## Troubleshooting

### Widget Not Appearing

1. **Check Theme Compatibility**: Ensure your theme supports app blocks
2. **Verify Installation**: Confirm the BADGR app is installed and enabled
3. **Check Configuration**: Verify widget is enabled in app settings
4. **Browser Console**: Look for JavaScript errors in developer tools

### Incorrect Placement

1. **Theme Selectors**: Some themes may need custom CSS selectors
2. **Multiple Widgets**: Ensure only one widget per product page
3. **CSS Conflicts**: Check for theme CSS overrides

### API Errors

1. **Network Connectivity**: Verify internet connection
2. **App Configuration**: Check BNPL provider settings in app admin
3. **Product Eligibility**: Confirm product meets provider requirements

### Debug Mode

Enable detailed logging for troubleshooting:

```javascript
window.BADGR_DEBUG = true;
```

Then check the browser console for detailed information about widget initialization, API calls, and placement logic.

## Performance

The widget is optimized for performance:

- **Lightweight**: ~15KB total (JS + CSS)
- **Async Loading**: Non-blocking initialization
- **Cached Assets**: Provider logos cached by browser
- **Minimal DOM**: Efficient rendering with minimal reflows

## Accessibility

The widget follows WCAG guidelines:

- **Keyboard Navigation**: Full keyboard support with proper tab order
- **Screen Readers**: ARIA labels and roles for all interactive elements
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Meets WCAG contrast requirements

## Analytics

The widget automatically tracks:

- Widget load events
- Option selection events
- Provider click-through rates
- Error occurrences

Data is sent to:
- Shopify Analytics (if available)
- Google Analytics (if configured)
- BADGR analytics endpoint

## Support

For technical issues or questions:

1. Check the [WIDGET_DOCUMENTATION.md](WIDGET_DOCUMENTATION.md) for detailed technical information
2. Review [BROWSER_TESTING.md](BROWSER_TESTING.md) for compatibility issues
3. Contact BADGR support through the app admin
4. Submit issues on our GitHub repository

## Changelog

### v1.3.0 (Latest)
- Enhanced API integration with dynamic configuration
- Improved placement handling for theme compatibility
- Added comprehensive cross-browser support
- Performance optimizations and error handling

### v1.2.0
- Added intelligent placement system
- Enhanced provider detection
- Improved mobile responsiveness

### v1.1.0
- Cross-browser compatibility improvements
- Added accessibility features
- Enhanced error handling

### v1.0.0
- Initial release
- Basic BNPL widget functionality
- Theme integration support

## License

This extension is part of the BADGR application and is licensed under the MIT License. 