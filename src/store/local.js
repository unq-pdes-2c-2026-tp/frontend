export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export function storeLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userType");
  localStorage.removeItem("user");
}
