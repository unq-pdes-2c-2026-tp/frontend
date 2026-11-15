export const ROUTES = {
  AGENCIES: "/agencies",
  ADMIN_AGENCIES: "/admin-agencies",
  ADMIN_HOME: "/admin-home",
  FAVORITES: "/favorites",
  LOGIN: "/login",
  PACKAGES: "/packages",
  PACKAGES_NEW: "/packages/new",
  PACKAGES_DETAIL: (id = ":id") => `/packages/${id}`,
  UPDATE_PACKAGE: (id = ":id") => `/packages/${id}/update`,
  PROFILE: "/profile",
  REGISTER: "/register",
};
