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
    api.getLoans()
      .then(res => res.json())
      .then(setLoans)
      .catch(err => console.error("Failed to fetch loans", err));
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
      await api.createLoan(newLoan);
      const res = await api.getLoans();
      setLoans(await res.json());
      setAmount("");
      setCustomer("");
      setInterestRate("");
      setTerm("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create loan", error);
    }
  };

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
                  placeholder="Customer Name"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Loan Amount ($)</label>
                <input
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
              {(Array.isArray(loans) ? loans : []).length > 0 ? (
                (Array.isArray(loans) ? loans : []).map((l) => (
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
