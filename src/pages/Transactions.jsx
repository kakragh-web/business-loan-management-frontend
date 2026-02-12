import { useState, useEffect } from "react";
import { transactions as initialTransactions } from "../data/mockData";
import { api } from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    api.getTransactions()
      .then(res => res.json())
      .then(setTransactions)
      .catch(err => console.error("Failed to fetch transactions", err));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Transactions</h2>
      </div>

      <div className="table-card">
        <div className="table-scroll-hint">
          <i className="fas fa-arrows-alt-h"></i> Scroll horizontally to see all columns
        </div>
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(transactions) ? transactions : []).length > 0 ? (
                (Array.isArray(transactions) ? transactions : []).map((t) => (
                  <tr key={t.id || t._id}>
                    <td>{t.id || t._id || "N/A"}</td>
                    <td>{t.loanId || "N/A"}</td>
                    <td>${(t.amount || 0).toLocaleString()}</td>
                    <td>{t.type || "N/A"}</td>
                    <td>{t.date || new Date().toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge active">Completed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
