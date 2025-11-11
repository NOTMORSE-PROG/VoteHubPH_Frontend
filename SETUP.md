# VoteHubPH Frontend Setup Guide

Complete setup guide for VoteHubPH frontend application.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
- **Git** ([Download](https://git-scm.com/))

### Required Accounts
- **Neon** - PostgreSQL database ([Sign up](https://neon.tech))
- **Cloudinary** - Image storage ([Sign up](https://cloudinary.com))
- **Google Cloud** - OAuth credentials ([Console](https://console.cloud.google.com))

## 🗄️ Database Setup (Neon)

1. Create a new project on [Neon](https://neon.tech)
2. Copy your connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
3. Save this for later use in environment variables

## ☁️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard → Settings
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Create an upload preset (Settings → Upload → Upload presets)
   - Name: `votehubph_unsigned`
   - Signing mode: `Unsigned`
   - Folder: `votehubph`

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (for production, add your production URL)
7. Copy Client ID and Client Secret

## 🔧 Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/NOTMORSE-PROG/VoteHubPH_Frontend.git
cd VoteHubPH_Frontend
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="your-neon-postgresql-connection-string-here"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here
AUTH_SECRET=generate-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=votehubph_unsigned
```

Generate secrets:
```bash
openssl rand -base64 32
```

### 3. Setup Database

```bash
pnpm db:generate
pnpm db:push
```

### 4. Start Development Server

```bash
pnpm dev
```

Frontend will run at `http://localhost:3000`

## 🚀 Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Add all environment variables
3. Build command: `pnpm build`
4. Deploy automatically on push

## ✅ Verification

After setup, verify:

1. ✅ Frontend loads at `http://localhost:3000`
2. ✅ Can register new user
3. ✅ Can login with email/password
4. ✅ Can login with Google OAuth
5. ✅ Can create a post
6. ✅ Images upload to Cloudinary

## 🆘 Troubleshooting

**NextAuth errors:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure database is accessible

**API connection errors:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

**Prisma errors:**
- Run `pnpm db:generate` after schema changes
- Verify `DATABASE_URL` is correct
- Check database connection

## 📞 Support

For issues or questions, please open an issue on GitHub.

