export const getToken = () => localStorage.getItem("token");

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
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
