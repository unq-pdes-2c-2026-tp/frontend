import { Navigate, Route } from "react-router";

const PrivateRoute = ({ path, element }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;
