# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd business-load-management
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:5173`

## 🔐 Login
- Email: any email (e.g., admin@example.com)
- Password: any password (e.g., password123)

## 📍 Navigation

After login, you'll have access to:

1. **Dashboard** (`/dashboard`)
   - View overview statistics
   - See recent loans
   - Track revenue

2. **Customers** (`/customers`)
   - Add new customers
   - View customer list
   - Manage customer information

3. **Loans** (`/loans`)
   - Create new loans
   - View all loans
   - Track loan status

4. **Loan Calculator** (`/calculator`)
   - Calculate monthly payments
   - View total interest
   - Plan loan terms

5. **Transactions** (`/transactions`)
   - View all transactions
   - Track repayments
   - Monitor disbursements

## 🎯 Key Features

### Creating a Customer
1. Go to Customers page
2. Click "Add Customer" button
3. Fill in customer details
4. Click "Save Customer"

### Creating a Loan
1. Go to Loans page
2. Click "Create Loan" button
3. Enter loan details:
   - Customer name
   - Loan amount
   - Interest rate
   - Term (months)
4. Click "Create Loan"

### Using Loan Calculator
1. Go to Loan Calculator page
2. Enter:
   - Loan amount
   - Annual interest rate
   - Loan term (years)
3. Click "Calculate Loan"
4. View results:
   - Monthly payment
   - Total payment
   - Total interest

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Clear cache and rebuild
npm run build -- --force
```

## 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Mobile Testing

The app is responsive. Test on mobile by:
1. Start dev server: `npm run dev`
2. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. Access from mobile: `http://YOUR_IP:5173`

## 🎨 Customization

### Change Colors
Edit `src/styles/main.css`:
```css
:root {
  --primary-color: #6366f1;  /* Change this */
  --secondary-color: #8b5cf6; /* Change this */
}
```

### Change Logo
Update in `src/components/Sidebar.jsx`

## 💡 Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Mock data is stored in `src/data/mockData.js`
- All forms have validation
- Data persists in component state (not localStorage yet)

## 🆘 Need Help?

Check:
1. Browser console for errors
2. Terminal for build errors
3. README.md for detailed documentation

---

Happy coding! 🎉
