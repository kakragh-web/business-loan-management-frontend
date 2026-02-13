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
  const [status, setStatus] = useState("Active");
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);

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

    if (editingLoan) {
      // Update existing loan
      updateLoan(e);
      return;
    }

    const newLoan = {
      customer: customer.trim(),
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
    setStatus("Active");
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

  const startEdit = (loan) => {
    setEditingLoan(loan);
    setCustomer(loan.customer || "");
    setAmount(loan.amount?.toString() || "");
    setInterestRate(loan.interestRate?.toString() || "");
    setTerm(loan.term?.toString() || "");
    setStatus(loan.status || "Active");
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingLoan(null);
    setAmount("");
    setCustomer("");
    setInterestRate("");
    setTerm("");
    setStatus("Active");
  };

  const updateLoan = async (e) => {
    e.preventDefault();

    if (!editingLoan) return;

    const updatedData = {
      customer: customer.trim(),
      amount: Number(amount),
      interestRate: Number(interestRate),
      term: Number(term),
      status: status,
      date: editingLoan.date || new Date().toISOString().split('T')[0],
    };

    // Optimistically update the loan in the list
    setLoans(prevLoans =>
      prevLoans.map(l =>
        (l._id || l.id) === (editingLoan._id || editingLoan.id)
          ? { ...l, ...updatedData }
          : l
      )
    );

    try {
      const loanId = editingLoan._id || editingLoan.id;
      if (!loanId) {
        alert("Cannot update loan: No ID found");
        return;
      }

      console.log("Updating loan with ID:", loanId, "Data:", updatedData);
      const updateRes = await api.updateLoan(loanId, updatedData);
      
      if (!updateRes || !updateRes.ok) {
        // Get error message from response
        let errorMessage = "Failed to update loan. Please try again.";
        try {
          const errorData = await updateRes.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response", e);
        }
        
        console.error("Update failed:", updateRes.status, updateRes.statusText, errorMessage);
        
        // Revert on failure
        setLoans(prevLoans =>
          prevLoans.map(l =>
            (l._id || l.id) === loanId
              ? editingLoan
              : l
          )
        );
        alert(errorMessage);
        return;
      }

      // Try to get updated loan from response
      try {
        const updatedLoan = await updateRes.json();
        if (updatedLoan) {
          // Merge updated loan with existing data to ensure all fields are preserved
          setLoans(prevLoans =>
            prevLoans.map(l => {
              if ((l._id || l.id) === (editingLoan._id || editingLoan.id)) {
                // Merge API response with our updated data to ensure all fields are present
                return {
                  ...l,
                  ...updatedLoan,
                  customer: updatedLoan.customer || updatedData.customer || l.customer,
                  amount: updatedLoan.amount || updatedData.amount || l.amount,
                  interestRate: updatedLoan.interestRate || updatedData.interestRate || l.interestRate,
                  term: updatedLoan.term || updatedData.term || l.term,
                  status: updatedLoan.status || updatedData.status || l.status,
                  date: updatedLoan.date || updatedData.date || l.date,
                };
              }
              return l;
            })
          );
        } else {
          // If no response, ensure our optimistic update has all fields
          setLoans(prevLoans =>
            prevLoans.map(l => {
              if ((l._id || l.id) === (editingLoan._id || editingLoan.id)) {
                return {
                  ...l,
                  ...updatedData,
                };
              }
              return l;
            })
          );
        }
      } catch (e) {
        console.error("Failed to parse update response", e);
        // If parsing fails, ensure our optimistic update has all fields
        setLoans(prevLoans =>
          prevLoans.map(l => {
            if ((l._id || l.id) === (editingLoan._id || editingLoan.id)) {
              return {
                ...l,
                ...updatedData,
              };
            }
            return l;
          })
        );
      }

      cancelEdit();
      alert("Loan updated successfully!");
    } catch (error) {
      console.error("Failed to update loan", error);
      // Revert on failure
      setLoans(prevLoans =>
        prevLoans.map(l =>
          (l._id || l.id) === (editingLoan._id || editingLoan.id)
            ? editingLoan
            : l
        )
      );
      alert("Failed to update loan. Please try again.");
    }
  };

  const deleteLoan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;

    if (!id) {
      alert("Cannot delete loan: No ID found");
      return;
    }

    const loanToDelete = loans.find(l => (l._id || l.id) === id);
    if (!loanToDelete) {
      alert("Loan not found");
      return;
    }

    // Optimistically remove from list
    setLoans(prevLoans => prevLoans.filter(l => (l._id || l.id) !== id));

    try {
      console.log("Deleting loan with ID:", id);
      const deleteRes = await api.deleteLoan(id);
      
      if (!deleteRes || !deleteRes.ok) {
        // Get error message from response
        let errorMessage = "Failed to delete loan. Please try again.";
        try {
          const errorData = await deleteRes.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response", e);
        }
        
        console.error("Delete failed:", deleteRes.status, deleteRes.statusText, errorMessage);
        
        // Revert on failure
        setLoans(prevLoans => [...prevLoans, loanToDelete].sort((a, b) => {
          const aId = a.id || a._id || 0;
          const bId = b.id || b._id || 0;
          return aId - bId;
        }));
        alert(errorMessage);
        return;
      }

      alert("Loan deleted successfully!");
    } catch (error) {
      console.error("Failed to delete loan", error);
      // Revert on failure
      setLoans(prevLoans => [...prevLoans, loanToDelete].sort((a, b) => {
        const aId = a.id || a._id || 0;
        const bId = b.id || b._id || 0;
        return aId - bId;
      }));
      alert("Failed to delete loan. Please try again.");
    }
  };

  const safeLoans = Array.isArray(loans) ? loans : [];

  return (
    <div className="page-container">
      <div className="page-header" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2>Loans</h2>
        {isAdmin() && !editingLoan && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Create Loan
          </button>
        )}
      </div>

      {(showForm || editingLoan) && (
        <div className="form-card">
          <h3>{editingLoan ? "Edit Loan" : "Create New Loan"}</h3>
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
            {editingLoan && (
              <div className="input-group">
                <label>Status</label>
                <select
                  id="loan-status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={editingLoan ? cancelEdit : () => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingLoan ? "Update Loan" : "Create Loan"}
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
                {isAdmin() && <th>Actions</th>}
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
          <span className={`status-badge ${(l.status || "Active").toLowerCase()}`}>
            {l.status || "Active"}
          </span>
        </td>
        <td>{l.date || new Date().toISOString().split('T')[0]}</td>
        {isAdmin() && (
          <td>
            <div className="action-buttons">
              <button
                className="btn-edit"
                onClick={() => startEdit(l)}
                title="Edit Loan"
              >
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              <button
                className="btn-delete"
                onClick={() => deleteLoan(l._id || l.id)}
                title="Delete Loan"
              >
                <i className="fas fa-trash"></i>
                <span>Delete</span>
              </button>
            </div>
          </td>
        )}
      </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={isAdmin() ? 8 : 7} style={{ textAlign: "center", padding: "2rem", color: "#999" }}>
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
