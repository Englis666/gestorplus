import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaEmpleados from "../componentsClosed/tables/TablaEmpleados";

const Empleados = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <TablaEmpleados />
      </div>
    </div>
  );
};

export default Empleados;
