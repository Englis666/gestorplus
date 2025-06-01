/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useEffect, useState } from "react";
import TablaEmpleado from "../componentsClosed/tables/TablaEmpleado";
import NavbarClosed from "../componentsClosed/Navbar";
import { decodedTokenWithRol, getCookie } from "../utils/Auth";

const Inicio = () => {
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
    <div style={{ minHeight: "100vh", display: "flex", background: "#ECF0F1" }}>
      <div className="main-layout">
        <NavbarClosed />
        <div className="main-content">
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
    </div>
  );
};

export default Inicio;
