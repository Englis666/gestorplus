/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import NavbarClosed from "../componentsClosed/Navbar";
import TablaJornadas from "../componentsClosed/tables/TablaJornadas";
import FinalizarJornada from "../componentsClosed/FinalizarJornada";
const Jornadas = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#ECF0F1", display: "flex" }}
      >
        <div style={{ flex: 2 }}>
          <TablaJornadas />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FinalizarJornada />
        </div>
      </div>
    </div>
  );
};

export default Jornadas;
