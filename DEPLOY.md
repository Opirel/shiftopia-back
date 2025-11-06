# ShifTopia Backend - Express.js Render Deployment Guide

This guide explains how to deploy the ShifTopia Express.js backend application with Prisma ORM to Render.

## Prerequisites

- Git repository pushed to GitHub
- Render account (free tier available)
- Node.js 18+ for local development
- PostgreSQL database (Render provides free PostgreSQL)

## Project Structure

This is an Express.js backend with:
- **Express.js** - Web framework
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository contains:
- `render.yaml` - Render configuration file
- `.env.production` - Production environment variables template
- Updated `package.json` with deployment scripts
- Prisma schema and migrations

### 2. Create a New Web Service on Render

1. **Log in to Render**: Visit [render.com](https://render.com) and sign in
2. **Create New Web Service**: 
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch (`main`)

### 3. Configure Build Settings

Render will automatically detect the `render.yaml` file, but you can also configure manually:

- **Name**: `shiftopia-backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm run deploy && npm start`
- **Plan**: Free (or choose your preferred plan)

### 4. Database Setup

#### Option 1: Create Database in Render (Recommended)
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `shiftopia-database`
   - **Database Name**: `shiftopia`
   - **User**: `shiftopia_user`
   - **Plan**: Free
3. After creation, copy the **External Database URL**

#### Option 2: Use External Database
- Use any PostgreSQL provider (Supabase, ElephantSQL, etc.)
- Get the connection string

### 5. Environment Variables Setup

Add these environment variables in Render dashboard:

**Required Variables:**
```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://[username]:[password]@[hostname]:[port]/[database]
FRONTEND_URL=https://shiftopia-frontend.onrender.com
PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1
```

**Optional Variables (if using Prisma Accelerate):**
```
PRISMA_ACCELERATE_API_KEY=your_accelerate_api_key
```

### 6. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Generate Prisma client
   - Build TypeScript to JavaScript
   - Deploy database schema
   - Start the server
3. Monitor build logs for any issues

### 7. Database Migration

After first deployment:
1. Go to your service's "Shell" tab in Render
2. Run: `npx prisma db push` (if not already done by deploy script)
3. Optionally seed data: `npm run seed`

### 8. Access Your API

Once deployment is complete:
- Your API will be available at: `https://your-service-name.onrender.com`
- Test with: `https://your-service-name.onrender.com/user`

## API Endpoints

Your backend provides these main endpoints:

- `GET /user` - Get users
- `POST /user` - Create user
- `GET /franchises` - Get franchises
- `POST /franchises` - Create franchise
- `GET /branches` - Get branches
- `POST /branches` - Create branch
- `GET /availabilitySubmissions` - Get availability submissions
- `POST /availabilitySubmissions` - Submit availability
- `PUT /availabilitySubmissions` - Update submission status
- `GET /schedules` - Get schedules
- `POST /schedule` - Create schedule
- And more...

## Troubleshooting

### Common Issues and Solutions

#### Build Failures
- **Issue**: TypeScript compilation errors
- **Solution**: Ensure all dependencies are in `package.json` and types are properly installed

#### Database Connection Issues
- **Issue**: Cannot connect to database
- **Solution**: 
  - Verify `DATABASE_URL` is correctly set
  - Ensure database service is running
  - Check firewall/network settings

#### Prisma Client Issues
- **Issue**: `PrismaClient` not found
- **Solution**: Ensure `npx prisma generate` runs in build command

#### Migration Issues
- **Issue**: Database schema mismatch
- **Solution**: Run `npx prisma db push` or `npx prisma migrate deploy`

#### CORS Issues
- **Issue**: Frontend cannot connect to backend
- **Solution**: 
  - Add frontend URL to CORS origins
  - Set `FRONTEND_URL` environment variable
  - Verify CORS configuration in `src/index.ts`

### Local Testing

Before deploying, test your build locally:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Set up local database (if needed)
npx prisma db push

# Start production server
npm start
```

Visit `http://localhost:8080/user` to test your API.

## Automatic Deployments

Render automatically deploys when you push to your connected branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically detects changes and redeploys

## Production Optimizations

### Database Performance:
- Use connection pooling
- Implement proper indexing (already in Prisma schema)
- Consider read replicas for high traffic

### Security:
- Use environment variables for sensitive data
- Implement rate limiting
- Add authentication/authorization
- Use HTTPS (automatic with Render)

### Monitoring:
- Use Render's built-in metrics
- Set up error tracking (Sentry, etc.)
- Monitor database performance
- Set up health checks

## Prisma Commands

Useful Prisma commands for production:

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Deploy migrations
npx prisma migrate deploy

# Reset database (use with caution)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.onrender.com` |
| `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` | Disable Prisma advisory locks | `1` |

## Support

- [Render Documentation](https://render.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [GitHub Repository Issues](https://github.com/Opirel/shiftopia-backend/issues)

## Additional Configuration

### Custom Domain Setup:
1. Go to your service in Render dashboard
2. Navigate to "Settings" → "Custom Domains"
3. Add your domain and follow DNS configuration instructions

### SSL Certificate:
- Render provides automatic SSL certificates for all deployments
- Custom domains also get free SSL certificates

### Scaling:
- Monitor your app's performance
- Upgrade to paid plans for better performance
- Consider horizontal scaling for high traffic

---

**Note**: This setup uses Render's free tier. For production applications with high traffic, consider upgrading to a paid plan for better performance, more resources, and additional features.