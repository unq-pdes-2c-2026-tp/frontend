import { apiAuthenticatedClient } from "./ApiRequests";

export const getTopSpenderUsers = () => {
  return apiAuthenticatedClient.get(
    "/purchases/top-spenders/?range=this_month",
  );
};
