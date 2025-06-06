/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import Navbar from "../../components/Navbar";
import Postulaciones from "../../components/Postulaciones";
import { UserProvider } from "../../context/userContext";

const MisPostulaciones = () => {
    return (
            <div>
                <UserProvider/>
                <Navbar/>
                <Postulaciones />
            </div>
    );
};

export default MisPostulaciones;