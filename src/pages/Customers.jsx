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
    api
      .getCustomers()
      .then((res) => res.json())
      .then(setCustomers);
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
      const res = await api.getCustomers();
      setCustomers(await res.json());
      setName("");
      setPhone("");
      setEmail("");
      setShowForm(false);
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
      const res = await api.getCustomers();
      setCustomers(await res.json());
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
      const res = await api.getCustomers();
      setCustomers(await res.json());
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Failed to delete customer", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Customers</h2>
        {isAdmin() && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <i className="fas fa-plus"></i> Add Customer
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
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
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
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email || "N/A"}</td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
                <td>
                  {isAdmin() && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => startEdit(c)}
                        style={{ 
                          backgroundColor: "#3b82f6", 
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="btn-icon btn-danger" 
                        onClick={() => deleteCustomer(c._id || c.id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  )}
                  {!isAdmin() && (
                    <span style={{ color: "#999", fontStyle: "italic" }}>View only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
