# Railway Deployment - Step by Step Guide (Urdu/English)

## 🚀 Complete Deployment Process

---

## STEP 1: GitHub Pe Code Push Karo

### 1.1 - Git Check Karo
```bash
cd C:\Users\affil\Desktop\todo-app-phase2
git status
```

### 1.2 - Sab Files Add Karo
```bash
git add .
git commit -m "Add Railway deployment files"
```

### 1.3 - GitHub Pe Push Karo
```bash
git push origin main
```

**Agar GitHub repository nahi hai:**
```bash
# Pehle GitHub pe new repository banao
# Phir:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## STEP 2: Railway Account Banao

### 2.1 - Railway Website Pe Jao
- Open browser: https://railway.app
- Click **"Start a New Project"** ya **"Login"**

### 2.2 - GitHub Se Login Karo
- Click **"Login with GitHub"**
- GitHub authorize karo
- Railway ko repository access do

---

## STEP 3: New Project Create Karo

### 3.1 - Dashboard Pe Jao
- Railway dashboard open hoga
- Click **"+ New Project"** button (top right)

### 3.2 - Deployment Method Select Karo
Aapko 3 options dikhenge:
1. **Deploy from GitHub repo** ← YE SELECT KARO
2. Deploy from template
3. Empty project

### 3.3 - Repository Select Karo
- Apni todo-app repository dhundo
- Repository name pe click karo
- **"Deploy Now"** button click karo

### 3.4 - Root Directory Select Karo (Important!)
Agar monorepo hai (frontend + backend dono ek repo mein):
- **Settings** → **Service**
- **Root Directory** mein **`backend`** type karo
- Save karo

Agar sirf backend hi push kiya hai:
- Ye step skip karo

---

## STEP 4: Environment Variables Add Karo

### 4.1 - Variables Tab Open Karo
- Railway dashboard mein apne service pe click karo
- **"Variables"** tab pe click karo (top menu mein)

### 4.2 - Add Variables (Ek ek kar ke)

**Click "New Variable" aur ye sab add karo:**

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql+asyncpg://neondb_owner:npg_pVJgbj81BIFv@ep-fancy-sun-ahsabmai-pooler.c-3.us-east-1.aws.neon.tech/neondb
```

#### Variable 2: BETTER_AUTH_SECRET
```
Name: BETTER_AUTH_SECRET
Value: hackathon-todo-app-secret-key-2026-phase-ii
```

#### Variable 3: CORS_ORIGINS
```
Name: CORS_ORIGINS
Value: http://localhost:3000
```
*(Baad mein frontend URL add karenge)*

#### Variable 4: API_PREFIX
```
Name: API_PREFIX
Value: /api
```

#### Variable 5: DEBUG
```
Name: DEBUG
Value: false
```

#### Variable 6: ACCESS_TOKEN_EXPIRE_HOURS
```
Name: ACCESS_TOKEN_EXPIRE_HOURS
Value: 24
```

#### Variable 7: JWT_ALGORITHM
```
Name: JWT_ALGORITHM
Value: HS256
```

### 4.3 - Save & Deploy
- Variables save ho jayenge automatically
- Railway service redeploy ho jayegi

---

## STEP 5: Deployment Monitor Karo

### 5.1 - Deployments Tab Check Karo
- **"Deployments"** tab pe click karo
- Latest deployment ka status dekho:
  - 🟡 **Building** - Docker image ban rahi hai
  - 🟢 **Success** - Deploy ho gaya!
  - 🔴 **Failed** - Error aya (logs check karo)

### 5.2 - Logs Dekho
- **"Logs"** tab pe click karo (real-time logs dikhenge)
- Ye dikhai dena chahiye:
  ```
  INFO:     Started server process
  INFO:     Waiting for application startup.
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://0.0.0.0:XXXX
  ```

### 5.3 - Build Time
- First build: 3-5 minutes
- Next builds: 1-2 minutes

---

## STEP 6: Public URL Get Karo

### 6.1 - Settings → Networking
- **"Settings"** tab pe jao
- **"Networking"** section dhundo

### 6.2 - Generate Domain
- **"Generate Domain"** button click karo
- Railway automatically URL de dega:
  - Format: `https://your-project-name.up.railway.app`
  - Example: `https://todo-backend-production.up.railway.app`

### 6.3 - URL Copy Karo
- Domain URL copy karo (ye aapke backend ka URL hai)
- Ye URL frontend mein use karenge

---

## STEP 7: Database Initialize Karo

### Option A: Railway CLI Use Karo (Recommended)

#### 7.1 - Railway CLI Install Karo
```bash
npm install -g @railway/cli
```

#### 7.2 - Railway Login Karo
```bash
railway login
```
- Browser open hoga
- Authorize kar do

#### 7.3 - Project Link Karo
```bash
cd C:\Users\affil\Desktop\todo-app-phase2\backend
railway link
```
- Apna project select karo list mein se

#### 7.4 - Database Initialize Karo
```bash
railway run python init_db.py
```
- Tables create ho jayenge
- Success message aana chahiye

### Option B: Railway Dashboard Se (Alternative)

#### 7.1 - New Service Add Karo
- Dashboard → **"+ New"** → **"Empty Service"**
- Service name: `db-init`

#### 7.2 - One-time Job Run Karo
- Service settings mein
- **"One-off Command"**: `python init_db.py`
- Run karo

---

## STEP 8: Test Karo Deployment

