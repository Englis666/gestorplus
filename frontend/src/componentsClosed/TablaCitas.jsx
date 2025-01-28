import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarioDeEntrevistas from "./CalendarioDeEntrevistas";

const TablaCitas = () => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null); // Para almacenar la entrevista seleccionada

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerEntrevistas" },
                });
                const data = response.data.Entrevista;
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

        fetchEntrevistas();
    }, []);

    if (loading) {
        return <div>Cargando entrevistas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Filtrar las entrevistas para mostrar solo la seleccionada
    const entrevistasFiltradas = selectedInterview
        ? entrevistas.filter(entrevista => entrevista.identrevista === selectedInterview.identrevista)
        : entrevistas;

    // Función para cerrar el panel y mostrar todas las entrevistas
    const handleClosePanel = () => {
        setSelectedInterview(null); 
    };

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Entrevistas</h1>

            <div className="row">
                {/* Columna de la tabla */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                            <p>Entrevistas en totalidad por empleado</p>
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

                    {/* Panel con la información de la entrevista seleccionada */}
                    {selectedInterview && (
                        <div className="card shadow-sm border-1 mb-4" style={{ borderRadius: "10px" }}>
                            <div className="card-body">
                                <h5>Detalles de la Entrevista</h5>
                                <p><strong>Nombre del empleado:</strong> {selectedInterview.nombres} {selectedInterview.apellidos}</p>
                                <p><strong>Fecha:</strong> {selectedInterview.fecha}</p>
                                <p><strong>Hora:</strong> {selectedInterview.hora}</p>
                                <p><strong>Lugar de la entrevista: </strong> {selectedInterview.lugarMedio}</p>
                                <p><strong>Descripcion de la convocatoria a la que se postulo: </strong>{selectedInterview.descripcion}</p>
                                <button className="btn btn-secondary me-2" onClick={handleClosePanel}>
                                    Cerrar
                                </button>
                                <button className="btn btn-primary"> 
                                    Revisar hoja de vida de entrevistado
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Columna del calendario y panel de detalles */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                            <h5 className="mb-3">Calendario de Entrevistas</h5>
                            <CalendarioDeEntrevistas
                                entrevistas={entrevistas}
                                onSelectInterview={setSelectedInterview} // Función para actualizar la entrevista seleccionada
                            />
                        </div>
                    </div>
                </div>
            </div>

            <h1>Citas generales</h1>

        </div>
    );
};

export default TablaCitas;
