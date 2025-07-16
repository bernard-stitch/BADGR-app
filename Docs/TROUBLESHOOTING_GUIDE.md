# BADGR Troubleshooting Guide

## Overview

This guide helps merchants quickly identify and resolve common issues with the BADGR app. Before contacting support, try these step-by-step solutions to get your BNPL widget working perfectly.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Installation Issues](#installation-issues)
3. [Configuration Problems](#configuration-problems)
4. [Widget Display Issues](#widget-display-issues)
5. [API and Connectivity Issues](#api-and-connectivity-issues)
6. [Theme Compatibility Issues](#theme-compatibility-issues)
7. [Browser Compatibility Issues](#browser-compatibility-issues)
8. [Performance Issues](#performance-issues)
9. [Mobile and Responsive Issues](#mobile-and-responsive-issues)
10. [Error Messages and Meanings](#error-messages-and-meanings)
11. [Advanced Troubleshooting](#advanced-troubleshooting)
12. [Getting Additional Help](#getting-additional-help)

---

## Quick Diagnostics

### 🔍 **30-Second Health Check**

Before diving into specific issues, run through this quick checklist:

1. **✅ App Status**: Is the BADGR app installed and enabled in your Shopify admin?
2. **✅ Widget Added**: Is the BADGR widget block added to your product pages?
3. **✅ Settings Configured**: Are your BNPL providers enabled in the app settings?
4. **✅ Internet Connection**: Is your store accessible and internet connection stable?
5. **✅ Browser Console**: Are there any red error messages in your browser's developer tools?

### 🚨 **Emergency Reset**

If nothing is working, try this emergency reset:

1. Remove the BADGR widget block from your theme
2. Wait 30 seconds
3. Re-add the widget block
4. Save your theme
5. Test the widget on a fresh browser tab

---

## Installation Issues

### ❌ **"App Not Found" in Shopify App Store**

**Problem**: Can't find BADGR in the Shopify App Store
**Solutions**:
1. **Check Search Terms**: Try searching for "BADGR", "BNPL", or "Buy Now Pay Later"
2. **Clear Browser Cache**: Clear your browser cache and cookies
3. **Try Different Browser**: Use Chrome, Firefox, or Safari
4. **Check Store Eligibility**: Ensure your store meets Shopify's requirements
5. **VPN/Location**: Disable VPN if using one

### ❌ **"Installation Failed" Error**

**Problem**: App installation fails during the process
**Solutions**:
1. **Retry Installation**: Wait 5 minutes and try again
2. **Check Permissions**: Ensure you have admin permissions on your Shopify store
3. **Browser Issues**: Try a different browser or incognito mode
4. **Shopify Status**: Check [Shopify Status](https://status.shopify.com/) for outages
5. **Store Limits**: Verify you haven't reached your app installation limit

### ❌ **"Permission Denied" During Installation**

**Problem**: Permission errors during app installation
**Solutions**:
1. **Admin Rights**: Ensure you're logged in as a store owner or admin
2. **Staff Permissions**: If you're staff, ask the owner to grant app installation permissions
3. **Session Timeout**: Log out and log back into Shopify admin
4. **Clear Session**: Clear browser cookies for myshopify.com

### ❌ **App Installed But Not Visible**

**Problem**: App appears installed but can't access it
**Solutions**:
1. **Refresh Admin**: Hard refresh your Shopify admin (Ctrl+F5 or Cmd+Shift+R)
2. **Check App List**: Look for BADGR in your Apps section
3. **Browser Extensions**: Disable browser extensions that might block the app
4. **Wait Period**: Sometimes apps take 2-3 minutes to appear after installation

---

## Configuration Problems

### ❌ **Settings Not Saving**

**Problem**: Configuration changes don't save or revert
**Solutions**:
1. **Complete Form**: Ensure all required fields are filled
2. **Internet Connection**: Check your connection during save
3. **Session Timeout**: Refresh the page and try again
4. **Browser Issues**: Clear cache or try a different browser
5. **Conflict Check**: Disable other BNPL apps that might conflict

### ❌ **BNPL Providers Not Showing**

**Problem**: No BNPL options appear in configuration
**Solutions**:
1. **Enable Providers**: Go to Settings > BNPL Options and enable providers
2. **Account Status**: Verify your accounts with providers (Klarna, Afterpay, etc.)
3. **Geographic Restrictions**: Check if providers are available in your region
4. **Store Currency**: Ensure providers support your store currency
5. **Refresh Settings**: Save settings again and refresh the page

### ❌ **Logo Selection Problems**

**Problem**: Can't select or change provider logos
**Solutions**:
1. **Logo Library**: Use the predefined logo library instead of custom uploads
2. **File Format**: If uploading, use SVG, PNG, or JPG formats
3. **File Size**: Keep logo files under 100KB
4. **Clear Cache**: Clear browser cache and try again
5. **Default Selection**: Try selecting "Default" and then your preferred option

### ❌ **Widget Placement Not Working**

**Problem**: Widget doesn't appear in the selected placement
**Solutions**:
1. **Theme Compatibility**: Check if your theme supports the chosen placement
2. **Block Addition**: Ensure the widget block is added to your product template
3. **Placement Options**: Try different placement options
4. **Custom Position**: Use custom positioning for advanced control
5. **Theme Update**: Update your theme if it's outdated

---

## Widget Display Issues

### ❌ **Widget Not Appearing on Product Pages**

**Problem**: Widget completely missing from product pages
**Solutions**:
1. **Block Addition**: Add the BADGR widget block to your product template
   - Go to Online Store > Themes > Customize
   - Navigate to a product page
   - Add the BADGR BNPL Widget block
2. **Widget Enabled**: Check that the widget is enabled in app settings
3. **Product Eligibility**: Verify products meet minimum price requirements
4. **Theme Compatibility**: Some themes may need custom positioning
5. **JavaScript Errors**: Check browser console for JavaScript errors

### ❌ **Widget Appears But Shows No Options**

**Problem**: Widget container shows but no BNPL options inside
**Solutions**:
1. **Provider Settings**: Enable at least one BNPL provider in settings
2. **API Connection**: Check if your store can connect to BADGR API
3. **Product Price**: Ensure product has a valid price set
4. **Currency Support**: Verify your currency is supported by enabled providers
5. **Debug Mode**: Enable debug mode to see detailed error messages

### ❌ **Widget Styling Looks Wrong**

**Problem**: Widget appears but doesn't match your theme
**Solutions**:
1. **Theme CSS**: Add custom CSS to match your theme colors
2. **Theme Update**: Update your theme to the latest version
3. **Cache Clear**: Clear your browser cache and theme cache
4. **CSS Conflicts**: Check for CSS conflicts with other apps
5. **Mobile View**: Test on different devices for responsive issues

### ❌ **Widget Positioning Issues**

**Problem**: Widget appears in wrong location or overlaps content
**Solutions**:
1. **Placement Setting**: Try different placement options in theme editor
2. **Custom Position**: Use custom positioning for precise control
3. **Theme Structure**: Some themes may need developer assistance
4. **Z-Index Issues**: Check for CSS z-index conflicts
5. **Mobile Layout**: Test positioning on mobile devices

---

## API and Connectivity Issues

### ❌ **"Failed to Load Widget Configuration" Error**

**Problem**: Widget can't connect to BADGR API
**Solutions**:
1. **Internet Connection**: Check your store's internet connectivity
2. **Firewall Settings**: Ensure BADGR API isn't blocked by firewall
3. **Ad Blockers**: Disable ad blockers or privacy extensions
4. **DNS Issues**: Try accessing your store from different network
5. **API Status**: Check if BADGR API is experiencing issues

### ❌ **"Network Error" Messages**

**Problem**: Various network-related errors
**Solutions**:
1. **Retry Logic**: Most errors resolve automatically after retry
2. **Browser Refresh**: Hard refresh the page (Ctrl+F5)
3. **Different Browser**: Try Chrome, Firefox, or Safari
4. **Network Reset**: Restart your router/modem
5. **VPN Issues**: Disable VPN if using one

### ❌ **API Calls Timing Out**

**Problem**: Slow or failed API responses
**Solutions**:
1. **Wait Period**: Allow 30-60 seconds for slow connections
2. **Retry Later**: Try again during off-peak hours
3. **Cache Clear**: Clear browser cache and try again
4. **Connection Speed**: Test your internet connection speed
5. **Server Issues**: Check if there are known server issues

### ❌ **"Invalid Shop Domain" Error**

**Problem**: API can't identify your shop
**Solutions**:
1. **Domain Verification**: Ensure your shop domain is correctly configured
2. **SSL Certificate**: Verify your store has a valid SSL certificate
3. **DNS Propagation**: Wait 24-48 hours after domain changes
4. **Shopify Settings**: Check your domain settings in Shopify admin
5. **App Reinstall**: Try uninstalling and reinstalling the app

---

## Theme Compatibility Issues

### ❌ **Widget Doesn't Work with My Theme**

**Problem**: Widget incompatible with specific theme
**Solutions**:
1. **Theme Version**: Update to the latest version of your theme
2. **Block Support**: Ensure your theme supports Shopify app blocks
3. **Manual Integration**: Use custom positioning for older themes
4. **Theme Developer**: Contact your theme developer for assistance
5. **Theme Switch**: Test with a default Shopify theme to isolate issues

### ❌ **Widget Breaks Theme Layout**

**Problem**: Widget disrupts page layout or styling
**Solutions**:
1. **CSS Isolation**: Add CSS to isolate widget styles
2. **Custom Placement**: Use custom positioning to avoid conflicts
3. **Theme CSS**: Override theme CSS that conflicts with widget
4. **Mobile Testing**: Test on mobile devices for responsive issues
5. **Theme Support**: Contact theme developer for compatibility

### ❌ **Popular Theme Issues**

#### **Dawn Theme**
- **Issue**: Widget appears too wide
- **Solution**: Add `max-width: 100%` to widget container

#### **Debut Theme**
- **Issue**: Widget text appears too small
- **Solution**: Increase font-size in widget CSS

#### **Brooklyn Theme**
- **Issue**: Widget doesn't match theme style
- **Solution**: Remove border-radius and adjust colors

#### **Vintage Theme**
- **Issue**: Widget doesn't position correctly
- **Solution**: Use custom positioning with z-index

#### **Custom Themes**
- **Issue**: Unpredictable behavior
- **Solution**: Test with default theme first, then customize

---

## Browser Compatibility Issues

### ❌ **Widget Doesn't Work in Internet Explorer**

**Problem**: IE11 compatibility issues
**Solutions**:
1. **Browser Upgrade**: Recommend customers use modern browsers
2. **Basic Functionality**: IE11 has limited support (no animations)
3. **Fallback Mode**: Widget shows basic version in IE11
4. **Alternative Solutions**: Consider separate IE11 solution
5. **Usage Statistics**: Check your IE11 traffic to decide importance

### ❌ **Safari Issues**

**Problem**: Widget behaves differently in Safari
**Solutions**:
1. **Safari Version**: Ensure Safari 12+ is being used
2. **WebKit Prefixes**: Check if CSS needs -webkit- prefixes
3. **Touch Targets**: Ensure touch targets are 44px minimum
4. **Font Rendering**: Adjust font rendering for WebKit
5. **Private Browsing**: Test in Safari private browsing mode

### ❌ **Mobile Browser Issues**

**Problem**: Widget doesn't work on mobile browsers
**Solutions**:
1. **Touch Events**: Ensure touch events are properly handled
2. **Viewport Size**: Check widget responds to viewport changes
3. **Mobile CSS**: Add mobile-specific CSS rules
4. **Touch Targets**: Increase button/link sizes for mobile
5. **Orientation**: Test both portrait and landscape orientations

### ❌ **Firefox-Specific Issues**

**Problem**: Firefox rendering or behavior issues
**Solutions**:
1. **Firefox Version**: Ensure Firefox 55+ is being used
2. **Focus Rings**: Customize focus ring appearance
3. **Button Styling**: Apply -moz-appearance resets
4. **CSS Grid**: Check for CSS grid compatibility
5. **Developer Tools**: Use Firefox developer tools for debugging

---

## Performance Issues

### ❌ **Widget Loads Slowly**

**Problem**: Widget takes too long to appear
**Solutions**:
1. **API Optimization**: Enable caching in widget settings
2. **Image Optimization**: Use optimized SVG logos
3. **Lazy Loading**: Widget loads after main content
4. **Network Speed**: Test on different network connections
5. **CDN Issues**: Check if CDN is working properly

### ❌ **Widget Causes Page Lag**

**Problem**: Widget makes page feel slow or unresponsive
**Solutions**:
1. **Async Loading**: Widget loads asynchronously by default
2. **Resource Conflicts**: Check for conflicts with other scripts
3. **Memory Usage**: Monitor browser memory usage
4. **Event Listeners**: Ensure proper event listener cleanup
5. **Performance Audit**: Run Chrome DevTools performance audit

### ❌ **High Resource Usage**

**Problem**: Widget uses too much CPU or memory
**Solutions**:
1. **Script Optimization**: Widget is optimized for performance
2. **Multiple Widgets**: Avoid multiple widgets on same page
3. **Browser Extensions**: Disable resource-heavy extensions
4. **Device Limitations**: Consider device processing capabilities
5. **Monitoring**: Monitor resource usage in browser DevTools

---

## Mobile and Responsive Issues

### ❌ **Widget Doesn't Fit Mobile Screen**

**Problem**: Widget appears cut off or doesn't scale properly
**Solutions**:
1. **Responsive CSS**: Widget includes responsive CSS by default
2. **Viewport Meta**: Ensure proper viewport meta tag
3. **Touch Targets**: Buttons are automatically sized for mobile
4. **Orientation**: Test both portrait and landscape modes
5. **Device Testing**: Test on actual devices, not just browser simulation

### ❌ **Touch Interactions Don't Work**

**Problem**: Can't tap or interact with widget on mobile
**Solutions**:
1. **Touch Events**: Widget supports both click and touch events
2. **Button Size**: Ensure buttons are large enough (44px minimum)
3. **Overlay Issues**: Check for invisible overlays blocking touches
4. **CSS Pointer Events**: Verify pointer-events CSS property
5. **Device Zoom**: Test with different zoom levels

### ❌ **Widget Appears Differently on Mobile**

**Problem**: Mobile version looks different from desktop
**Solutions**:
1. **Responsive Design**: Different layouts are intentional for mobile
2. **Touch Optimization**: Mobile version optimized for touch
3. **Screen Size**: Adjusts automatically to screen size
4. **Custom CSS**: Add mobile-specific CSS if needed
5. **Testing**: Test on multiple mobile devices

---

## Error Messages and Meanings

### 🔴 **Common Error Messages**

#### **"Widget configuration not found"**
- **Meaning**: App can't find settings for your store
- **Solution**: Check app installation and configuration

#### **"Network request failed"**
- **Meaning**: Can't connect to BADGR API
- **Solution**: Check internet connection and try again

#### **"Invalid product price"**
- **Meaning**: Product price is missing or invalid
- **Solution**: Ensure product has valid price set

#### **"No BNPL providers enabled"**
- **Meaning**: No payment providers are configured
- **Solution**: Enable at least one provider in settings

#### **"Shop domain not configured"**
- **Meaning**: Store domain isn't properly set up
- **Solution**: Check app configuration and domain settings

#### **"Rate limit exceeded"**
- **Meaning**: Too many API requests too quickly
- **Solution**: Wait a few minutes and try again

#### **"Currency not supported"**
- **Meaning**: Your store currency isn't supported by providers
- **Solution**: Check supported currencies for each provider

#### **"Product not eligible"**
- **Meaning**: Product doesn't meet provider requirements
- **Solution**: Check minimum price and product type requirements

### 🟡 **Warning Messages**

#### **"Falling back to default settings"**
- **Meaning**: Using default settings due to API issues
- **Solution**: Usually resolves automatically

#### **"Limited browser support"**
- **Meaning**: Browser has limited widget functionality
- **Solution**: Recommend modern browser to customers

#### **"Slow network connection detected"**
- **Meaning**: API requests taking longer than usual
- **Solution**: Wait for slower connections

---

## Advanced Troubleshooting

### 🔧 **Developer Tools Debugging**

#### **Enable Debug Mode**
Add this to your theme's script files:
```javascript
window.BADGR_DEBUG = true;
```

#### **Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for BADGR-related errors
4. Check Network tab for API call failures

#### **Inspect Widget Element**
1. Right-click on widget area
2. Select "Inspect Element"
3. Check if widget HTML is present
4. Verify CSS styles are applied

### 🔧 **API Testing**

#### **Test API Endpoints**
```javascript
// Test configuration endpoint
fetch('/apps/badgr/api/widgets/your-shop-domain')
  .then(response => response.json())
  .then(data => console.log(data));
```

#### **Check Network Requests**
1. Open browser DevTools
2. Go to Network tab
3. Refresh page
4. Look for failed API requests

### 🔧 **Theme Code Inspection**

#### **Check Block Installation**
1. Go to theme code editor
2. Look for BADGR block in product template
3. Verify block settings are correct
4. Check for theme customizations

#### **Verify Liquid Template**
```liquid
{% comment %} Check for BADGR block {% endcomment %}
{% for block in section.blocks %}
  {% if block.type == 'badgr-bnpl-widget' %}
    <!-- Widget should appear here -->
  {% endif %}
{% endfor %}
```

### 🔧 **Performance Analysis**

#### **Page Speed Testing**
1. Use Google PageSpeed Insights
2. Test with and without widget
3. Check for performance impact
4. Optimize if necessary

#### **Memory Usage Monitoring**
1. Open Chrome DevTools
2. Go to Memory tab
3. Take heap snapshots
4. Check for memory leaks

---

## Getting Additional Help

### 📞 **When to Contact Support**

Contact BADGR support if:
- ✅ You've tried all relevant troubleshooting steps
- ✅ The issue persists across multiple browsers/devices
- ✅ You have specific error messages to report
- ✅ The issue affects your store's functionality

### 📧 **How to Contact Support**

1. **Email**: support@badgr-app.com
2. **In-App Support**: Use the help button in your BADGR dashboard
3. **Live Chat**: Available in your app admin during business hours

### 📋 **Information to Include**

When contacting support, please include:
- **Store URL**: Your myshopify.com domain
- **Theme Name**: Your current theme name and version
- **Browser**: Which browser and version you're using
- **Device**: Desktop/mobile device type
- **Error Messages**: Exact error messages (screenshots helpful)
- **Steps Taken**: What troubleshooting steps you've already tried
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened

### 🔍 **Before Contacting Support**

1. **Check Status Page**: Visit our status page for known issues
2. **Review Documentation**: Read relevant guides thoroughly
3. **Search Knowledge Base**: Search for similar issues
4. **Try Different Browser**: Test in multiple browsers
5. **Clear Cache**: Clear browser cache and cookies

### 📚 **Additional Resources**

- 📖 [Installation Guide](INSTALLATION_GUIDE.md) - Complete installation steps
- ⚙️ [Configuration Guide](CONFIGURATION_GUIDE.md) - Detailed configuration help
- 🎨 [Theme Integration Guide](THEME_INTEGRATION_GUIDE.md) - Theme customization
- 📱 [Daily Usage Guide](DAILY_USAGE_GUIDE.md) - Ongoing management
- 🌐 [Browser Testing Guide](../src/theme-extension/BROWSER_TESTING.md) - Cross-browser support

### 🎯 **Feature Requests**

Have suggestions for improvements? We'd love to hear them!
- **Feature Portal**: Submit feature requests through your app dashboard
- **Community**: Join our merchant community for discussions
- **Feedback**: Use the feedback button in the app

---

## Troubleshooting Success! 🎉

### **Widget Working Perfectly?**

Great! Here's what to do next:
1. **Monitor Performance**: Keep an eye on widget performance
2. **Test Regularly**: Test widget after theme updates
3. **Customer Feedback**: Gather feedback from customers
4. **Analytics**: Monitor conversion impact
5. **Stay Updated**: Keep the app updated for new features

### **Still Having Issues?**

Don't worry! Our support team is here to help:
- **Response Time**: We typically respond within 24 hours
- **Expert Help**: Our team knows the app inside and out
- **Custom Solutions**: We can help with unique requirements
- **Follow-up**: We'll follow up to ensure issues are resolved

---

*This troubleshooting guide is regularly updated. For the most current information, check your BADGR app dashboard or contact support.*

**Last Updated**: January 2025 | **Version**: 1.0.0 