import { apiAuthenticatedClient, apiClient } from "./ApiRequests";

export const getPackages = () => apiClient.get("/packages/");
export const getPackageById = (id) => apiClient.get(`/packages/${id}/`);
export const deletePackage = (id) =>
  apiAuthenticatedClient.delete(`/packages/${id}/`);
export const getHotels = () => apiClient.get("/hotels/");
export const getFlights = (params) => apiClient.get("/flights/", { params });
export const createPackage = (packageData) =>
  apiAuthenticatedClient.post("/packages/", packageData);
export const purchasePackage = (packageId) =>
  apiAuthenticatedClient.post("/purchases/", { package: packageId });
