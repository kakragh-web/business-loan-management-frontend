# 🚀 Deployment Guide

## Step 1: Push Backend to GitHub

```bash
cd loan-management-backend

# Initialize git
git init
git add .
git commit -m "Initial backend commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/loan-backend.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### A. Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/loan-management
   ```

### B. Deploy to Render

1. Go to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `loan-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-management
   JWT_SECRET=your-super-secret-key-change-this
   ```

6. Click "Create Web Service"

7. Wait for deployment (5-10 minutes)

8. Get your live URL: `https://loan-backend.onrender.com`

### C. Create Admin User

After deployment, run:
```bash
# SSH into Render or use Render Shell
npm run create-admin
```

---

## Step 3: Deploy Frontend to Netlify

### A. Update Frontend Environment

1. Update `.env`:
   ```env
   VITE_API_URL=https://loan-backend.onrender.com/api
   ```

2. Build frontend:
   ```bash
   cd business-load-management
   npm run build
   ```

### B. Deploy to Netlify

**Option 1: Drag & Drop**
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag `dist` folder
3. Done!

**Option 2: GitHub (Recommended)**
1. Push frontend to GitHub:
   ```bash
   cd business-load-management
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/YOUR_USERNAME/loan-frontend.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import from Git"
4. Connect GitHub repo
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://loan-backend.onrender.com/api
     ```

6. Click "Deploy site"

7. Get your live URL: `https://your-site.netlify.app`

### C. Configure Redirects

Create `public/_redirects`:
```
/*    /index.html   200
```

Rebuild and redeploy.

---

## Step 4: Test Production

### Test Backend
```bash
curl https://loan-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Test Frontend
1. Visit: `https://your-site.netlify.app`
2. Login with:
   - Email: `admin@company.com`
   - Password: `admin123`

---

## Environment Variables Summary

### Backend (Render)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/loan-management
JWT_SECRET=your-super-secret-key-change-this
```

### Frontend (Netlify)
```env
VITE_API_URL=https://loan-backend.onrender.com/api
```

---

## Quick Commands

### Backend
```bash
cd loan-management-backend
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### Frontend
```bash
cd business-load-management
npm run build
# Then drag dist/ to Netlify
```

---

## Troubleshooting

### Backend not responding
- Check Render logs
- Verify MongoDB connection string
- Ensure environment variables are set

### Frontend can't connect to backend
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

### CORS Issues
Add to backend `server.js`:
```javascript
app.use(cors({
  origin: 'https://your-site.netlify.app',
  credentials: true
}));
```

---

## 🎉 You're Live!

**Backend**: https://loan-backend.onrender.com  
**Frontend**: https://your-site.netlify.app

**Admin Login**:
- Email: `admin@company.com`
- Password: `admin123`
