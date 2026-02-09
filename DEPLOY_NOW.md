# 🚀 Quick Deployment Steps

## ✅ Step 1: MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create FREE cluster
4. Database Access → Add User:
   - Username: `admin`
   - Password: (generate strong password)
5. Network Access → Add IP: `0.0.0.0/0` (allow all)
6. Connect → Drivers → Copy connection string:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/loan-management
   ```

---

## ✅ Step 2: Deploy Backend to Render (10 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository: `business-loan-management-backend`
5. Configure:
   - **Name**: `loan-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Environment Variables** (click "Add Environment Variable"):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/loan-management
   JWT_SECRET=your-super-secret-key-12345
   FRONTEND_URL=https://your-site.netlify.app
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy your backend URL: `https://loan-backend.onrender.com`

---

## ✅ Step 3: Create Admin User

After backend deploys:

1. In Render dashboard → Shell (or use Render Shell)
2. Run:
   ```bash
   npm run create-admin
   ```

This creates:
- Email: `admin@company.com`
- Password: `admin123`

---

## ✅ Step 4: Deploy Frontend to Netlify (5 minutes)

1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import from Git"
4. Connect repository: `business-loan-management-frontend`
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://loan-backend.onrender.com/api
     ```

6. Click "Deploy site"
7. Wait 2-3 minutes
8. Copy your frontend URL: `https://your-site.netlify.app`

---

## ✅ Step 5: Update Backend CORS

1. Go back to Render
2. Environment → Edit `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-actual-site.netlify.app
   ```
3. Save (auto-redeploys)

---

## ✅ Step 6: Test Production

1. Visit: `https://your-site.netlify.app`
2. Login:
   - Email: `admin@company.com`
   - Password: `admin123`
3. Test all features!

---

## 🎉 You're Live!

**Backend**: https://loan-backend.onrender.com  
**Frontend**: https://your-site.netlify.app

**Admin Credentials**:
- Email: `admin@company.com`
- Password: `admin123`

---

## 🔧 Troubleshooting

### Backend not responding
- Check Render logs
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend can't connect
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for errors

### CORS errors
- Update FRONTEND_URL in Render
- Redeploy backend

---

## 📝 Environment Variables Summary

### Render (Backend)
```
PORT=5000
MONGO_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/loan-management
JWT_SECRET=your-super-secret-key-12345
FRONTEND_URL=https://your-site.netlify.app
```

### Netlify (Frontend)
```
VITE_API_URL=https://loan-backend.onrender.com/api
```

---

**Total Time**: ~20 minutes  
**Cost**: $0 (Free tier)

🚀 Ready to deploy!
