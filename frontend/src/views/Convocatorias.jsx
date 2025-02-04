import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaVacantes from "../componentsClosed/tablaVacantes";

const Convocatorias = () => {
    return (
        <div className="bg-light min-vh-100"
        style={{ display: "flex" , transition: "all 3s ease"}}>
            <NavbarClosed/>
            <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
                <TablaVacantes/>
            </div>
        </div>
    );
};

export default Convocatorias;