import { apiAuthenticatedClient, apiClient } from "./ApiRequests";

export const getPackages = () => apiClient.get("/packages/");
export const getHotels = () => apiClient.get("/hotels/");
export const getFlights = (params) => apiClient.get("/flights/", { params });
export const createPackage = (packageData) =>
  apiAuthenticatedClient.post("/packages/", packageData);