import { Navigate, Outlet } from "react-router";
import { getStoredUser } from "../store/local";
import { ROUTES } from "./constants";
import Forbidden from "../components/Forbidden";

const PrivateRoute = ({ allowedRoles }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userType = user.user_type?.toString();

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Forbidden />;
  }

  return <Outlet />;
};

export default PrivateRoute;
