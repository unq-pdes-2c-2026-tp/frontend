import { apiAuthenticatedClient } from "./ApiRequests";

export const getTopSpenderUsers = () => {
  return apiAuthenticatedClient.get("/purchases/top-spenders/");
};
export const getTopCities = () => {
  return apiAuthenticatedClient.get("/purchases/top-cities/");
};
