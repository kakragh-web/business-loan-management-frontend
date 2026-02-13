import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      console.log("Attempting login with email:", email);
      const res = await api.login({ email, password });
      console.log("Login response status:", res.status, res.statusText);

      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = "Invalid email or password";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseErr) {
          // If response isn't JSON, use default message
          console.error("Failed to parse error response", parseErr);
        }
        
        // Check if it's a network/CORS error
        if (res.status === 0 || res.status === 500) {
          errorMessage = "Cannot connect to server. Please check if the backend is running.";
        }
        
        alert(errorMessage);
        console.error("Login failed:", res.status, res.statusText);
        return;
      }

      const data = await res.json(); // { token, user }
      
      if (!data.token) {
        alert("Login failed: No token received from server");
        return;
      }
      
      localStorage.setItem("token", data.token);
      console.log("Login successful, token saved");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert(`Login failed: ${error.message || "Please check your connection and try again."}`);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Staff Login</h2>

        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}