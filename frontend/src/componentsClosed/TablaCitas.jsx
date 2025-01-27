import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const TablaCitas = () => {

    const [entrevista, setEntrevista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        try{
        
            axios
                .get("http://localhost/gestorplus/backend/", {
                params: {action : "obtenerEntrevistas"},
            })
            .then((response) => {
                const entrevista = response.data.Entrevista;
                if(Array.isArray(entrevista)){
                    setEntrevista(entrevista);
                } else{
                    console.error("Las entrevistas no estan en un arreglo");
                    setEntrevista([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener las entrevistas" , err);
                setError("Hubo un problema al cargar las entrevistas");
                setLoading(false);
            });

        } catch (error){
            console.error("Error al decodificar el token " , error);
            setError("Token invalido o malformado");
            setLoading(false);
        }
    });

    if(loading){
        return <div> Cargando entrevistas... </div>;
    }

    if (error){
        return <div>{error}</div>;
    }


    return (
        <div>
            <h1>Entrevistas</h1>

            <div className="row g-4">
                <div className="col-12 col-md-7">
                    <div className="card shadow-sm border-0 mb-5"
                    style={{ maxHeight: "450px" , overflowY: "auto", borderRadius: "10px"}}>
                        <div className="card-body">
                            <p>Entrevistas en totalidad por empleado</p>
                            <div className="table-responsive">
                                <table className="table table-hover"
                                style={{backgroundColor: "#f8f9fa" , borderRadius: "10px"}}>
                                    <thead className="text-center" style={{backgroundColor: "#e9ecef"}}>
                                        <tr>
                                            <th className="py-3 px-4">Fecha de la entrevista</th>
                                            <th className="py-3 px-4">Hora de la entrevista</th>
                                            <th className="py-3 px-4">Nombre empleado</th>
                                            <th>Accion</th>
                                            <th>Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">Ejemplo de fecha</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">12:00 (Ejemplo)</span>
                                            </td>


                                            <td className="py-3 px-4">
                                                <span className="text-dark"> Ejemplo de nombre</span>
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">Asistencia cumplida</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">No asistencia</button>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    

    )
};

export default TablaCitas;