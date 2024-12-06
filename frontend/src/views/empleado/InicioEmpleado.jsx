import React from "react";
import TablaEmpleado from "../../componentsClosed/TablaEmpleado"; 
import NavbarClosed from "../../componentsClosed/Navbar";

const InicioEmpleado = () => {
  return (
    <div className="bg-light min-vh-100" style={{ transition: "all 3s ease", display: "flex" }}>
        <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <TablaEmpleado />
      </div>
    </div>
  );
};

export default InicioEmpleado;
