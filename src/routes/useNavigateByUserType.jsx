import { useNavigate } from "react-router";
import { USER_TYPE_MAP } from "../constants";
import { ROUTES } from "./constants";

export function useNavigateByUserType() {
  const navigate = useNavigate();
  const navigateByUserType = (userType) => {
    switch (userType.toString()) {
      case USER_TYPE_MAP.END_USER:
        navigate(ROUTES.PACKAGES);
        break;
      case USER_TYPE_MAP.AGENCY:
        break;
      case USER_TYPE_MAP.ADMIN:
        navigate(ROUTES.ADMIN_AGENCIES);
        break;
    }
  };
  return navigateByUserType;
}
