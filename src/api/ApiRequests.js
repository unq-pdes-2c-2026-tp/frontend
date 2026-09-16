import axios from "axios";
import { getStoredAuthToken } from "../store/local";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  export const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
  });


  export const getAuthHeaders = () => {
    const token = getStoredAuthToken();
    return token ? { Authorization: `Token ${token}` } : {};
  };

  export const apiAuthenticatedClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
  });

  apiAuthenticatedClient.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...getAuthHeaders() };
    return config;
  });


export const uploadProfilePicture = (formData) => {
  return apiAuthenticatedClient.post("/users/profile-picture/", formData);
};

export const deleteProfilePicture = () => {
  return apiAuthenticatedClient.delete("/users/profile-picture/");
};

export default {
  uploadProfilePicture,
  deleteProfilePicture,
};
