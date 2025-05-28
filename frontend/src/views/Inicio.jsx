/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TablaEmpleado from "../componentsClosed/tables/TablaEmpleado";
import NavbarClosed from "../componentsClosed/Navbar";

const Inicio = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró ningún token. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      const userNumDoc = decoded?.data?.num_doc;

      if (isExpired) {
        console.error("El token ha expirado. Redirigiendo al login...");
        document.cookie =
          "auth_token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        navigate("/login");
      } else {
        console.log("Número de documento del usuario:", userNumDoc);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error.message);
      navigate("/login");
    }
  }, [navigate]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Banner solo para roles 1, 2, 3 y jornada no finalizada
  const token = getCookie("auth_token");
  let showBanner = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const rol = Number(decoded?.data?.rol);
      const jornadaFinalizada =
        localStorage.getItem("jornadaFinalizada") === "true";
      if ([1, 2, 3].includes(rol) && !jornadaFinalizada) {
        showBanner = true;
      }
    } catch {}
  }

  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        {showBanner && (
          <div
            style={{
              background: "#ffcccc",
              color: "#a94442",
              padding: "12px",
              textAlign: "center",
              fontWeight: "bold",
              zIndex: 9999,
              marginBottom: "16px",
            }}
          >
            ⚠️ Debes finalizar la jornada antes de salir del sistema.
          </div>
        )}
        <TablaEmpleado />
      </div>
    </div>
  );
};

export default Inicio;
