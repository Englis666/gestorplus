import React , { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-big-calendar";

const TablaPostulaciones = () => {

    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading ] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchPostulaciones = async () => {
            try{
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerPostulaciones"},
                });
                const data = response.data.Postulacion;
                if (Array.isArray(data)){
                    setPostulaciones(data);
                } else {
                    console.error("Las postulaciones no estan en un arreglo o esta vacia la consulta");
                    setPostulaciones([]);
                }
            } catch (err) {
                console.error("Error al obtener las postulaciones");
                setPostulaciones([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPostulaciones();
    }, []);

    if (loading) {
        return <div>Cargando Postulaciones... </div>
    }
    if (error){
        return <div>{error}</div>
    }


    return (
        <div className="container-fluid">
            <h1>Postulaciones</h1>
                    <div className="card shadow-sm border-0 mb-5">
                        <div className="card-body">
                            <p>Tabla de notificaciones en el sistema de convocatorias</p>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="text-center"> 
                                        <tr>
                                            <th className="py-3 px-4">Nombre del usuario postulante</th>
                                            <th className="py-3 px-4">Cargo de la postulacion</th>
                                            <th className="py-3 px-4">Estado de la postulacion</th>
                                            <th className="py-3 px-4">Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">Alex</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">Desarollador</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">En espera</span>
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">
                                                    Asignarle entrevista
                                                </button>
                                            </td>

                                        </tr>


                                    </tbody>

                                    
                                </table>
                            </div>

                        </div>
                    </div>
        </div>

    )

}

export default TablaPostulaciones;