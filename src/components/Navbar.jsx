import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-theme");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <h3>Business Loan Management System</h3>
      </div>
      <div className="navbar-right">
        <button className="theme-toggle" title="Toggle Theme" onClick={toggleTheme}>
          <i className={`fas fa-${theme === "light" ? "moon" : "sun"}`}></i>
        </button>
        <div className="notification-wrapper">
          <button 
            className="notification-bell" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <i className="fas fa-user"></i>
                  <div>
                    <p>New customer registered</p>
                    <small>2 minutes ago</small>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-file-invoice-dollar"></i>
                  <div>
                    <p>Loan approved</p>
                    <small>1 hour ago</small>
                  </div>
                </div>
                <div className="notification-item">
                  <i className="fas fa-money-bill-wave"></i>
                  <div>
                    <p>Payment received</p>
                    <small>3 hours ago</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
