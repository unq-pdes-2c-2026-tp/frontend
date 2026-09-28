import { apiAuthenticatedClient, apiClient } from "./ApiRequests";

const AGENCIES_URL = "/agencies/";

export const getAgencies = () => {
  return apiClient.get(AGENCIES_URL);
};

export const getDetailedAgencies = () => {
  return apiAuthenticatedClient.get(`${AGENCIES_URL}detailed/`);
};

export const deleteAgency = (agencyId) => {
  return apiAuthenticatedClient.delete(`${AGENCIES_URL}${agencyId}/`);
};

export const createAgency = (agency) => {
  return apiAuthenticatedClient.post(AGENCIES_URL, agency);
};

export const updateAgency = (agency) => {
  return apiAuthenticatedClient.patch(`${AGENCIES_URL}${agency.id}/`, agency);
};
