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
                // Always merge - add new items from API that don't exist in current list
                // This preserves existing data and adds new items
                const existingIds = new Set(prevLoans.map(l => String(l.id || l._id)));
                const newItems = json.filter(l => !existingIds.has(String(l.id || l._id)));
                
                // If API has more items than we have, it's a full refresh - use API data
                // Otherwise, merge new items with existing
                if (json.length > prevLoans.length) {
                  return json;
                } else if (newItems.length > 0) {
                  return [...prevLoans, ...newItems];
                } else {
                  // No new items, keep existing data
                  return prevLoans;
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
      status: "Active",
      date: new Date().toISOString().split('T')[0],
    };

    // Get current loans immediately
    const currentLoans = Array.isArray(loans) ? loans : [];

    // Immediately add to the list (optimistic update)
    const tempId = `temp-${Date.now()}`;
    setLoans([...currentLoans, { ...newLoan, id: tempId, _id: tempId }]);

    // Clear form immediately
    setAmount("");
    setCustomer("");
    setInterestRate("");
    setTerm("");
    setShowForm(false);

    try {
      const createRes = await api.createLoan(newLoan);
      
      // Check if creation was successful
      if (!createRes || !createRes.ok) {
        // Revert the optimistic update on failure
        setLoans(currentLoans);
        alert("Failed to create loan. Please try again.");
        return;
      }

      // Try to get the created loan from the response
      let createdLoan = null;
      try {
        const createData = await createRes.json();
        if (createData && (createData.id || createData._id)) {
          createdLoan = createData;
        }
      } catch (e) {
        // Response might not have JSON body, that's okay
      }

      // Update the temporary loan with the real one from API
      if (createdLoan) {
        setLoans(prevLoans => 
          prevLoans.map(l => 
            (l.id === tempId || l._id === tempId) ? createdLoan : l
          )
        );
      }
      
      alert("Loan added successfully!");
    } catch (error) {
      console.error("Failed to create loan", error);
      // Revert the optimistic update on failure
      setLoans(currentLoans);
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
    safeLoans.map((l, index) => {
      // Show sequential number (1, 2, 3...) instead of ID
      const displayNumber = index + 1;
      const loanId = l.id || l._id || index;
      
      return (
      <tr key={loanId}>
        <td>{displayNumber}</td>
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
      );
    })
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
