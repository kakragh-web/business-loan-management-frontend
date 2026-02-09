# 🔐 Environment Variables Setup Guide

## 📋 RENDER (Backend) - 4 Variables

### How to Add in Render:
1. Go to your service dashboard
2. Click "Environment" tab (left sidebar)
3. Click "Add Environment Variable"
4. Add each variable below

### Variables to Add:

#### 1. PORT
```
Key: PORT
Value: 5000
```

#### 2. MONGO_URI
```
Key: MONGO_URI
Value: mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/loan-management
```
**Replace:**
- `YOUR_PASSWORD` with your MongoDB Atlas password
- `cluster` with your actual cluster name

**Example:**
```
mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/loan-management
```

#### 3. JWT_SECRET
```
Key: JWT_SECRET
Value: blm-super-secret-jwt-key-2024-production
```
**Note:** Use a strong random string in production

#### 4. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://your-site.netlify.app
```
**Note:** Update this after deploying frontend

---

## 📋 NETLIFY (Frontend) - 1 Variable

### How to Add in Netlify:
1. Go to your site dashboard
2. Click "Site configuration" → "Environment variables"
3. Click "Add a variable"
4. Add the variable below

### Variable to Add:

#### 1. VITE_API_URL
```
Key: VITE_API_URL
Value: https://your-backend.onrender.com/api
```
**Replace:**
- `your-backend` with your actual Render service name

**Example:**
```
https://loan-backend-abc123.onrender.com/api
```

---

## 🎯 Quick Copy-Paste Templates

### For Render (Backend):
```
PORT=5000
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.mongodb.net/loan-management
JWT_SECRET=blm-super-secret-jwt-key-2024-production
FRONTEND_URL=https://your-site.netlify.app
```

### For Netlify (Frontend):
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 📸 Step-by-Step Screenshots Guide

### RENDER:

**Step 1:** After creating web service, click "Environment"
```
Dashboard → Your Service → Environment (left sidebar)
```

**Step 2:** Click "Add Environment Variable"

**Step 3:** Add each variable:
- Key: `PORT`
- Value: `5000`
- Click "Add"

**Step 4:** Repeat for all 4 variables

**Step 5:** Click "Save Changes" (auto-redeploys)

---

### NETLIFY:

**Step 1:** Go to site settings
```
Sites → Your Site → Site configuration → Environment variables
```

**Step 2:** Click "Add a variable"

**Step 3:** Add variable:
- Key: `VITE_API_URL`
- Value: `https://your-backend.onrender.com/api`

**Step 4:** Click "Create variable"

**Step 5:** Trigger redeploy:
```
Deploys → Trigger deploy → Deploy site
```

---

## ✅ Verification Checklist

### Render (Backend):
- [ ] PORT = 5000
- [ ] MONGO_URI = (your MongoDB connection string)
- [ ] JWT_SECRET = (your secret key)
- [ ] FRONTEND_URL = (your Netlify URL)
- [ ] Service deployed successfully
- [ ] Logs show "MongoDB connected"
- [ ] Logs show "Server running on port 5000"

### Netlify (Frontend):
- [ ] VITE_API_URL = (your Render backend URL + /api)
- [ ] Site deployed successfully
- [ ] No build errors
- [ ] Site loads in browser

---

## 🔍 How to Get Your URLs

### Get Render Backend URL:
1. Go to Render dashboard
2. Click your service
3. Copy URL at top (e.g., `https://loan-backend-abc123.onrender.com`)
4. Add `/api` at the end for Netlify

### Get Netlify Frontend URL:
1. Go to Netlify dashboard
2. Click your site
3. Copy URL at top (e.g., `https://your-site-abc123.netlify.app`)
4. Use this for Render's FRONTEND_URL

---

## 🚨 Common Mistakes

### ❌ Wrong:
```
VITE_API_URL=https://loan-backend.onrender.com
```

### ✅ Correct:
```
VITE_API_URL=https://loan-backend.onrender.com/api
```
**Note:** Must include `/api` at the end!

---

### ❌ Wrong:
```
MONGO_URI=mongodb://localhost:27017/loan-management
```

### ✅ Correct:
```
MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/loan-management
```
**Note:** Must use MongoDB Atlas connection string!

---

## 🧪 Test Your Setup

### Test Backend:
```bash
curl https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### Test Frontend:
1. Visit your Netlify URL
2. Open browser console (F12)
3. Check for errors
4. Try logging in

---

## 💡 Pro Tips

1. **Save your variables** - Keep a copy in a secure password manager
2. **Use strong secrets** - Generate random strings for JWT_SECRET
3. **Update FRONTEND_URL** - After deploying frontend, update this in Render
4. **Check logs** - Always check deployment logs for errors
5. **Redeploy if needed** - After changing variables, redeploy both services

---

## 🆘 Need Help?

If variables aren't working:
1. Check spelling (case-sensitive!)
2. Verify no extra spaces
3. Check logs for errors
4. Redeploy after changes
5. Clear browser cache

---

**Ready to set variables?** Follow this guide step by step! 🚀
