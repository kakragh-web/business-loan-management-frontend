import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Loans from "./pages/Loans";
import Transactions from "./pages/Transactions";
import LoanCalculator from "./pages/LoanCalculator";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./styles/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main>
                  <Navbar />
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main>
                  <Navbar />
                  <Customers />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main>
                  <Navbar />
                  <Loans />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main>
                  <Navbar />
                  <LoanCalculator />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <div className="app-layout">
                <Sidebar />
                <main>
                  <Navbar />
                  <Transactions />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
