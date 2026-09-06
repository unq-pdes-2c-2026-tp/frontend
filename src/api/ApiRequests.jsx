import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token") || "";
  return token;
};

export const getAuthHeaders = () => {
  const token = getStoredAuthToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

export const login = (data) => {
  return apiClient.post("/login/", data);
};

export const registerUser = (data) => {
  return apiClient.post("/users/", data);
};

export const getAgencies = () => {
  return apiClient.get("/agencies/");
};

export const uploadProfilePicture = (formData) => {
  return apiClient.post("/users/profile-picture/", formData, {
    headers: getAuthHeaders(),
  });
};

export const deleteProfilePicture = () => {
  return apiClient.delete("/users/profile-picture/", {
    headers: getAuthHeaders(),
  });
};

export default {
  login,
  registerUser,
  getAgencies,
  uploadProfilePicture,
  deleteProfilePicture,
};
