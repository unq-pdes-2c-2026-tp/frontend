
export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token") || "";
  return token;
};

export const getStoredUser = () => {
  if (typeof window === "undefined") return "";
  const user = localStorage.getItem("user");
  if (!user)
    return null

  return JSON.parse(user);
};
