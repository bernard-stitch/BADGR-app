# BADGR 🦡

**A Shopify merchant app for managing payment method logos and promotional widgets**

BADGR allows small merchants to visually add payment method logos and promotional widgets (e.g., BNPL prompts) to their product pages without editing Liquid code manually.

## 🚀 Features

- **Visual Logo Management**: Add Apple Pay, Google Pay, Visa, SnapScan, and other payment logos
- **BNPL Widget Integration**: Easy setup for Buy Now, Pay Later promotional widgets
- **Product Page Focus**: MVP targets product page placement with future expansion planned
- **Self-Service Setup**: No coding required for merchants
- **Shopify App Store Ready**: Built with Shopify best practices

## 🏗️ Architecture

### Frontend (`src/frontend/`)
- **Framework**: React 18 with Vite
- **UI Library**: Shopify Polaris
- **Purpose**: Merchant admin interface for configuration

### Backend (`src/backend/`)
- **Runtime**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **Purpose**: API server for widget configuration and management

### Theme Extension (`src/theme-extension/`)
- **Type**: Shopify Theme App Extension
- **Purpose**: Renders widgets on merchant storefronts

## 🛠️ Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Shopify CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bernard-stitch/BADGR.git
   cd BADGR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. **Configure Supabase**
   - Project URL: `https://rprltzscbxsqhigemejr.supabase.co`
   - See `config/supabase.json` for full configuration

### Development

```bash
# Run all services
npm run dev

# Run individually
npm run dev:backend    # Backend API server
npm run dev:frontend   # Frontend admin interface
```

## 📊 Project Status

- ✅ **Repository Setup**: Complete
- ✅ **Supabase Integration**: Complete
- ⏳ **Backend Development**: In Progress
- ⏳ **Frontend Development**: Pending
- ⏳ **Theme Extension**: Pending

## 🗂️ Project Structure

```
BADGR/
├── src/
│   ├── backend/           # Express.js API server
│   ├── frontend/          # React + Polaris admin interface
│   └── theme-extension/   # Shopify Theme App Extension
├── config/                # Configuration files
├── Docs/                  # Project documentation
├── test/                  # Test files
└── public/               # Static assets
```

## 🔧 Configuration

### Supabase
- **Project ID**: `rprltzscbxsqhigemejr`
- **Region**: `us-east-1`
- **Status**: `ACTIVE_HEALTHY`

### Environment Variables
```bash
SUPABASE_URL=https://rprltzscbxsqhigemejr.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
NODE_ENV=development
```

## 🧪 Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## 📦 Deployment

### Backend
- **Platform**: Vercel (planned)
- **Database**: Supabase (configured)

### Frontend
- **Platform**: Vercel (planned)
- **Build**: Vite production build

### Theme Extension
- **Platform**: Shopify App Store
- **Deploy**: `npm run deploy` (in theme-extension directory)

## 📚 Documentation

- [Project Plan](Docs/badgr_project_plan.md)
- [App Specification](Docs/badgr_app_spec.md)
- [Task Management](.taskmaster/) - Powered by Task Master AI

## 🔐 Security

- Helmet.js for security headers
- CORS configuration
- Environment variable management
- Supabase RLS policies (to be implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🏷️ Tech Stack

- **Frontend**: React, Vite, Shopify Polaris
- **Backend**: Node.js, Express, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel
- **Development**: Task Master AI, Cursor, GitHub

---

**Built with ❤️ for Shopify merchants who want beautiful, functional storefronts without the complexity.** 