import { Navigate, Outlet } from "react-router-dom";
import { getCookie, isTokenExpired } from '../hook/useAuthCheck'; 

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const PrivateRoute = () => {
    const token = getCookie("auth_token");
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
