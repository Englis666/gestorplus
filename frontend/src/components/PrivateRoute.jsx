import { Navigate, Outlet } from "react-router-dom";

// Función para obtener el valor de un cookie por nombre
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

// Componente PrivateRoute que permite rutas protegidas
const PrivateRoute = () => {
    const token = getCookie("auth_token");  // Verifica si hay un token de autenticación
    // Si hay token, se permite el acceso a las rutas, de lo contrario redirige a la página de inicio
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
