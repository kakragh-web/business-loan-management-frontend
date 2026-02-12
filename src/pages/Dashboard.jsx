import { useState, useEffect } from "react";
import { customers as mockCustomers, loans as mockLoans, transactions } from "../data/mockData";
import StatCard from "../components/StatCard";
import { api } from "../services/api";
import Chart from "../components/Chart";
import Table from "../components/Table";

export default function Dashboard() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loans, setLoans] = useState(mockLoans);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, loansRes] = await Promise.all([
          api.getCustomers().catch(() => null),
          api.getLoans().catch(() => null),
        ]);

        let customersData = mockCustomers;
        let loansData = mockLoans;

        if (customersRes && customersRes.ok) {
          const json = await customersRes.json();
          customersData = Array.isArray(json) ? json : mockCustomers;
        }

        if (loansRes && loansRes.ok) {
          const json = await loansRes.json();
          loansData = Array.isArray(json) ? json : mockLoans;
        }

        setCustomers(customersData);
        setLoans(loansData);
      } catch (err) {
        console.error("Failed to fetch data, using mock data instead", err);
        setCustomers(mockCustomers);
        setLoans(mockLoans);
      }
    };

    loadData();
  }, []);

  const safeLoans = Array.isArray(loans) ? loans : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const activeLoans = safeLoans.filter((l) => l.status === "Active").length;
  const totalDisbursed = safeLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Build chart data using loans
  const chartData = {
    labels: safeLoans.map((l) => l.customer),
    datasets: [
      {
        label: "Loan Amounts ($)",
        data: safeLoans.map((l) => l.amount),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
      },
    ],
  };

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

      {/* Chart + Recent Loans section */}
      <div className="recent-section">
        <div className="section-card" style={{ flex: 2 }}>
          <h3>Loan Distribution</h3>
          <Chart data={chartData} />
        </div>

        <div className="section-card">
          <h3>Recent Loans</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {safeLoans.length > 0 ? (
                  safeLoans.slice(0, 5).map((l) => (
                    <tr key={l.id || l._id}>
                      <td>{l.customer || "N/A"}</td>
                      <td>${(l.amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${(l.status || "").toLowerCase()}`}>
                          {l.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
                      No loans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customers table using reusable Table component */}
      <div className="recent-section" style={{ marginTop: "2rem" }}>
        <div className="section-card" style={{ width: "100%" }}>
          <h3>Customers</h3>
          <Table data={safeCustomers} />
        </div>
      </div>
    </div>
  );
}
