import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaCitas from "../componentsClosed/TablaCitas";

const Citas = () => {
  return (
    <div className="bg-light min-vh-100" style={{ transition: "all 3s ease", display: "flex" }}>
        <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <TablaCitas />
      </div>
    </div>
  );
};

export default Citas;
