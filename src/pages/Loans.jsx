import { useState, useEffect } from "react";
import { loans as initialLoans } from "../data/mockData";
import { api } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Loans() {
  const [loans, setLoans] = useState(initialLoans);
  const [amount, setAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [term, setTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const res = await api.getLoans().catch(() => null);
  
        if (res && res.ok) {
          try {
            const json = await res.json();
            // Only update if we got valid array data with items
            if (Array.isArray(json) && json.length > 0) {
              // Use functional setState to access current state
              setLoans(prevLoans => {
                const currentCount = prevLoans.length;
                // Only replace if API returns more or equal items (full refresh)
                // Otherwise, merge API data with existing data to avoid losing items
                if (json.length >= currentCount || currentCount === 0) {
                  return json;
                } else {
                  // API returned fewer items, merge with existing to preserve all data
                  const existingIds = new Set(prevLoans.map(l => l.id || l._id));
                  const newItems = json.filter(l => !existingIds.has(l.id || l._id));
                  return [...prevLoans, ...newItems];
                }
              });
            } else {
              // API returned empty array or invalid data, keep existing data
              console.log("API returned empty or invalid data, keeping existing data");
              setLoans(prevLoans => {
                // Don't change state if we already have data
                return prevLoans.length === 0 ? initialLoans : prevLoans;
              });
            }
          } catch (parseErr) {
            console.error("Failed to parse loans response", parseErr);
            setLoans(prevLoans => {
              // Keep existing data if we have it
              return prevLoans.length === 0 ? initialLoans : prevLoans;
            });
          }
        } else {
          // 401 or any error → keep existing data or use mock data
          setLoans(prevLoans => {
            return prevLoans.length === 0 ? initialLoans : prevLoans;
          });
        }
      } catch (err) {
        console.error("Failed to fetch loans, keeping existing data", err);
        setLoans(prevLoans => {
          // Keep existing data if we have it
          return prevLoans.length === 0 ? initialLoans : prevLoans;
        });
      }
    };
  
    loadLoans();
  }, []);

  const addLoan = async (e) => {
    e.preventDefault();

    const newLoan = {
      customer,
      amount: Number(amount),
      interestRate: Number(interestRate),
      term: Number(term),
    };

    try {
      const createRes = await api.createLoan(newLoan);
      
      // Check if creation was successful
      if (!createRes || !createRes.ok) {
        alert("Failed to create loan. Please try again.");
        return;
      }

      // Get current loans count before refresh
      const currentLoans = Array.isArray(loans) ? loans : [];
      const currentCount = currentLoans.length;

      // Try to refresh the list from API
      const res = await api.getLoans().catch(() => null);
      
      if (res && res.ok) {
        try {
          const json = await res.json();
          // If API returns valid data with more or equal loans, use it
          // Otherwise, append new loan to existing list
          if (Array.isArray(json) && json.length >= currentCount) {
            setLoans(json);
          } else {
            // API returned fewer loans, append new loan to existing list
            const newId = Math.max(...currentLoans.map(l => l.id || l._id || 0), 0) + 1;
            // Check if loan already exists (avoid duplicates)
            const customerExists = currentLoans.some(l => l.customer === newLoan.customer && l.amount === newLoan.amount);
            if (!customerExists) {
              setLoans([...currentLoans, { ...newLoan, id: newId, status: "Active", date: new Date().toISOString().split('T')[0] }]);
            } else {
              // Loan already exists, just refresh from API
              setLoans(Array.isArray(json) && json.length > 0 ? json : currentLoans);
            }
          }
        } catch (parseErr) {
          console.error("Failed to parse loans response", parseErr);
          // If refresh fails, add to local state
          const newId = Math.max(...currentLoans.map(l => l.id || l._id || 0), 0) + 1;
          const customerExists = currentLoans.some(l => l.customer === newLoan.customer && l.amount === newLoan.amount);
          if (!customerExists) {
            setLoans([...currentLoans, { ...newLoan, id: newId, status: "Active", date: new Date().toISOString().split('T')[0] }]);
          }
        }
      } else {
        // If refresh fails, add to local state
        const newId = Math.max(...currentLoans.map(l => l.id || l._id || 0), 0) + 1;
        const customerExists = currentLoans.some(l => l.customer === newLoan.customer && l.amount === newLoan.amount);
        if (!customerExists) {
          setLoans([...currentLoans, { ...newLoan, id: newId, status: "Active", date: new Date().toISOString().split('T')[0] }]);
        }
      }
      
      setAmount("");
      setCustomer("");
      setInterestRate("");
      setTerm("");
      setShowForm(false);
      alert("Loan added successfully!");
    } catch (error) {
      console.error("Failed to create loan", error);
      alert("Failed to create loan. Please try again.");
    }
  };

  const safeLoans = Array.isArray(loans) ? loans : [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Loans</h2>
        {isAdmin() && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Create Loan
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={addLoan}>
            <div className="form-row">
              <div className="input-group">
                <label>Customer Name</label>
                <input
                  id="loan-customer"
                  name="customer"
                  placeholder="Customer Name"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Loan Amount ($)</label>
                <input
                  id="loan-amount"
                  name="amount"
                  type="number"
                  placeholder="e.g., 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Interest Rate (%)</label>
                <input
                  id="loan-interest-rate"
                  name="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Term (Months)</label>
                <input
                  id="loan-term"
                  name="term"
                  type="number"
                  placeholder="e.g., 12"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Loan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-scroll-hint">
          <i className="fas fa-arrows-alt-h"></i> Scroll horizontally to see all columns
        </div>
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>Term</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
  {safeLoans.length > 0 ? (
    safeLoans.map((l) => (
      <tr key={l.id || l._id}>
        <td>{l.id || l._id || "N/A"}</td>
        <td>{l.customer || "N/A"}</td>
        <td>${(l.amount || 0).toLocaleString()}</td>
        <td>{l.interestRate ? `${l.interestRate}%` : "N/A"}</td>
        <td>{l.term ? `${l.term} months` : "N/A"}</td>
        <td>
          <span className={`status-badge ${(l.status || "").toLowerCase()}`}>
            {l.status || "N/A"}
          </span>
        </td>
        <td>{l.date || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
        No loans found
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
