import React from "react";
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import Convocatoria from "../../components/Convocatoria";
import { UserProvider } from "../../context/userContext";


const InicioAspirante = () => {

    return(
        <div>
        <Navbar></Navbar>
        <Banner></Banner>
        <Convocatoria></Convocatoria>
        </div>

    )
}
export default InicioAspirante;