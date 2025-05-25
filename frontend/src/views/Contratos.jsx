/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaContratos from "../componentsClosed/tables/TablaContratos";
import { useLocation } from "react-router-dom";
const Contratos = () => {
  const location = useLocation();
  const { num_doc, nombres, identrevista, idpostulacion } =
    location.state || {};

  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ background: "#ECF0F1" }}>
        <TablaContratos
          num_doc={num_doc}
          nombres={nombres}
          identrevista={identrevista}
          idpostulacion={idpostulacion}
        />
      </div>
    </div>
  );
};
export default Contratos;
