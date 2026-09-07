import { apiClient } from "./ApiRequests";

export const login = (data) => {
  return apiClient.post("/login/", data);
};

export const registerUser = (data) => {
  return apiClient.post("/users/", data);
};
