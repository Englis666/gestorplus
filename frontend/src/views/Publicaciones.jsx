import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import PublicacionesComp from "../componentsClosed/PublicacionesComp";

const Publicaciones = () => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <PublicacionesComp />
      </div>
    </div>
  );
};
export default Publicaciones;
