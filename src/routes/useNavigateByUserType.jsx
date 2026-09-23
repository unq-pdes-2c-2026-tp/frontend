import { useNavigate } from "react-router";
import { USER_TYPE_MAP } from "../constants";
import { ROUTES } from "./constants";

export function getDefaultRouteByUserType(userType) {
  switch (userType.toString()) {
    case USER_TYPE_MAP.END_USER:
      return ROUTES.PACKAGES;
    case USER_TYPE_MAP.AGENCY:
      return ROUTES.PACKAGES;
    case USER_TYPE_MAP.ADMIN:
      return ROUTES.ADMIN_HOME;
  }
}

export function useNavigateByUserType() {
  const navigate = useNavigate();
  const navigateByUserType = (userType) => {
    const route = getDefaultRouteByUserType(userType);
    if (route) {
      navigate(route);
    }
  };
  return navigateByUserType;
}
