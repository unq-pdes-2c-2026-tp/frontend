import { apiAuthenticatedClient } from "./ApiRequests";

export const getTopSpenderUsers = () => {
  return apiAuthenticatedClient.get("/purchases/top-spenders/");
};
export const getTopCitiesByPurchases = () => {
  return apiAuthenticatedClient.get("/purchases/top-cities-by-purchases/");
};

export const getTopCitiesByReviews = () => {
  return apiAuthenticatedClient.get("/purchases/top-cities-by-reviews/");
};
