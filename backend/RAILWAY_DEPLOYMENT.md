# Railway Deployment Guide for Todo App Backend

This guide will help you deploy the FastAPI backend to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be pushed to GitHub
3. **Database**: You already have a Neon PostgreSQL database

## Files Created for Deployment

- ✅ `Dockerfile` - Docker configuration for containerization
- ✅ `railway.json` - Railway configuration (JSON format)
- ✅ `railway.toml` - Railway configuration (TOML format)
- ✅ `.dockerignore` - Files to exclude from Docker build

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
cd backend
git init
git add .
git commit -m "Add Railway deployment configuration"

# Push to GitHub
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create New Project on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Select the `backend` directory (if monorepo)

### Step 3: Configure Environment Variables

In Railway project settings, add these environment variables:

#### Required Variables:

```env
# Database URL (your existing Neon PostgreSQL)
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_pVJgbj81BIFv@ep-fancy-sun-ahsabmai-pooler.c-3.us-east-1.aws.neon.tech/neondb

# JWT Secret (same as your current .env)
BETTER_AUTH_SECRET=hackathon-todo-app-secret-key-2026-phase-ii

# CORS Origins (add your frontend URL after deployment)
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app

# API Prefix (optional, default is /api)
API_PREFIX=/api

# Debug mode (set to false in production)
DEBUG=false

# Token expiration
ACCESS_TOKEN_EXPIRE_HOURS=24

# JWT Algorithm
JWT_ALGORITHM=HS256
```

### Step 4: Configure Railway Service

Railway should automatically:
- ✅ Detect `Dockerfile`
- ✅ Build the Docker image
- ✅ Deploy the service
- ✅ Assign a public URL

**If manual configuration needed:**
1. Go to **Settings** → **Deploy**
2. Set **Builder**: `DOCKERFILE`
3. Set **Dockerfile Path**: `Dockerfile`
4. Set **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Step 5: Initialize Database (One-time)

After first deployment, run database initialization:

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run init script
railway run python init_db.py
```

**Option B: Using Railway Dashboard**
1. Go to your service
2. Click **"Variables"** tab
3. Add temporary variable: `RUN_INIT=true`
4. Redeploy
5. Remove the variable after deployment

### Step 6: Verify Deployment

1. **Check Logs**: Go to Railway dashboard → Your service → Logs
2. **Test Health Endpoint**:
   ```bash
   curl https://your-railway-app.railway.app/health
   ```
3. **Test API Docs**: Open `https://your-railway-app.railway.app/api/docs`

### Step 7: Update Frontend Environment

Update your frontend `.env.local` with the Railway URL:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## Common Issues & Solutions

### Issue 1: Database Connection Fails
**Solution**: Check that `DATABASE_URL` uses `postgresql+asyncpg://` prefix

### Issue 2: CORS Errors
**Solution**: Add your frontend domain to `CORS_ORIGINS`:
```env
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

### Issue 3: Port Binding Error
**Solution**: Railway sets `PORT` automatically. Our Dockerfile uses `${PORT:-8000}`

### Issue 4: Module Not Found
**Solution**: Ensure all dependencies are in `pyproject.toml`

## Monitoring & Logs

- **View Logs**: Railway Dashboard → Service → Logs
- **Metrics**: Railway Dashboard → Service → Metrics
- **Restart Service**: Railway Dashboard → Service → Settings → Restart

## Updating Your Deployment

When you push changes to GitHub:
```bash
git add .
git commit -m "Update backend"
git push
```

Railway will automatically:
1. Pull latest code
2. Rebuild Docker image
3. Deploy new version
4. Zero-downtime deployment

## Cost & Limits

**Railway Free Tier:**
- ✅ 500 hours/month execution time
- ✅ 512 MB RAM
- ✅ 1 GB Disk
- ✅ Shared CPU

**Your Setup:**
- Backend: ~100-200 hours/month (if running 24/7)
- Database: Hosted on Neon (separate billing)

## Custom Domain (Optional)

1. Go to Railway Dashboard → Service → Settings
2. Click **"Generate Domain"** or add custom domain
3. Update `CORS_ORIGINS` with new domain
4. Update frontend API URL

## Useful Commands

```bash
# View logs
railway logs

# Connect to service shell
railway shell

# Run migrations
railway run python init_db.py

# Environment variables
railway variables
```

## Security Checklist

- ✅ `DEBUG=false` in production
- ✅ Strong `BETTER_AUTH_SECRET` (keep private!)
- ✅ Database URL not exposed publicly
- ✅ CORS configured with specific origins
- ✅ HTTPS enabled (automatic on Railway)

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- FastAPI Docs: https://fastapi.tiangolo.com

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Update frontend with Railway URL
3. ✅ Test authentication flow
4. ✅ Test CRUD operations
5. ✅ Monitor logs for errors
6. ✅ Set up custom domain (optional)

---

**Your Railway Backend URL will be:**
`https://your-project-name.railway.app`

**API Documentation:**
`https://your-project-name.railway.app/api/docs`

Good luck with your deployment! 🚀
