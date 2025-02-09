import React from "react";
import TablaEmpleado from "../../componentsClosed/TablaEmpleado"; 
import NavbarClosed from "../../componentsClosed/Navbar";

const InicioRRHH = () => {
  return (
    <div className="bg-light min-vh-100" style={{ transition: "all 1s ease", display: "flex" }}>
      {/* Barra de navegación */}
        <NavbarClosed />
      {/* Contenido principal */}
      <div className="flex-grow-1 p-4" style={{ background: "linear-gradient(to bottom,rgb(229, 239, 247), #ECF0F1)" }}>
        <TablaEmpleado action="obtenerTodasLasNotificaciones" />
      </div>
    </div>
  );
};

export default InicioRRHH;
