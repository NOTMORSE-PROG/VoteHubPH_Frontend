# VoteHubPH Frontend

Next.js 14 frontend application for VoteHubPH - A comprehensive voting platform for the Philippines.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (Neon) via Prisma
- **Image Storage**: Cloudinary
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (Neon)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NOTMORSE-PROG/VoteHubPH_Frontend.git
cd VoteHubPH_Frontend
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure your `.env.local` file with your database, NextAuth, Google OAuth, and Cloudinary credentials. See `SETUP.md` for detailed instructions.

### 4. Database Setup

Generate Prisma client:

```bash
pnpm db:generate
# or
npm run db:generate
```

Push database schema:

```bash
pnpm db:push
# or
npm run db:push
```

### 5. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (NextAuth, upload, etc.)
│   ├── browse/           # Browse candidates page
│   ├── candidate/        # Candidate detail pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── profile/          # User profile page
│   ├── settings/         # Settings page
│   └── posts/            # Create/edit post pages
├── components/           # React components
│   ├── ui/               # UI primitives (shadcn/ui)
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── auth.config.ts    # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── ...               # Other utilities
└── prisma/               # Prisma schema
    └── schema.prisma     # Database schema
```

## 🔑 Key Features

### Authentication
- Email/Password with OTP verification
- Google OAuth
- NextAuth.js session management

### Candidate Management
- Browse candidates by location and level
- View detailed candidate profiles
- Create and edit candidate posts
- Vote and comment on candidates

### User Profile
- View your posts, comments, and votes
- Edit profile (name, photo)
- Filter and paginate your content

### Location-Based Filtering
- Auto-detect location via GPS
- Manual location selection
- Filter candidates by region, city, district, barangay

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables Required

- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret
- `NEXTAUTH_URL` - Your production URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `CLOUDINARY_*` - Cloudinary credentials

### Build Command

```bash
pnpm build
# or
npm run build
```

## 🧪 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio

## 📖 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
