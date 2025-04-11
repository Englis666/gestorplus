import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload del JWT
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = getCookie("auth_token");

        // Si no hay token o el token está expirado, redirigir al login
        if (!token || isTokenExpired(token)) {
            // Esto asegura que la redirección solo ocurra cuando el navegador esté listo
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 500);
        }
    }, [navigate, location]);
};

export default useAuthRedirect;
