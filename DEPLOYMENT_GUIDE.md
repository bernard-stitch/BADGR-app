# BADGR Vercel Deployment Guide

## 🚀 Deployment Overview

BADGR is now configured for seamless deployment on Vercel with:
- **Frontend**: React admin interface (static site)
- **Backend**: Serverless API functions
- **Database**: Supabase (hosted separately)

## ✅ Prerequisites Completed

- [x] GitHub repository connected to Vercel
- [x] Vercel project created
- [x] Serverless functions created in `/api` directory
- [x] Build configuration optimized

## 🔧 Environment Variables Setup

### Required Environment Variables

Add these to your Vercel project settings:

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add the following variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional: Production Environment
NODE_ENV=production
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your BADGR project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon/Public Key** → `SUPABASE_ANON_KEY`

## 📁 Project Structure

```
BADGR/
├── api/                          # Vercel Serverless Functions
│   ├── health.js                 # Health check endpoint
│   ├── test-db.js                # Database connection test
│   ├── index.js                  # API root
│   ├── widgets.js                # Widgets CRUD operations
│   ├── widgets/[shopId].js       # Shop-specific widget config
│   └── package.json              # API dependencies
├── src/frontend/                 # React Admin Interface
│   ├── dist/                     # Built frontend (auto-generated)
│   └── ...
├── vercel.json                   # Vercel configuration
└── ...
```

## 🔄 Deployment Process

### 1. Automatic Deployment

Vercel will automatically deploy when you push to your main branch:

```bash
git add .
git commit -m "feat: configure Vercel deployment"
git push origin main
```

### 2. Manual Deployment

From Vercel Dashboard:
1. Go to your project
2. Click **"Deploy"** or **"Redeploy"**
3. Select the branch to deploy

## 🧪 Testing the Deployment

### API Endpoints

Once deployed, test these endpoints:

```bash
# Replace 'your-app' with your actual Vercel URL
https://your-app.vercel.app/api              # API info
https://your-app.vercel.app/api/health       # Health check
https://your-app.vercel.app/api/test-db      # Database test
https://your-app.vercel.app/api/widgets      # Widget configurations
```

### Frontend

```bash
https://your-app.vercel.app                  # Admin interface
```

## 🐛 Troubleshooting

### Build Failures

1. **"Module not found" errors**:
   - Check that all dependencies are in `package.json`
   - Verify import/export syntax is correct

2. **Supabase connection errors**:
   - Verify environment variables are set
   - Check Supabase project is active
   - Ensure database tables exist

3. **Frontend build errors**:
   - Check Vite configuration
   - Ensure all components compile correctly

### Checking Logs

1. **Vercel Functions Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on any function to see logs

2. **Build Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment to see build logs

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files to git
2. **Supabase Keys**: Use the anon key, not the service role key
3. **CORS**: API functions include CORS headers for security

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Performance**: Monitor function performance in Vercel analytics
3. **Monitoring**: Set up error tracking (e.g., Sentry)
4. **Scaling**: Review function usage and upgrade plan if needed

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are correct
3. Test Supabase connection independently
4. Review Vercel documentation for serverless functions

---

**🎉 Congratulations!** Your BADGR app should now be successfully deployed on Vercel! 