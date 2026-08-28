import './styles/index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
// Se conservan para activar los guards cuando se implemente autenticación.
//import PublicRoute from './routes/PublicRoute';
//import PrivateRoute from './routes/PrivateRoute';
import Packages from './components/Packages';

// Placeholders temporales: reemplazar por los componentes reales cuando estén listos.
const Login = () => <div>Login</div>;

const App = () => {
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
                <Route path="/packages" element={<Packages />} />
            </Routes>
        </BrowserRouter>
    )
};

export default App;
