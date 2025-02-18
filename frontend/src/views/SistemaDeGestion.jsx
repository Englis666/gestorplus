import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaSistemaDeGestion from "../componentsClosed/TablaSistemaDeGestion";


const SistemaDeGestion = () => {

    return(
        <div className="bg-light min-vh-100" style={{transition: "all 3s ease", display: "flex"}}>
            <NavbarClosed/>
            <div className="flex-grow-1 p-4" style={{background: "#ECF0F1"}}>
                <TablaSistemaDeGestion/>
            </div>

        </div>

    )

}
export default SistemaDeGestion;