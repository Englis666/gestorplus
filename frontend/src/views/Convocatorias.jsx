/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import NavbarClosed from "../componentsClosed/Navbar";
import TablaVacantes from "../componentsClosed/tables/TablaVacantes";

const Convocatorias = () => {
  return (
    <div
      className="bg-light min-vh-100 main-layout"
      style={{ display: "flex", transition: "all 3s ease" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4 main-content"
        style={{ backgroundColor: "#ECF0F1" }}
      >
        <TablaVacantes />
      </div>
    </div>
  );
};

export default Convocatorias;
