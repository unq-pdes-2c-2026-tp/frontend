import { useNavigate } from "react-router";
import { USER_TYPE_MAP } from "../constants";


export function useNavigateByUserType() {
  const navigate = useNavigate();
  const navigateByUserType = (userType) => {
    switch (userType.toString()) {
      case USER_TYPE_MAP.END_USER:
        navigate("/packages");
        break;
      case USER_TYPE_MAP.AGENCY:
        break;
      case USER_TYPE_MAP.ADMIN:
        navigate("/admin-agencies")
        break;
    }
  }
  return navigateByUserType
}
