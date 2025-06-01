/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaPermisos from "../componentsClosed/tables/TablaPermisos";

const Permisos = () => {
  return (
    <div
      className="bg-light main-layout"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1  main-content"
        style={{ backgroundColor: "#ECF0F1" }}
      >
        <TablaPermisos />
      </div>
    </div>
  );
};

export default Permisos;
