export const getToken = () => localStorage.getItem("token");

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  // Handle demo token format
  if (token === "demo-token" || token.startsWith("demo.")) {
    try {
      // Try to parse JWT-like token
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        return payload.role || "admin"; // Default to admin for demo tokens
      }
      // Fallback: if it's just "demo-token", return admin
      return "admin";
    } catch (error) {
      // If parsing fails but it's a demo token, default to admin
      if (token.includes("demo")) {
        return "admin";
      }
      return null;
    }
  }
  
  // Handle real JWT tokens
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
};

export const isAdmin = () => getUserRole() === "admin";

export const logout = () => {
  localStorage.removeItem("token");
};
