/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TablaEmpleado from "../componentsClosed/tables/TablaEmpleado";
import NavbarClosed from "../componentsClosed/Navbar";
import { decodedTokenWithRol, getCookie } from "../utils/Auth";

const Inicio = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (token) {
      try {
        const rol = decodedTokenWithRol(token);
        const jornadaFinalizada =
          localStorage.getItem("jornadaFinalizada") === "true";
        if ([1, 2, 3].includes(rol) && !jornadaFinalizada) {
          setShowBanner(true);
        } else {
          setShowBanner(false);
        }
      } catch {
        setShowBanner(false);
      }
    } else {
      setShowBanner(false);
    }
  }, []);

  return (
    <div
      className="min-vh-100 "
      style={{
        transition: "all 3s ease",
        display: "flex",
        backgroundColor: "#ECF0F1",
      }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1"
        style={{ backgroundColor: "#ECF0F1", padding: "10px" }}
      >
        {showBanner && (
          <div
            style={{
              background: "#ffcccc",
              color: "#a94442",
              padding: "5px",
              borderRadius: "5px",
              top: "0",
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
