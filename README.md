# Business Loan Management System

A modern, full-featured Business Loan Management System built with React, merging the functionality of LoanChec (loan calculator) and Admin Dashboard (internal management) into a unified platform.

## 🚀 Features

### Customer Management
- Add, view, and manage customer information
- Track customer details (name, phone, email)
- Customer status tracking

### Loan Management
- Create and manage loans
- Loan calculator with interest rate and term calculations
- Track loan status (Active, Completed, Pending)
- View loan history and details

### Smart Loan Calculator
- Calculate monthly payments
- View total payment amount
- Calculate total interest
- Real-time calculations with animated results

### Dashboard & Analytics
- Overview of key metrics
- Total customers count
- Active loans tracking
- Revenue tracking
- Visual charts and graphs

### Transaction Management
- Track all loan transactions
- View repayments and disbursements
- Transaction history

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Routing**: React Router DOM 7.13.0
- **Charts**: Chart.js 4.5.1 + React-ChartJS-2 5.3.1
- **Build Tool**: Vite 7.2.4
- **Styling**: Custom CSS with modern design system

## 📦 Installation

1. Navigate to the project directory:
```bash
cd business-load-management
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔐 Authentication

The system includes a login page for staff authentication. Currently using mock authentication:

- Any email and password will work for demo purposes
- Authentication state is stored in localStorage
- Protected routes require authentication

## 📁 Project Structure

```
business-load-management/
├── src/
│   ├── components/
│   │   ├── Chart.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RevenueChart.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── Table.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── Customers.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Loan.jsx
│   │   ├── LoanCalculator.jsx
│   │   ├── Login.jsx
│   │   └── Transactions.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

## 🎨 Design System

The application uses a modern design system with:
- Custom CSS variables for theming
- Gradient backgrounds
- Smooth animations and transitions
- Responsive layout
- Font Awesome icons
- Inter font family

### Color Palette
- Primary: #6366f1 (Indigo)
- Secondary: #8b5cf6 (Purple)
- Success: #10b981 (Green)
- Warning: #f59e0b (Amber)
- Error: #ef4444 (Red)

## 🔄 API Integration

The system is designed to be API-ready. Currently using mock data, but can easily connect to a backend:

### API Endpoints (Ready to implement)
```javascript
// Authentication
POST /api/auth/login

// Customers
GET /api/customers
POST /api/customers

// Loans
GET /api/loans
POST /api/loans

// Transactions
GET /api/transactions
```

### Connecting to Backend

1. Update the `.env` file with your API URL:
```env
REACT_APP_API_URL=https://your-api-url.com/api
```

2. The API service (`src/services/api.js`) is already configured to use environment variables

3. Replace mock data usage in components with API calls:
```javascript
// Before (mock)
const [customers, setCustomers] = useState(mockCustomers);

// After (API)
useEffect(() => {
  api.getCustomers()
    .then(res => res.json())
    .then(setCustomers);
}, []);
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Features Roadmap

### Current (Mock Data)
- ✅ Customer management
- ✅ Loan creation and tracking
- ✅ Loan calculator
- ✅ Dashboard with stats
- ✅ Transaction history
- ✅ Authentication flow

### Future Enhancements
- [ ] Connect to backend API
- [ ] User roles and permissions
- [ ] Advanced reporting
- [ ] Email notifications
- [ ] Document upload
- [ ] Payment gateway integration
- [ ] Dark mode toggle
- [ ] Export to PDF/Excel
- [ ] Advanced search and filters
- [ ] Loan approval workflow

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👥 Credits

Developed by merging:
- **LoanChec** - Loan calculator functionality
- **Admin Dashboard** - Internal management system

---

**Version**: 1.0.0  
**Last Updated**: 2024
