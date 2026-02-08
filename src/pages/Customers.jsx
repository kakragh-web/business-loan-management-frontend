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

      {showForm && (
        <div className="form-card">
          <form onSubmit={addCustomer}>
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
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Customer
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
                  <button className="btn-icon">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
