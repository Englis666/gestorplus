import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import DetallesTrabajo from "../../components/DetallesTrabajo";

const DetallesDeTrabajo = () => {
    const location = useLocation();
    const { idconvocatoria } = location.state || {}; 

    return (
        <div>
            <Navbar />
            {idconvocatoria ? (
                <DetallesTrabajo idconvocatoria={idconvocatoria} />
            ) : (
                <div>No se encontró la convocatoria seleccionada.</div>
            )}
        </div>
    );
};

export default DetallesDeTrabajo;
