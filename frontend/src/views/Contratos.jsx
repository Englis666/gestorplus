import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaContratos from "../componentsClosed/TablaContratos";

const Contratos = () => {

    return(
        <div className="bg-light min-vh-100" style={{display: "flex", Transition: "all 3s ease"}}>
            <NavbarClosed/>
            <div className="flex-grow-1 p-4" style={{ background: "#ECF0F1"}}>
                <TablaContratos/>
            </div>

        </div>
    )

}
export default Contratos;