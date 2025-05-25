import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaAusencias from "../componentsClosed/tables/TablaAusencias";

const Ausencias = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <TablaAusencias />
      </div>
    </div>
  );
};

export default Ausencias;
