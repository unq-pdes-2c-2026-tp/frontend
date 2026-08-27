import { redirect, Route } from "react-router";

const PrivateRoute = ({ path, element }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (isAuthenticated) {
        return redirect("/login");
    }

    return <Route path={path} element={element} />
};

export default PrivateRoute;
