/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaAusencias from "../componentsClosed/tables/TablaAusencias";

const Ausencias = () => {
  return (
    <div className="main-layout">
      <NavbarClosed />
      <div className="main-content">
        <TablaAusencias />
      </div>
    </div>
  );
};

export default Ausencias;
