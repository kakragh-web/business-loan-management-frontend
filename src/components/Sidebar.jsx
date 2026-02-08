import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>Business Loan</h2>
        <p>Management System</p>
      </div>
      <nav>
        <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
          <i className="fas fa-chart-pie"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/customers" className={isActive("/customers") ? "active" : ""}>
          <i className="fas fa-users"></i>
          <span>Customers</span>
        </Link>
        <Link to="/loans" className={isActive("/loans") ? "active" : ""}>
          <i className="fas fa-file-invoice-dollar"></i>
          <span>Loans</span>
        </Link>
        <Link to="/calculator" className={isActive("/calculator") ? "active" : ""}>
          <i className="fas fa-calculator"></i>
          <span>Loan Calculator</span>
        </Link>
        <Link to="/transactions" className={isActive("/transactions") ? "active" : ""}>
          <i className="fas fa-exchange-alt"></i>
          <span>Transactions</span>
        </Link>
      </nav>
    </aside>
  );
}
