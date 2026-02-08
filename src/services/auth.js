export const getToken = () => localStorage.getItem("token");

export const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});
//!later the API call will become become
//fetch(url, { headers: authHeader() });
