import { Route } from "react-router";

const PublicRoute = ({ path, element }) => {
    return <Route path={path} element={element} />
};

export default PublicRoute;
