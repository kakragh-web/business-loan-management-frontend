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
        <table>
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
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.loanId}</td>
                <td>${t.amount.toLocaleString()}</td>
                <td>{t.type}</td>
                <td>{t.date || new Date().toLocaleDateString()}</td>
                <td>
                  <span className="status-badge active">Completed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
