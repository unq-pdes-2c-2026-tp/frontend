import "./styles/index.css";
import { BrowserRouter, Route, Routes } from "react-router";
// Se conservan para activar los guards cuando se implemente autenticación.
//import PublicRoute from './routes/PublicRoute';
//import PrivateRoute from './routes/PrivateRoute';
import Packages from "./components/Packages";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { Agencies } from "./components/admin/Agencies";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStoredUser } from "./store/local";


const App = () => {
  const user = getStoredUser()
  console.log(user);
  return (
    <BrowserRouter>
      <Routes>
        {/* Ejemplo de routing, los privados en caso de no estar autenticado te redirigen al login. */}
        {/*
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/packages" element={<Packages />} />
                </Route>
                */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/admin-agencies" element={<Agencies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={user? <Packages /> :<Login /> } />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
