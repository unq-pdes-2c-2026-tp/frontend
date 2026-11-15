import { Navigate, Outlet } from "react-router";
import { getStoredUser } from "../store/local";
import { getDefaultRouteByUserType } from "./useNavigateByUserType";

const PublicRoute = () => {
  const user = getStoredUser();

  if (user) {
    const defaultRoute = getDefaultRouteByUserType(user.user_type);
    if (defaultRoute) {
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;
