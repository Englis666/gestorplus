/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaCargos from "../componentsClosed/tables/TablaCargos";

const Cargos = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <TablaCargos />
      </div>
    </div>
  );
};

export default Cargos;
