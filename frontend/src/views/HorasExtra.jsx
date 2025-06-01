/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import NavbarClosed from "../componentsClosed/Navbar";
import TablaHorasExtra from "../componentsClosed/tables/TablaHorasExtra";
import TablaMinutosTrabajados from "../componentsClosed/tables/TablaMinutosTrabajados";

const HorasExtra = () => {
  return (
    <div className="main-layout">
      <NavbarClosed />
      <div className="main-content">
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: "400px", marginBottom: "1rem" }}>
            <TablaHorasExtra />
          </div>
          <div style={{ flex: 1, minWidth: "400px" }}>
            <TablaMinutosTrabajados />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorasExtra;
