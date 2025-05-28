import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../views/Layout";

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

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("auth_token");
    if (token && !isTokenExpired(token)) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const rol = Number(payload.data.rol);
        if ([1, 2, 3].includes(rol)) {
          navigate("/Inicio", { replace: true });
        } else if (rol === 4) {
          navigate("/aspirante/inicio", { replace: true });
        }
      } catch {
        // Si el token es inválido, no hace nada (deja ver la landing)
      }
    }
    // Si no hay token, deja ver la landing (Layout)
  }, [navigate]);

  return <Layout />;
};

export default HomeRedirect;
