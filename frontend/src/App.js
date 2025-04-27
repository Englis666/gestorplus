import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'animate.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './App.css';
import React, { useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom'; 
import { UserProvider } from './context/userContext';

import Login from './views/Login';
import Registro from './views/Registro';
import Perfil from './views/perfil';
import Layout from './views/Layout';

// Aspirante
import Trabajo from './views/aspirante/Trabajo';
import DetallesDeTrabajo from "./views/aspirante/DetallesTrabajo";
import MisPostulaciones from './views/aspirante/MisPostulaciones';
import InicioAspirante from './views/aspirante/InicioAspirante';

// Otras vistas
import Jornadas from './views/Jornadas';
import Ausencias from './views/Ausencias';
import Quejas from './views/Quejas';
import Empleados from './views/Empleados';
import Entrevistas from './views/Entrevistas';
import Certificados from './views/Certificados';
import Convocatorias from './views/Convocatorias';
import HorasExtra from './views/HorasExtra';
import Vacaciones from './views/Vacaciones';
import Postulaciones from './views/Postulaciones';
import Cargos from './views/Cargos';
import Contratos from './views/Contratos';
import SistemaDeGestion from './views/SistemaDeGestion';
import Permisos from './views/Permisos';
import Publicaciones from './views/Publicaciones';

// Vistas Recursos Humanos
import Inicio from './views/Inicio';
import PazySalvo from './views/PazYSalvos';

// Hooks
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

// Componente PrivateRoute
const PrivateRoute = () => {
    const token = getCookie('auth_token');
    const location = useLocation();

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

// Componente para verificar la autenticación al inicio
const AuthCheck = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token || isTokenExpired(token)) {
            if (location.pathname !== '/Login' && location.pathname !== '/Registro' && location.pathname !== '/') {
                navigate("/Login", { replace: true });
            }
        }
    }, [navigate, location]);

    return null; // Este componente no renderiza nada visual
};

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AuthCheck /> 
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Layout />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/Registro" element={<Registro />} />

                        {/* Rutas protegidas */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/Perfil" element={<Perfil />} />
                            <Route path="/aspirante/inicio" element={<InicioAspirante />} />
                            <Route path="/aspirante/Trabajo" element={<Trabajo />} />
                            <Route path="/aspirante/DetallesDeTrabajo" element={<DetallesDeTrabajo />} />
                            <Route path="/aspirante/MisPostulaciones" element={<MisPostulaciones />} />
                            <Route path="/Jornadas" element={<Jornadas />} />
                            <Route path="/HorasExtra" element={<HorasExtra />} />
                            <Route path="/Ausencias" element={<Ausencias />} />
                            <Route path="/Permisos" element={<Permisos />} />
                            <Route path="/Publicaciones" element={<Publicaciones />} />
                            <Route path="/Vacaciones" element={<Vacaciones />} />
                            <Route path="/Quejas" element={<Quejas />} />
                            <Route path="/Empleados" element={<Empleados />} />
                            <Route path="/Entrevistas" element={<Entrevistas />} />
                            <Route path="/Convocatorias" element={<Convocatorias />} />
                            <Route path="/Postulaciones" element={<Postulaciones />} />
                            <Route path="/Contratos" element={<Contratos />} />
                            <Route path="/SistemaDeGestion" element={<SistemaDeGestion />} />
                            <Route path="/Cargos" element={<Cargos />} />
                            <Route path="/PazYsalvo" element={<PazySalvo />} />
                            <Route path="/Certificados" element={<Certificados />} />
                            <Route path="/Inicio" element={<Inicio />} />
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;