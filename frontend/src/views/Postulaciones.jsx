import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaPostulaciones from "../componentsClosed/TablaPostulaciones";

const Postulaciones = () => {
    return (
        <div className="bg-light min-vh-100" style={{ transition: "all 3s ease", display: "flex" }}>
            <NavbarClosed />
        <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
            <TablaPostulaciones/>
        </div>
        </div>
    );
}
export default Postulaciones;