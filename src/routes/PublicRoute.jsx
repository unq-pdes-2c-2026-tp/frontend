import { redirect, Route } from "react-router";

const PublicRoute = ({ path, element }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (isAuthenticated) {
        return redirect("/");
    }

    return <Route path={path} element={element} />
};

export default PublicRoute;
