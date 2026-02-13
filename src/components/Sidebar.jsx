import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>Business Loan</h2>
            <p>Management System</p>
          </div>
          <button 
            className="sidebar-close" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav>
          <Link 
            to="/dashboard" 
            className={isActive("/dashboard") ? "active" : ""}
            onClick={handleLinkClick}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/customers" 
            className={isActive("/customers") ? "active" : ""}
            onClick={handleLinkClick}
          >
            <i className="fas fa-users"></i>
            <span>Customers</span>
          </Link>
          <Link 
            to="/loans" 
            className={isActive("/loans") ? "active" : ""}
            onClick={handleLinkClick}
          >
            <i className="fas fa-file-invoice-dollar"></i>
            <span>Loans</span>
          </Link>
          <Link 
            to="/calculator" 
            className={isActive("/calculator") ? "active" : ""}
            onClick={handleLinkClick}
          >
            <i className="fas fa-calculator"></i>
            <span>Loan Calculator</span>
          </Link>
          <Link 
            to="/transactions" 
            className={isActive("/transactions") ? "active" : ""}
            onClick={handleLinkClick}
          >
            <i className="fas fa-exchange-alt"></i>
            <span>Transactions</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
