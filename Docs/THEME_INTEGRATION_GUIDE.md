# BADGR Theme Integration Guide

## Overview

This guide helps merchants integrate the BADGR widget seamlessly with their Shopify theme and customize its appearance to match their store's branding. Whether you're using a popular theme like Dawn, Debut, or Brooklyn, or a custom theme, this guide will help you achieve the perfect integration.

## Table of Contents

1. [Quick Start Integration](#quick-start-integration)
2. [Theme Compatibility](#theme-compatibility)
3. [Widget Placement Optimization](#widget-placement-optimization)
4. [Visual Customization](#visual-customization)
5. [Brand Matching](#brand-matching)
6. [Theme-Specific Configurations](#theme-specific-configurations)
7. [Advanced Customization](#advanced-customization)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Quick Start Integration

### Step 1: Install the Widget Block

1. Navigate to **Online Store > Themes** in your Shopify admin
2. Click **Customize** on your active theme
3. Go to any product page in the preview
4. Click **Add block** in the product section
5. Find **BADGR BNPL Widget** in the **Apps** section
6. Click to add it to your product page

### Step 2: Configure Basic Settings

Once added, you'll see these options in the theme editor:

- **Widget ID**: Leave as "default" unless you have multiple widgets
- **Show provider logos**: Toggle to show/hide BNPL provider logos
- **Widget placement**: Choose from predefined positions
- **Custom text**: Add optional text above payment options
- **Loading text**: Customize the loading message

### Step 3: Preview and Test

1. Preview the product page to see the widget in action
2. Test on different devices using the mobile preview
3. Check various product price points
4. Save your changes when satisfied

---

## Theme Compatibility

### Supported Theme Types

The BADGR widget is designed to work with all modern Shopify themes:

#### ✅ **Fully Compatible**
- **Dawn** (Shopify's default theme)
- **Debut** (Legacy default theme)
- **Brooklyn** (Popular free theme)
- **Narrative** (Storytelling theme)
- **Simple** (Minimalist theme)
- **Supply** (Clean, modern theme)
- **Venture** (Bold, image-focused theme)

#### ✅ **Compatible with Minor Adjustments**
- **Boundless** (May need custom placement)
- **Minimal** (May need color adjustments)
- **Express** (May need spacing adjustments)
- **Pop** (May need logo sizing)

#### ⚠️ **Requires Custom CSS**
- **Vintage** (Legacy theme structure)
- **Icon** (Unique layout requirements)
- **Timber** (Legacy framework)
- **Custom themes** (Varies by implementation)

### Checking Your Theme Compatibility

1. **Modern Themes (2019+)**: Usually work out-of-the-box
2. **Legacy Themes (Pre-2019)**: May need custom CSS
3. **Heavily Modified Themes**: May require developer assistance

### Quick Compatibility Test

After installing the widget:

1. ✅ **Widget appears correctly** → You're good to go!
2. ⚠️ **Widget appears but looks off** → Use visual customization section
3. ❌ **Widget doesn't appear** → Check troubleshooting section

---

## Widget Placement Optimization

### Understanding Placement Options

#### **Above Price** 
- **Best for**: Clean, minimalist themes
- **Placement**: Directly above product price
- **Impact**: High visibility, draws attention before pricing

#### **Below Price** (Recommended)
- **Best for**: Most themes and layouts
- **Placement**: Between price and add-to-cart button
- **Impact**: Natural flow, doesn't interfere with purchase decision

#### **Below Add to Cart**
- **Best for**: Themes with compact product sections
- **Placement**: After the add-to-cart button
- **Impact**: Provides financing options after initial purchase intent

#### **Custom Position**
- **Best for**: Advanced users and custom themes
- **Placement**: Manual positioning using liquid code
- **Impact**: Complete control over widget location

### Placement Recommendations by Theme

| Theme | Recommended Placement | Alternative |
|-------|----------------------|------------|
| Dawn | Below Price | Above Price |
| Debut | Below Price | Below Add to Cart |
| Brooklyn | Below Add to Cart | Below Price |
| Narrative | Below Price | Above Price |
| Simple | Above Price | Below Price |
| Supply | Below Price | Below Add to Cart |
| Venture | Below Add to Cart | Below Price |

### Mobile Placement Considerations

On mobile devices, the widget automatically adjusts:
- **Stacks vertically** for better touch interaction
- **Larger touch targets** for easier selection
- **Optimized spacing** for mobile viewport

---

## Visual Customization

### Basic Color Customization

Add this CSS to your theme's custom CSS section:

```css
/* Match your brand colors */
.badgr-bnpl-widget {
  background-color: #your-background-color;
  border-color: #your-border-color;
}

/* Customize button colors */
.badgr-bnpl-option {
  background-color: #your-option-background;
  border-color: #your-option-border;
}

.badgr-bnpl-option:hover {
  background-color: #your-hover-color;
  border-color: #your-hover-border;
}

/* Customize text colors */
.badgr-bnpl-text {
  color: #your-text-color;
}

.badgr-bnpl-price {
  color: #your-price-color;
}
```

### Font Customization

Match your theme's typography:

```css
.badgr-bnpl-widget {
  font-family: 'Your Theme Font', sans-serif;
  font-size: 14px; /* Adjust as needed */
}

.badgr-bnpl-price {
  font-weight: 600; /* Match your price font weight */
  font-size: 16px; /* Adjust price text size */
}

.badgr-bnpl-terms {
  font-size: 12px; /* Adjust terms text size */
  font-style: italic; /* Optional styling */
}
```

### Spacing and Layout

Adjust spacing to match your theme:

```css
/* Widget container spacing */
.badgr-bnpl-widget {
  margin: 20px 0; /* Top and bottom margin */
  padding: 15px; /* Internal padding */
}

/* Option spacing */
.badgr-bnpl-option {
  padding: 12px 15px; /* Internal padding */
  margin-bottom: 8px; /* Space between options */
}

/* Gap between options */
.badgr-bnpl-options {
  gap: 10px; /* Space between payment options */
}
```

### Border and Radius Customization

Match your theme's design language:

```css
/* Rounded corners */
.badgr-bnpl-widget {
  border-radius: 12px; /* Adjust roundness */
}

.badgr-bnpl-option {
  border-radius: 8px; /* Option roundness */
}

/* Remove borders for minimal look */
.badgr-bnpl-widget {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

---

## Brand Matching

### Color Scheme Integration

#### **For Monochromatic Themes**

```css
/* Grayscale theme adaptation */
.badgr-bnpl-widget {
  background-color: #f8f8f8;
  border-color: #e0e0e0;
}

.badgr-bnpl-option {
  background-color: white;
  border-color: #d0d0d0;
}

.badgr-bnpl-option:hover {
  background-color: #f5f5f5;
  border-color: #999999;
}
```

#### **For Colorful/Vibrant Themes**

```css
/* Vibrant theme adaptation */
.badgr-bnpl-widget {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
  border: 2px solid #your-accent-color;
}

.badgr-bnpl-option {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #your-accent-color;
}

.badgr-bnpl-option:hover {
  background-color: #your-accent-color;
  color: white;
}
```

#### **For Dark Themes**

```css
/* Dark theme adaptation */
.badgr-bnpl-widget {
  background-color: #2a2a2a;
  border-color: #444444;
  color: #ffffff;
}

.badgr-bnpl-option {
  background-color: #333333;
  border-color: #555555;
  color: #ffffff;
}

.badgr-bnpl-option:hover {
  background-color: #404040;
  border-color: #666666;
}

.badgr-bnpl-text {
  color: #ffffff;
}

.badgr-bnpl-terms {
  color: #cccccc;
}
```

### Logo and Visual Elements

#### **Customizing Provider Logos**

```css
/* Resize logos for your theme */
.badgr-bnpl-logo {
  width: 80px; /* Adjust width */
  height: 30px; /* Adjust height */
  filter: grayscale(100%); /* Grayscale for minimal themes */
}

/* Logo hover effects */
.badgr-bnpl-option:hover .badgr-bnpl-logo {
  filter: grayscale(0%); /* Full color on hover */
  transform: scale(1.05); /* Slight zoom effect */
}
```

#### **Hide Logos for Text-Only Style**

```css
/* Text-only style */
.badgr-bnpl-logo {
  display: none;
}

.badgr-bnpl-option {
  padding-left: 15px; /* Remove logo space */
}
```

---

## Theme-Specific Configurations

### Dawn Theme (Shopify Default)

```css
/* Dawn theme optimization */
.badgr-bnpl-widget {
  background-color: rgb(247, 248, 250);
  border: 1px solid rgb(225, 227, 229);
  border-radius: 12px;
  font-family: var(--font-body-family);
}

.badgr-bnpl-option {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(225, 227, 229);
  border-radius: 8px;
}

.badgr-bnpl-option:hover {
  border-color: rgb(51, 79, 180);
  box-shadow: 0 0 0 2px rgba(51, 79, 180, 0.2);
}

.badgr-bnpl-price {
  color: rgb(51, 79, 180);
  font-weight: 500;
}
```

### Debut Theme

```css
/* Debut theme optimization */
.badgr-bnpl-widget {
  background-color: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  font-family: "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.badgr-bnpl-option {
  background-color: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
}

.badgr-bnpl-option:hover {
  border-color: #3a3a3a;
  background-color: #f8f8f8;
}

.badgr-bnpl-price {
  color: #3a3a3a;
  font-weight: 600;
}
```

### Brooklyn Theme

```css
/* Brooklyn theme optimization */
.badgr-bnpl-widget {
  background-color: #f7f7f7;
  border: 2px solid #e0e0e0;
  border-radius: 0; /* Brooklyn uses square corners */
  font-family: 'Lato', sans-serif;
}

.badgr-bnpl-option {
  background-color: #ffffff;
  border: 1px solid #d0d0d0;
  border-radius: 0;
}

.badgr-bnpl-option:hover {
  background-color: #333333;
  color: #ffffff;
}

.badgr-bnpl-price {
  color: #333333;
  font-weight: 700;
}
```

### Narrative Theme

```css
/* Narrative theme optimization */
.badgr-bnpl-widget {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-family: 'Lora', serif;
}

.badgr-bnpl-option {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.badgr-bnpl-option:hover {
  border-color: #a67c00;
  background-color: #fff8e1;
}

.badgr-bnpl-price {
  color: #a67c00;
  font-weight: 500;
}
```

---

## Advanced Customization

### Custom CSS Variables

Create a cohesive look using CSS variables:

```css
:root {
  --badgr-primary-color: #your-primary-color;
  --badgr-secondary-color: #your-secondary-color;
  --badgr-text-color: #your-text-color;
  --badgr-border-color: #your-border-color;
  --badgr-hover-color: #your-hover-color;
  --badgr-border-radius: 8px;
  --badgr-font-family: 'Your Font', sans-serif;
}

.badgr-bnpl-widget {
  background-color: var(--badgr-secondary-color);
  border-color: var(--badgr-border-color);
  border-radius: var(--badgr-border-radius);
  font-family: var(--badgr-font-family);
}

.badgr-bnpl-option {
  border-color: var(--badgr-border-color);
  border-radius: var(--badgr-border-radius);
}

.badgr-bnpl-option:hover {
  border-color: var(--badgr-primary-color);
  background-color: var(--badgr-hover-color);
}

.badgr-bnpl-price {
  color: var(--badgr-primary-color);
}
```

### Responsive Customization

Fine-tune for different screen sizes:

```css
/* Desktop styles */
@media (min-width: 769px) {
  .badgr-bnpl-widget {
    max-width: 400px;
  }
  
  .badgr-bnpl-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}

/* Tablet styles */
@media (max-width: 768px) and (min-width: 481px) {
  .badgr-bnpl-widget {
    margin: 15px 0;
  }
  
  .badgr-bnpl-option {
    padding: 10px 12px;
  }
}

/* Mobile styles */
@media (max-width: 480px) {
  .badgr-bnpl-widget {
    margin: 10px 0;
    padding: 10px;
  }
  
  .badgr-bnpl-option {
    padding: 12px 10px;
    font-size: 14px;
  }
  
  .badgr-bnpl-logo {
    width: 50px;
    height: 20px;
  }
}
```

### Animation and Transitions

Add smooth animations:

```css
/* Smooth transitions */
.badgr-bnpl-widget {
  transition: all 0.3s ease;
}

.badgr-bnpl-option {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.badgr-bnpl-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Fade-in animation */
.badgr-bnpl-widget {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### **Widget Not Appearing**

1. **Check App Installation**
   - Ensure BADGR app is installed and enabled
   - Verify app permissions are granted

2. **Verify Block Addition**
   - Confirm widget block is added to product template
   - Check if widget is enabled in app settings

3. **Theme Compatibility**
   - Some themes may need custom positioning
   - Check browser console for JavaScript errors

#### **Widget Appears But Looks Wrong**

1. **Theme CSS Conflicts**
   ```css
   /* Override theme styles */
   .badgr-bnpl-widget {
     all: initial;
     display: block;
     /* Add your custom styles */
   }
   ```

2. **Positioning Issues**
   - Try different placement options
   - Use custom position if needed

3. **Responsive Problems**
   - Add mobile-specific CSS
   - Test on actual devices

#### **Widget Doesn't Load Payment Options**

1. **Check Network Connection**
   - Ensure store can reach BADGR API
   - Check for ad blockers or security software

2. **Verify Configuration**
   - Check enabled providers in app settings
   - Ensure product meets minimum requirements

3. **Debug Mode**
   ```javascript
   // Add to theme's script file
   window.BADGR_DEBUG = true;
   ```

#### **Styling Doesn't Apply**

1. **CSS Specificity**
   ```css
   /* Use more specific selectors */
   .product-form .badgr-bnpl-widget {
     /* Your styles */
   }
   
   /* Or use !important (last resort) */
   .badgr-bnpl-widget {
     background-color: #your-color !important;
   }
   ```

2. **CSS Loading Order**
   - Ensure custom CSS loads after theme CSS
   - Place custom CSS in theme's custom CSS section

### Theme-Specific Troubleshooting

#### **Dawn Theme Issues**
- **Problem**: Widget appears too wide
- **Solution**: Add `max-width: 100%` to widget container

#### **Debut Theme Issues**
- **Problem**: Widget text too small
- **Solution**: Increase font-size in widget CSS

#### **Brooklyn Theme Issues**
- **Problem**: Widget doesn't match theme style
- **Solution**: Remove border-radius and adjust colors

#### **Vintage Theme Issues**
- **Problem**: Widget doesn't position correctly
- **Solution**: Use custom positioning and z-index

---

## Best Practices

### Design Guidelines

1. **Maintain Visual Hierarchy**
   - Widget should complement, not compete with product information
   - Use consistent spacing and alignment

2. **Ensure Accessibility**
   - Maintain proper color contrast
   - Provide keyboard navigation
   - Include proper ARIA labels

3. **Mobile-First Approach**
   - Design for mobile first, then enhance for desktop
   - Use touch-friendly buttons and spacing

4. **Performance Optimization**
   - Minimize custom CSS
   - Use efficient selectors
   - Avoid heavy animations

### Testing Recommendations

1. **Cross-Device Testing**
   - Test on various mobile devices
   - Check tablet and desktop views
   - Verify touch interactions

2. **Browser Compatibility**
   - Test in Chrome, Firefox, Safari, Edge
   - Check older browser versions if needed

3. **Performance Testing**
   - Monitor page load times
   - Test with slow connections
   - Ensure widget doesn't block page rendering

4. **User Testing**
   - Get feedback from actual customers
   - Test with different user scenarios
   - Monitor conversion impact

### Maintenance Tips

1. **Regular Updates**
   - Keep widget updated with latest version
   - Review and update custom CSS as needed

2. **Monitoring**
   - Check widget performance regularly
   - Monitor for theme update impacts

3. **Documentation**
   - Document custom CSS changes
   - Keep record of theme-specific modifications

---

## Next Steps

After completing your theme integration:

1. **Test thoroughly** across devices and browsers
2. **Monitor performance** and user engagement
3. **Gather feedback** from customers
4. **Review analytics** to measure impact
5. **Consider A/B testing** different placements and styles

For additional support:
- Check the [Configuration Guide](CONFIGURATION_GUIDE.md) for advanced settings
- Review [Daily Usage Guide](DAILY_USAGE_GUIDE.md) for ongoing management
- Contact BADGR support through the app admin for technical assistance

---

*This guide is part of the BADGR documentation suite. For the most up-to-date information, please check the app admin panel or contact support.* 