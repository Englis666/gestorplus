import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarioDeEntrevistas from "./CalendarioDeEntrevistas";

const TablaCitaciones = () => {
    const [Citaciones, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);

    useEffect(() => {
        const fetchCitaciones = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerCitaciones" },
                });
                const data = response.data.Citaciones;
                if (Array.isArray(data)) {
                    setEntrevistas(data);
                } else {
                    console.error("Las entrevistas no están en un arreglo");
                    setEntrevistas([]);
                }
            } catch (err) {
                console.error("Error al obtener las entrevistas", err);
                setError("Hubo un problema al cargar las entrevistas");
            } finally {
                setLoading(false);
            }
        };

        fetchCitaciones();
    }, []);

    if (loading) {
        return <div>Cargando Citaciones...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className="container-fluid">
            <h1 className="mb-4">Citaciones</h1>

            <div className="row">
                {/* Columna de la tabla */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                            <p>Citaciones De Empleados Actuales</p>
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                    <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                                        <tr>
                                            <th className="py-3 px-4">Fecha de la entrevista</th>
                                            <th className="py-3 px-4">Hora de la entrevista</th>
                                            <th className="py-3 px-4">Nombre empleado</th>
                                            <th>Acción</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {entrevistasFiltradas.map((entrevista) => (
                                            <tr key={entrevista.identrevista}>
                                                <td className="py-3 px-4">
                                                    <span className="text-dark">{entrevista.fecha}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-dark">{entrevista.hora}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-dark">{entrevista.nombres}</span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm">Asistencia cumplida</button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm">No asistencia</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TablaCitaciones;
