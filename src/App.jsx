import "./styles/index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
// Se conservan para activar los guards cuando se implemente autenticación.
//import PublicRoute from './routes/PublicRoute';
//import PrivateRoute from './routes/PrivateRoute';
import Packages from "./components/Packages";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { Agencies } from "./components/admin/Agencies";
import CreatePackage from "./components/CreatePackage";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStoredUser } from "./store/local";
import { SnackbarProvider } from "notistack";
import { ROUTES } from "./routes/constants";
import { AdminHome } from "./components/admin/home/AdminHome";
import { getDefaultRouteByUserType } from "./routes/useNavigateByUserType";

const App = () => {
  const user = getStoredUser();
  const route = getDefaultRouteByUserType(user.user_type);
  return (
    <SnackbarProvider autoHideDuration={5000}>
      <BrowserRouter>
        <Routes>
          {/* Ejemplo de routing, los privados en caso de no estar autenticado te redirigen al login. */}
          {/*
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/packages" element={<Packages />} />
                </Route>
                */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.PACKAGES} element={<Packages />} />
          <Route path="/packages/new" element={<CreatePackage />} />
          <Route path={ROUTES.ADMIN_AGENCIES} element={<Agencies />} />
          <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route
            path="/"
            element={
              user ? (
                route && <Navigate to={route} />
              ) : (
                <Navigate to={ROUTES.LOGIN} />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={ROUTES.PACKAGES} />
              ) : (
                <Navigate to={ROUTES.LOGIN} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
