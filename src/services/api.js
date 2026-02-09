const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const api = {
  login: async (data) =>
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getCustomers: async () =>
    fetch(`${API_URL}/customers`, { headers: authHeader() }),

  createCustomer: async (data) =>
    fetch(`${API_URL}/customers`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(data),
    }),

  deleteCustomer: async (id) =>
    fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    }),

  getLoans: async () => fetch(`${API_URL}/loans`, { headers: authHeader() }),

  createLoan: async (data) =>
    fetch(`${API_URL}/loans`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(data),
    }),

  getTransactions: async () =>
    fetch(`${API_URL}/transactions`, { headers: authHeader() }),
};
