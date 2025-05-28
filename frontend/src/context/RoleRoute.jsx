import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

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

const RoleRoute = ({ allowedRoles }) => {
  const token = getCookie("auth_token");
  const location = useLocation();
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const rol = Number(payload.data.rol);
    if (!allowedRoles.includes(rol)) {
      if ([1, 2, 3].includes(rol)) return <Navigate to="/Inicio" replace />;
      if (rol === 4) return <Navigate to="/aspirante/inicio" replace />;
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  } catch {
    return <Navigate to="/Login" replace />;
  }
};

export default RoleRoute;
