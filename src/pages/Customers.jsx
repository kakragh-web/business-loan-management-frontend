import { useState, useEffect } from "react";
import { customers as initialCustomers } from "../data/mockData";
import { api } from "../services/api";
import { isAdmin } from "../utils/auth";

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.getCustomers().catch(() => null);
  
        if (res && res.ok) {
          const json = await res.json();
          setCustomers(Array.isArray(json) ? json : initialCustomers);
        } else {
          // 401 or any error → use mock data
          setCustomers(initialCustomers);
        }
      } catch (error) {
        console.error("Failed to fetch customers, using mock data", error);
        setCustomers(initialCustomers);
      }
    };
  
    loadCustomers();
  }, []);

  const addCustomer = async (e) => {
    e.preventDefault();

    const newCustomer = {
      name,
      phone,
      email,
    };

    try {
      await api.createCustomer(newCustomer);
      const res = await api.getCustomers().catch(() => null);
      
      if (res && res.ok) {
        const json = await res.json();
        setCustomers(Array.isArray(json) ? json : initialCustomers);
      } else {
        // If refresh fails, add to local state
        const newId = Math.max(...customers.map(c => c.id || 0), 0) + 1;
        setCustomers([...customers, { ...newCustomer, id: newId }]);
      }
      
      setName("");
      setPhone("");
      setEmail("");
      setShowForm(false);
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Failed to create customer", error);
      alert("Failed to create customer. Please try again.");
    }
  };

  const startEdit = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name || "");
    setPhone(customer.phone || "");
    setEmail(customer.email || "");
    setShowForm(false);
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setEmail("");
  };

  const updateCustomer = async (e) => {
    e.preventDefault();

    if (!editingCustomer) return;

    const updatedData = {
      name,
      phone,
      email,
    };

    try {
      await api.updateCustomer(editingCustomer._id || editingCustomer.id, updatedData);
      const res = await api.getCustomers().catch(() => null);
      
      if (res && res.ok) {
        const json = await res.json();
        setCustomers(Array.isArray(json) ? json : initialCustomers);
      } else {
        // If refresh fails, update local state
        setCustomers(customers.map(c => 
          (c._id || c.id) === (editingCustomer._id || editingCustomer.id)
            ? { ...c, ...updatedData }
            : c
        ));
      }
      
      cancelEdit();
      alert("Customer updated successfully!");
    } catch (error) {
      console.error("Failed to update customer", error);
      alert("Failed to update customer. Please try again.");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await api.deleteCustomer(id);
      const res = await api.getCustomers().catch(() => null);
      
      if (res && res.ok) {
        const json = await res.json();
        setCustomers(Array.isArray(json) ? json : initialCustomers);
      } else {
        // If refresh fails, remove from local state
        setCustomers(customers.filter(c => (c._id || c.id) !== id));
      }
      
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Failed to delete customer", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2>Customers</h2>
        {isAdmin() && (
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(!showForm)}
            style={{ 
              whiteSpace: "nowrap",
              minWidth: "auto"
            }}
          >
            <i className="fas fa-plus"></i> <span>Add Customer</span>
          </button>
        )}
      </div>

      {(showForm || editingCustomer) && (
        <div className="form-card">
          <h3>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h3>
          <form onSubmit={editingCustomer ? updateCustomer : addCustomer}>
            <div className="form-row">
              <div className="input-group">
                <label>Customer Name</label>
                <input
                  id="customer-name"
                  name="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  id="customer-phone"
                  name="phone"
                  placeholder="e.g., 024 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input
                id="customer-email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={editingCustomer ? cancelEdit : () => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingCustomer ? "Update Customer" : "Save Customer"}
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
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(customers) ? customers : []).length > 0 ? (
                (Array.isArray(customers) ? customers : []).map((c) => (
                  <tr key={c.id || c._id}>
                    <td>{c.id || c._id || "N/A"}</td>
                    <td>{c.name || "N/A"}</td>
                    <td>{c.phone || "N/A"}</td>
                    <td>{c.email || "N/A"}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td>
                      {isAdmin() && (
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => startEdit(c)}
                            title="Edit Customer"
                          >
                            <i className="fas fa-edit"></i>
                            <span>Edit</span>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteCustomer(c._id || c.id)}
                            title="Delete Customer"
                          >
                            <i className="fas fa-trash"></i>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                      {!isAdmin() && (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#999" }}
                  >
                    No customers found
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