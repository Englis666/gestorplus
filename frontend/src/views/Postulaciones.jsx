import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaPostulaciones from "../componentsClosed/tables/TablaPostulaciones";
import TablaConvocatoriasAgrupadas from "../componentsClosed/tables/TablaConvocatoriasAgrupadas";

const Postulaciones = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 0.3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4"
        style={{
          backgroundColor: "#ECF0F1",
          display: "flex",
          gap: "20px", 
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <TablaConvocatoriasAgrupadas />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TablaPostulaciones />
        </div>
      </div>
    </div>
  );
};

export default Postulaciones;
