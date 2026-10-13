export const ROUTES = {
  AGENCIES: "/agencies",
  ADMIN_AGENCIES: "/admin-agencies",
  ADMIN_HOME: "/admin-home",
  LOGIN: "/login",
  PACKAGES: "/packages",
  PACKAGES_NEW: "/packages/new",
  PACKAGES_DETAIL: (id = ":id") => `/packages/${id}`,
  PROFILE: "/profile",
  REGISTER: "/register",
};
