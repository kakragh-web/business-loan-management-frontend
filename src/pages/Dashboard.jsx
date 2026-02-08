import { useState, useEffect } from "react";
import { customers as mockCustomers, loans as mockLoans, transactions } from "../data/mockData";
import StatCard from "../components/StatCard";
import { api } from "../services/api";

export default function Dashboard() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loans, setLoans] = useState(mockLoans);

  useEffect(() => {
    Promise.all([
      api.getCustomers().then(res => res.json()).catch(() => mockCustomers),
      api.getLoans().then(res => res.json()).catch(() => mockLoans)
    ])
      .then(([customersData, loansData]) => {
        setCustomers(customersData);
        setLoans(loansData);
      })
      .catch(err => console.error("Failed to fetch data", err));
  }, []);

  const activeLoans = loans.filter((l) => l.status === "Active").length;
  const totalDisbursed = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
      </div>

      <div className="stats">
        <StatCard title="Total Customers" value={customers.length} icon="users" />
        <StatCard title="Active Loans" value={activeLoans} icon="file-invoice-dollar" />
        <StatCard title="Total Disbursed" value={`$${totalDisbursed.toLocaleString()}`} icon="money-bill-wave" />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon="chart-line" />
      </div>

      <div className="recent-section">
        <div className="section-card">
          <h3>Recent Loans</h3>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.slice(0, 5).map((l) => (
                <tr key={l.id}>
                  <td>{l.customer}</td>
                  <td>${l.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
