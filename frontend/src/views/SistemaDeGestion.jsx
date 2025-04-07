import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaSistemaDeGestion from "../componentsClosed/TablaSistemaDeGestion";
import FormularioParaAgregarSistemasDeGestion from "../componentsClosed/form/FormularioParaAgregarSistemasDeGestion";
import { useLocation } from "react-router-dom";

const SistemaDeGestion = () => {
    const location = useLocation();
    const { num_doc, nombres, identrevista, idpostulacion } = location.state || {};

    return (
        <div className="bg-light min-vh-100" style={{ transition: "all 3s ease", display: "flex" }}>
            <NavbarClosed />
            <div className="flex-grow-1 p-4" style={{ background: "#ECF0F1" }}>
                <TablaSistemaDeGestion />
                <FormularioParaAgregarSistemasDeGestion num_doc={num_doc} nombres={nombres} identrevista={identrevista} idpostulacion={idpostulacion} />

            </div>

        </div>

    )

}
export default SistemaDeGestion;