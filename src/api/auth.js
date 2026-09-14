import { apiAuthenticatedClient, apiClient } from "./ApiRequests";

export const login = (data) => {
  return apiClient.post("/login/", data);
};
export const logout = () => {
  return apiAuthenticatedClient.post("/logout/");
};

export const registerUser = (data) => {
  return apiClient.post("/users/", data);
};
