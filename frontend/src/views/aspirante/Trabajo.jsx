import React from "react";
import Navbar from "../../components/Navbar";
import FiltroTrabajo from "../../components/FiltroTrabajo";
import { UserProvider } from "../../context/userContext";
import ConvocatoriaIndividual from "../../components/ConvocatoriaIndividual";
const Trabajo = () => {
    
    return(
        <div>
            <Navbar/>
            <FiltroTrabajo/>
            <ConvocatoriaIndividual/>
        </div>
    );
};
export default Trabajo;