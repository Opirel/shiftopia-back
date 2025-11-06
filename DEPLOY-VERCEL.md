# ShifTopia Backend - Vercel Deployment Guide

This guide explains how to deploy the ShifTopia Express.js backend application with Prisma ORM to Vercel.

## Prerequisites

- Git repository pushed to GitHub
- Vercel account (free tier available)
- Node.js 18+ for local development
- PostgreSQL database (use PlanetScale, Supabase, or other providers)

## Vercel-Specific Configuration

### Files Added for Vercel:
- `vercel.json` - Vercel deployment configuration
- Updated `tsconfig.json` - ES2022 compatibility
- `vercel-build` script in `package.json`

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository contains:
- `vercel.json` - Vercel configuration file
- `.env.production` - Production environment variables template
- Updated `package.json` with Vercel build script
- Prisma schema

### 2. Set Up Database

**Recommended: PlanetScale (MySQL) or Supabase (PostgreSQL)**

#### Option A: PlanetScale (MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string
4. Update `prisma/schema.prisma` datasource to use MySQL:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

#### Option B: Supabase (PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the PostgreSQL connection string
4. Keep the current schema.prisma (already configured for PostgreSQL)

### 3. Deploy to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**:
   Add these in Vercel dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=your_database_connection_string
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1
   ```

4. **Deploy**: Click "Deploy" and Vercel will handle the build

### 4. API Endpoints

Your API will be available at: `https://your-project.vercel.app`

Test endpoints:
- `GET /` - Health check
- `GET /api/status` - API status
- `GET /user` - Get users
- All other existing endpoints

## Environment Variables for Vercel

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host/db` or `postgresql://...` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.vercel.app` |
| `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` | Disable Prisma locks | `1` |

## Troubleshooting

### TypeScript Build Errors
✅ **Fixed**: Updated `tsconfig.json` with:
- Target: ES2022
- Strict: false
- skipLibCheck: true
- Added proper type definitions

### Database Connection Issues
- Ensure DATABASE_URL is correctly set in Vercel environment variables
- For MySQL: Update Prisma schema provider to "mysql"
- For PostgreSQL: Keep current schema configuration

### CORS Issues
- Add your Vercel frontend domain to CORS origins
- Set FRONTEND_URL environment variable

### Function Timeout
- Vercel has a 10-second timeout for serverless functions
- For longer operations, consider using background jobs

## Differences from Render Deployment

| Feature | Render | Vercel |
|---------|--------|---------|
| Type | Traditional server | Serverless functions |
| Database | Included PostgreSQL | External database required |
| Build time | Longer builds | Fast builds |
| Cold starts | None | Yes (serverless) |
| Scaling | Manual | Automatic |
| Cost | Free tier limits | Pay per usage |

## Database Migration

After deployment, run migrations:

1. **Local development**:
   ```bash
   npx prisma migrate dev
   ```

2. **Production (via Vercel CLI)**:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   ```

## Performance Considerations

### Serverless Optimization:
- Keep functions lightweight
- Use connection pooling for databases
- Implement proper caching
- Consider edge functions for better performance

### Database Connection:
- Use connection pooling (PgBouncer for PostgreSQL)
- Implement connection limits
- Consider read replicas for high traffic

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PlanetScale Docs](https://planetscale.com/docs) (for MySQL)
- [Supabase Docs](https://supabase.com/docs) (for PostgreSQL)

---

**Note**: Vercel is optimized for serverless functions. For traditional server applications with persistent connections, Render might be a better choice.