import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      console.log("Attempting registration with email:", email);
      const res = await api.register({ name, email, password, role: "admin" });
      console.log("Register response status:", res.status, res.statusText);

      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseErr) {
          console.error("Failed to parse error response", parseErr);
        }
        
        alert(errorMessage);
        console.error("Registration failed:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      
      if (!data.token) {
        alert("Registration failed: No token received from server");
        return;
      }
      
      localStorage.setItem("token", data.token);
      console.log("Registration successful, token saved");
      alert("Account created successfully! You are now logged in.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed", error);
      alert(`Registration failed: ${error.message || "Please check your connection and try again."}`);
    }
  };

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
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <h2>{isRegistering ? "Create Account" : "Staff Login"}</h2>

        {isRegistering && (
          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

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
          minLength={6}
        />

        <button type="submit">{isRegistering ? "Create Account" : "Login"}</button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setName("");
              setEmail("");
              setPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}