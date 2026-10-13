import { UNSELECTED } from "../constants";
import { apiAuthenticatedClient, apiClient } from "./ApiRequests";

export const getPackages = (agency, search) => {
  const params = agency !== UNSELECTED ? { agency_id: agency } : {};

  if (search) {
    params["search"] = search;
  }
  return apiAuthenticatedClient.get("/packages/", { params });
};
export const getPackageById = (id) =>
  apiAuthenticatedClient.get(`/packages/${id}/`);
export const deletePackage = (id) =>
  apiAuthenticatedClient.delete(`/packages/${id}/`);
export const getHotels = () => apiClient.get("/hotels/");
export const getFlights = (params) => apiClient.get("/flights/", { params });
export const createPackage = (packageData) =>
  apiAuthenticatedClient.post("/packages/", packageData);
export const purchasePackage = (packageId) =>
  apiAuthenticatedClient.post("/purchases/", { package: packageId });
