import { apiAuthenticatedClient } from "./ApiRequests";

export const getTopSpenderUsers = () => {
  return new Promise.resolve({data: [
    {
      "id": 2,
      "email": "john@gmail.com",
      "total_spent": "330003.23"
    },
    {
      "id": 5,
      "email": "maya@gmail.com",
      "total_spent": "233204.23"
    },
    {
      "id": 1,
      "email": "albert@gmail.com",
      "total_spent": "20204.23"
    },
  ]})
  return apiAuthenticatedClient.get("/users/top-spenders/?range=this_month");
};