### 8.1 - Health Check
Browser mein open karo:
```
https://your-railway-app.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy"
}
```

### 8.2 - Root Endpoint
```
https://your-railway-app.up.railway.app/
```

**Expected Response:**
```json
{
  "message": "Phase II Todo API",
  "version": "1.0.0",
  "status": "running"
}
```

### 8.3 - API Documentation
Browser mein open karo:
```
https://your-railway-app.up.railway.app/api/docs
```

Swagger UI dikhai dena chahiye with all endpoints!

### 8.4 - Test Register Endpoint
Postman ya Thunder Client mein:
```
POST https://your-railway-app.up.railway.app/api/auth/register

Body (JSON):
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

**Expected Response (201):**
```json
{
  "user_id": "...",
  "email": "test@example.com",
  "message": "User registered successfully"
}
```

---

## STEP 9: Frontend Update Karo

### 9.1 - Frontend .env.local Update Karo
```bash
cd C:\Users\affil\Desktop\todo-app-phase2\frontend
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
```

### 9.2 - Frontend Restart Karo
```bash
npm run dev
```

### 9.3 - Test Karo
- Open: http://localhost:3000
- Try signup/login
- Should work with Railway backend!

---

## STEP 10: CORS Update Karo (Important!)

### 10.1 - Frontend Deploy Karne Ke Baad
Jab aap frontend Vercel pe deploy kar do, to:

### 10.2 - Railway Variables Update Karo
Railway dashboard → Variables → Edit `CORS_ORIGINS`:
```
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

### 10.3 - Redeploy Karo
- Variables save hote hi automatic redeploy hoga
- Ya manually: **"Deployments"** → **"Redeploy"**

---

## ✅ SUCCESS CHECKLIST

Deployment successful hai agar ye sab kaam kar rahe hain:

- [ ] `/health` endpoint working
- [ ] `/` endpoint returning JSON
- [ ] `/api/docs` showing Swagger UI
- [ ] Register endpoint working (POST /api/auth/register)
- [ ] Login endpoint working (POST /api/auth/login)
- [ ] Frontend se backend connect ho raha hai
- [ ] No CORS errors in browser console
- [ ] Railway logs show "Application startup complete"

---

## 🐛 TROUBLESHOOTING

### Problem 1: Build Failed
**Symptoms:** Red status, build errors in logs

**Solutions:**
1. Check Dockerfile syntax
2. Verify all dependencies in pyproject.toml
3. Check Railway logs for exact error
4. Try: Settings → Redeploy

### Problem 2: Application Crashes
**Symptoms:** Build success but service crashes

**Solutions:**
1. Check DATABASE_URL is correct
2. Verify all environment variables added
3. Check logs for Python errors
4. Run `railway logs` in terminal

### Problem 3: Database Connection Error
**Symptoms:** "could not connect to database"

**Solutions:**
1. Check DATABASE_URL has `postgresql+asyncpg://` prefix
2. Verify Neon database is active
3. Test connection locally first
4. Check Neon database connection limit

### Problem 4: CORS Errors
**Symptoms:** Browser shows CORS policy error

**Solutions:**
1. Add frontend URL to CORS_ORIGINS
2. Format: `http://localhost:3000,https://app.vercel.app`
3. No trailing slashes
4. Redeploy after updating

### Problem 5: 404 Not Found
**Symptoms:** Routes not working

**Solutions:**
1. Check API_PREFIX is `/api`
2. Routes should be: `/api/auth/login` not `/auth/login`
3. Verify in Swagger docs: `/api/docs`

### Problem 6: Environment Variables Not Loading
**Symptoms:** App crashes, config errors

**Solutions:**
1. Railway dashboard → Variables → Verify all added
2. Check for typos in variable names
3. Restart service after adding variables
4. Don't use quotes in values

---

## 📊 MONITORING

### View Logs (Real-time)
```bash
railway logs
```

### View Metrics
Railway Dashboard → Service → Metrics:
- CPU usage
- Memory usage
- Network traffic
- Request count

### Restart Service
Railway Dashboard → Settings → **"Restart"**

---

## 💰 COST MANAGEMENT

**Railway Free Tier:**
- ✅ $5 free credit every month
- ✅ 500 execution hours
- ✅ 512 MB RAM
- ✅ 1 GB Disk

**Your Backend Usage:**
- ~720 hours/month if running 24/7
- Cost: ~$5-7/month
- Strategy: Use free tier + add $5 if needed

**Saving Credits:**
- Remove unused services
- Use database on Neon (free tier)
- Monitor usage in Railway dashboard

---

## 🎯 NEXT STEPS

1. ✅ Backend deployed on Railway
2. ⏭️ Deploy frontend on Vercel
3. ⏭️ Update CORS with frontend URL
4. ⏭️ Test end-to-end flow
5. ⏭️ Set up custom domain (optional)
6. ⏭️ Monitor logs and metrics

---

## 📞 SUPPORT

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

**Issues:**
- Check Railway status page first
- Review logs for errors
- Join Railway Discord for help

---

## 🎉 CONGRATULATIONS!

Agar sab steps successfully complete ho gaye, to aapka backend Railway pe live hai! 🚀

**Your Backend URL:**
```
https://your-project-name.up.railway.app
```

**API Docs:**
```
https://your-project-name.up.railway.app/api/docs
```

Next: Frontend deploy karo Vercel pe! 🎨
