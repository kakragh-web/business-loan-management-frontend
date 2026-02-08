# Deployment Guide

## 🚀 Deploy to Netlify (Recommended)

### Method 1: Drag & Drop
1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag the `dist` folder to the upload area

4. Your site is live! 🎉

### Method 2: GitHub Integration (Auto-Deploy)
1. Push your code to GitHub

2. Go to [Netlify](https://app.netlify.com)

3. Click "New site from Git"

4. Connect your GitHub repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add `REACT_APP_API_URL`

6. Click "Deploy site"

### Netlify Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🔷 Deploy to Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration
1. Go to [Vercel](https://vercel.com)

2. Click "Import Project"

3. Connect your GitHub repository

4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `REACT_APP_API_URL`

5. Click "Deploy"

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Remove console.log statements
- [ ] Set proper CORS headers on API
- [ ] Use HTTPS for API endpoints
- [ ] Implement proper authentication
- [ ] Add rate limiting
- [ ] Enable security headers
- [ ] Minify and optimize assets
- [ ] Set up monitoring and logging

---

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod --dir=dist
```

---

**Deployment Status**: Ready for Production ✅  
**Recommended Platform**: Netlify or Vercel  
**Estimated Deploy Time**: 2-5 minutes
