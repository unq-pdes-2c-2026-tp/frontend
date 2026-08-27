import './App.css';
import { BrowserRouter, Routes } from 'react-router';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

// Placeholders temporales: reemplazar por los componentes reales cuando estén listos.
const Login = () => <div>Login</div>;
const Packages = () => <div>Packages</div>;

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ejemplo de routing, los privados en caso de no estar autenticado te redirigen al login. */}
                <PublicRoute path="/login" element={<Login />} />
                <PrivateRoute path="/packages" element={<Packages />} />
            </Routes>
        </BrowserRouter>
    )
};

export default App;
