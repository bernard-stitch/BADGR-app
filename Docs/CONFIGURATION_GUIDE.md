# BADGR Configuration Guide

## Getting Your BADGR Widget Ready

After installing BADGR, you'll need to configure it to match your store's needs and branding. This guide walks you through every setting to help you create the perfect BNPL experience for your customers.

---

## Table of Contents

1. [Accessing Configuration](#accessing-configuration)
2. [Basic Widget Settings](#basic-widget-settings)
3. [Choosing Your BNPL Providers](#choosing-your-bnpl-providers)
4. [Selecting Provider Logos](#selecting-provider-logos)
5. [Widget Placement Options](#widget-placement-options)
6. [Advanced Settings](#advanced-settings)
7. [Testing Your Configuration](#testing-your-configuration)
8. [Best Practices](#best-practices)

---

## Accessing Configuration

### Step 1: Open BADGR Settings

1. **From Shopify Admin:**
   - Go to **"Apps"** in your left sidebar
   - Click on **"BADGR"** from your installed apps
   - You'll see the BADGR dashboard

2. **Navigate to Settings:**
   - Click on **"Widget Settings"** or **"Configure"**
   - This opens the main configuration page

---

## Basic Widget Settings

### Widget Title
- **What it does**: Sets the heading text that appears above your BNPL options
- **Default**: "Buy Now, Pay Later Options"
- **Recommendations**:
  - Keep it short and clear
  - Examples: "Payment Options", "Flexible Payments", "Pay Your Way"

### Enable/Disable Widget
- **Master Toggle**: Turn your entire BADGR widget on or off
- **When to use**:
  - ✅ **Enable**: For live stores ready to show BNPL options
  - ❌ **Disable**: During setup, maintenance, or seasonal promotions

### Shop Domain
- **What it does**: Identifies your store for configuration
- **Auto-filled**: Usually detected automatically
- **Note**: Contact support if this appears incorrect

### Custom CSS (Advanced)
- **What it does**: Add custom styling to match your theme
- **Use cases**:
  - Adjust colors to match your brand
  - Modify spacing and layout
  - Change fonts and typography
- **⚠️ Warning**: Only edit if you're comfortable with CSS

---

## Choosing Your BNPL Providers

BADGR supports 5 major BNPL providers. You can enable any combination that makes sense for your business.

### Available Providers

#### 🔵 **Affirm**
- **Payment Options**: Monthly payments (3-24 months)
- **Best for**: Higher-value items ($50-$30,000)
- **Customer appeal**: Transparent interest rates, no hidden fees

#### 🌸 **Klarna** 
- **Payment Options**: Pay in 4 installments or monthly payments
- **Best for**: Fashion, lifestyle products ($1-$10,000)
- **Customer appeal**: Very popular, integrated shopping features

#### 🖤 **Afterpay**
- **Payment Options**: 4 interest-free payments every 2 weeks
- **Best for**: Younger demographics ($1-$2,000)
- **Customer appeal**: No interest ever, simple approval

#### 🟢 **Sezzle**
- **Payment Options**: 4 interest-free payments
- **Best for**: Beauty, fashion, home goods ($1-$2,500)
- **Customer appeal**: Interest-free, builds credit

#### 🟡 **Zip (formerly Quadpay)**
- **Payment Options**: 4 interest-free payments
- **Best for**: Millennial and Gen Z shoppers ($1-$1,000)
- **Customer appeal**: No impact on credit score

### Configuration Steps

1. **Enable BNPL Options**: Toggle the main switch to "ON"

2. **Select Individual Providers**:
   - Check the box next to each provider you want to offer
   - You can enable multiple providers simultaneously

3. **Provider Count Badge**: 
   - Shows how many providers you've enabled
   - Customers will see this many payment options

### ⚠️ **Important Considerations**

- **Too Many Options**: More than 3-4 providers might overwhelm customers
- **Target Audience**: Choose providers your customers recognize
- **Product Price Range**: Match providers to your typical order values

---

## Selecting Provider Logos

Choose which logos to display with your BNPL options.

### Available Logo Options

| Logo | Best For | Status |
|------|----------|---------|
| **Affirm** | Higher-value purchases | ⭐ Recommended |
| **Klarna** | Fashion & lifestyle | ⭐ Recommended |
| **Afterpay** | Youth-focused brands | Popular |
| **Sezzle** | Beauty & wellness | Emerging |
| **Zip** | Trendy products | Growing |
| **PayPal Credit** | Established brands | ⭐ Recommended |
| **Generic BNPL** | Brand-neutral option | Universal |

### Selection Guidelines

✅ **Recommended Approach**:
- Choose logos that match your enabled providers
- Select 1-3 main logos to avoid clutter
- Use **Generic BNPL** if you want provider-neutral messaging

❌ **Avoid**:
- Displaying logos for providers you haven't enabled
- Using too many logos (overwhelming)
- Mixing competing brand messages

---

## Widget Placement Options

Choose where on your product pages the BADGR widget appears.

### Placement Options

#### 🏆 **Product Page - Top** (Recommended)
- **Location**: Above product images and title
- **Impact**: Maximum visibility, first thing customers see
- **Best for**: High-conversion stores, premium products
- **Mobile-friendly**: ✅ Yes

#### 📊 **Product Page - Bottom** (Popular)
- **Location**: Below product description and reviews
- **Impact**: Good visibility after product information
- **Best for**: Detailed product pages, considered purchases
- **Mobile-friendly**: ✅ Yes

#### 🎯 **Near Add to Cart** (High Converting)
- **Location**: Next to or below the add to cart button
- **Impact**: Maximum conversion impact at purchase point
- **Best for**: Impulse purchases, fashion items
- **Mobile-friendly**: ⚠️ Test carefully

#### 📑 **Product Tabs** (Clean)
- **Location**: As a separate tab in product information
- **Impact**: Organized display with other details
- **Best for**: Information-heavy products, B2B stores
- **Mobile-friendly**: ✅ Yes

#### 📌 **Sidebar** (Sticky)
- **Location**: In the product page sidebar
- **Impact**: Always visible without scrolling
- **Best for**: Desktop-heavy traffic, long product pages
- **Mobile-friendly**: ❌ Limited space

#### 🔔 **Floating Widget** (Attention)
- **Location**: Floating overlay on the page
- **Impact**: Maximum attention but potentially intrusive
- **Best for**: Special promotions, high-value items
- **Mobile-friendly**: ⚠️ Can be intrusive

### Choosing the Right Placement

**Questions to Consider:**
1. **Where do your customers focus most?** (Analytics data helpful)
2. **How long are your product pages?** (Longer = consider sticky sidebar)
3. **What's your primary device traffic?** (Mobile vs. desktop)
4. **What's your conversion goal?** (Awareness vs. immediate action)

---

## Advanced Settings

### Provider-Specific Options

When you expand **"Advanced Settings"**, you'll find:

#### Display Options
- ☑️ **Show provider logos**: Display brand logos with payment options
- ☑️ **Show payment breakdown**: Display "4 payments of $X" details
- ☑️ **Apply to all products**: Show on every product vs. selective display

#### Customization
- **Widget theme**: Match your store's color scheme
- **Animation effects**: Enable/disable hover and loading animations
- **Mobile optimization**: Specific mobile display settings

### When to Use Advanced Settings

✅ **Enable "Show payment breakdown"** if:
- Your average order value is over $100
- Customers need payment clarity
- You're targeting budget-conscious shoppers

✅ **Enable "Apply to all products"** if:
- Most products are BNPL-eligible
- You want consistent messaging
- Your store has similar price points

❌ **Disable "Apply to all products"** if:
- You have very low-priced items (under $25)
- Some products aren't eligible for BNPL
- You want selective placement

---

## Testing Your Configuration

### Before Going Live

1. **Preview Your Changes**:
   - Use the "Preview" button in settings
   - Check both desktop and mobile views
   - Test different placement options

2. **Test on Actual Products**:
   - Visit your live product pages
   - Check widget appearance and positioning
   - Verify all selected providers appear

3. **Customer Journey Test**:
   - Add a product to cart
   - Proceed through checkout
   - Confirm BNPL options appear correctly

### Verification Checklist

- ✅ Widget appears on product pages
- ✅ Correct providers are displayed
- ✅ Logos match enabled providers
- ✅ Placement looks good on mobile
- ✅ Widget doesn't interfere with other elements
- ✅ Loading times are acceptable

---

## Best Practices

### 🎯 **Configuration Recommendations**

**For New Stores:**
- Start with 2-3 popular providers (Klarna, Afterpay, Affirm)
- Use "Product Page - Top" placement for maximum visibility
- Enable payment breakdown to build trust

**For Established Stores:**
- Analyze your customer demographics
- A/B test different placements
- Monitor conversion impact

**For Mobile-Heavy Traffic:**
- Avoid sidebar placement
- Test floating widget carefully
- Ensure payment breakdown is readable

### 🔧 **Maintenance Tips**

**Monthly Reviews:**
- Check which providers customers use most
- Review placement performance in analytics
- Update provider selection based on trends

**Seasonal Adjustments:**
- Enable more providers during holiday seasons
- Adjust messaging for promotional periods
- Consider floating widgets for special sales

**Performance Monitoring:**
- Track conversion rates before/after BADGR
- Monitor customer feedback
- Test new providers as they become available

---

## Need Help?

### Configuration Support
- 📧 **Email**: support@badgr-app.com
- 💬 **Live Chat**: Available in your BADGR dashboard
- 📖 **Video Tutorials**: Access step-by-step video guides

### Next Steps
- 🎨 [Theme Integration Guide](THEME_INTEGRATION_GUIDE.md) - Add widgets to your theme
- 📱 [Daily Usage Guide](DAILY_USAGE_GUIDE.md) - Ongoing management
- 🔧 [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md) - Fix common issues

---

**Ready to boost your conversions with BADGR!** 🚀

*Configuration guide last updated: [Current Date]* 