import "./styles/index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Packages from "./components/packages/Packages";
import PackageDetail from "./components/packages/PackageDetail";
import Favorites from "./components/packages/Favorites";
import Purchases from "./components/packages/Purchases";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { Agencies } from "./components/admin/Agencies";
import CreatePackage from "./components/packages/CreatePackage";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStoredUser } from "./store/local";
import { SnackbarProvider } from "notistack";
import { ROUTES } from "./routes/constants";
import { AdminHome } from "./components/admin/home/AdminHome";
import { getDefaultRouteByUserType } from "./routes/useNavigateByUserType";
import UpdatePackage from "./components/packages/UpdatePackage";
import { USER_TYPE_MAP } from "./constants";

const App = () => {
  const user = getStoredUser();
  const route = user ? getDefaultRouteByUserType(user.user_type) : null;

  const { END_USER, AGENCY, ADMIN } = USER_TYPE_MAP;

  return (
    <SnackbarProvider autoHideDuration={5000}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          <Route
            element={<PrivateRoute allowedRoles={[END_USER, AGENCY, ADMIN]} />}
          >
            <Route path={ROUTES.PACKAGES} element={<Packages />} />
            <Route
              path={ROUTES.PACKAGES_DETAIL()}
              element={<PackageDetail />}
            />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.PURCHASES} element={<Purchases />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[END_USER]} />}>
            <Route path={ROUTES.FAVORITES} element={<Favorites />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[AGENCY, ADMIN]} />}>
            <Route path={ROUTES.PACKAGES_NEW} element={<CreatePackage />} />
            <Route path={ROUTES.UPDATE_PACKAGE()} element={<UpdatePackage />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={[ADMIN]} />}>
            <Route path={ROUTES.ADMIN_AGENCIES} element={<Agencies />} />
            <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
          </Route>

          <Route
            path="/"
            element={
              user && route ? (
                <Navigate to={route} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
