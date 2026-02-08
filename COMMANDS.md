# Development Commands

## 🚀 Quick Commands

### Start Development
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally

### Lint Code
```bash
npm run lint
```
Check code for errors and style issues

## 📦 Installation

### First Time Setup
```bash
# Install all dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development
npm run dev
```

### Clean Install
```bash
# Remove existing dependencies
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

## 🔧 Troubleshooting

### Clear Cache
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Port Issues
```bash
# Use different port
npm run dev -- --port 3000
```

### Build Issues
```bash
# Force rebuild
npm run build -- --force
```

## 🌐 Environment Setup

### Development (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## 📱 Mobile Development

### Test on Mobile Device
```bash
# Start dev server
npm run dev

# Find your IP address
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# Access from mobile:
# http://YOUR_IP_ADDRESS:5173
```

## 🚢 Deployment

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
# Or connect GitHub repo for auto-deploy
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment
```bash
# Build
npm run build

# Upload dist/ folder to your hosting
```

## 🧪 Testing (Future)

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 📊 Performance

### Analyze Bundle Size
```bash
# Build with analysis
npm run build

# Check dist/ folder size
du -sh dist/
```

### Optimize Images
```bash
# Install image optimizer
npm install -D vite-plugin-imagemin

# Configure in vite.config.js
```

## 🔐 Security

### Check for Vulnerabilities
```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix
```

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update react react-dom
```

## 💡 Tips

1. **Hot Module Replacement (HMR)**: Changes reflect instantly without full reload
2. **Fast Refresh**: React components update without losing state
3. **TypeScript**: Can be added later with minimal changes
4. **ESLint**: Already configured for code quality
5. **Vite**: Super fast build tool with instant server start

## 🆘 Common Issues

### Issue: Port 5173 already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Issue: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
```bash
# Check for errors
npm run lint

# Clear cache
rm -rf node_modules/.vite dist

# Rebuild
npm install
npm run build
```

### Issue: Styles not loading
```bash
# Check if CSS is imported in main.jsx
# Should have: import "./styles/main.css"

# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

**Need Help?** Check README.md or QUICKSTART.md for more details.
