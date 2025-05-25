/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import Navbar from "../../components/Navbar";
import Convocatoria from "../../components/Convocatoria";
import { UserProvider } from "../../context/userContext";


const InicioAspirante = () => {



    return(
        <div>
        <UserProvider>
        <Navbar></Navbar>
        <Convocatoria></Convocatoria>

        </UserProvider>
        </div>

    )
}
export default InicioAspirante;