
export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token") || "";
  return token;
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("user") || "";
  return token;
};
