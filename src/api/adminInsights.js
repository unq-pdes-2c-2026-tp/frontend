import { apiAuthenticatedClient } from "./ApiRequests";

export const getTopSpenderUsers = () => {
  return apiAuthenticatedClient.get(
    "/package-purchases/top-spenders/?range=this_month",
  );
};
