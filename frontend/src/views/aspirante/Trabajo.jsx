/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import Navbar from "../../components/Navbar";
import ConvocatoriaIndividual from "../../components/ConvocatoriaIndividual";

const Trabajo = () => {
    return (
        <div className="" style={{ transition: "all 0.5s ease-in-out" }}>
            {/* Navbar más oscuro */}
            <div className="bg-gray-800">
                <Navbar />
            </div>

            {/* Fondo gris-blanco */}
            <div className="">
                <ConvocatoriaIndividual />
            </div>
        </div>
    );
};

export default Trabajo;
