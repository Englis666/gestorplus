import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarioDeEntrevistas from "./CalendarioDeEntrevistas";
import ModalHojadeVidaEntrevistado from "./ModalHojadeVidaEntrevistado";

const TablaEntrevistas = () => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerEntrevistas" },
                });
                const data = response.data.Entrevista;
                setEntrevistas(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Hubo un problema al cargar las entrevistas");
            } finally {
                setLoading(false);
            }
        };

        fetchEntrevistas();
    }, []);

    const enviarAsistencia = async (asistencia, identrevista) => {
        try {
            await axios.post("http://localhost/gestorplus/backend/", {
                action: asistencia ? "asistenciaConfirmada" : "asistenciaNoConfirmada",
                data: { identrevista }
            });
        } catch (err) {
            console.error("Error al actualizar la asistencia", err);
            setError("Hubo un problema al corroborar la asistencia");
        }
    };


    const abrirModalHojadevida = () => {
        setModalOpen(true);
    };

    if (loading) return <div>Cargando entrevistas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Entrevistas</h1>

            <div className="row">
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                            <p>Entrevistas en totalidad por empleado</p>
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                    <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Nombre empleado</th>
                                            <th>Numero de documento</th>
                                            <th>Estado</th>
                                            <th>Asistencia</th>
                                            <th>No asistencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {entrevistas.map((entrevista) => (
                                            <tr key={entrevista.identrevista}>
                                                <td>{entrevista.fecha}</td>
                                                <td>{entrevista.hora}</td>
                                                <td>{entrevista.nombres}</td>
                                                <td>{entrevista.num_doc}</td>
                                                <td>{entrevista.estadoEntrevista}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => enviarAsistencia(entrevista.identrevista, true)}
                                                    >
                                                        Asistencia
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => enviarAsistencia(entrevista.identrevista, false)}
                                                    >
                                                        No asistencia
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {selectedInterview && (
                        <div className="card shadow-sm border-1 mb-4" style={{ borderRadius: "10px" }}>
                            <div className="card-body">
                                <h5>Detalles de la Entrevista</h5>
                                <p><strong>Nombre:</strong> {selectedInterview.nombres} {selectedInterview.apellidos}</p>
                                <p><strong>Fecha:</strong> {selectedInterview.fecha}</p>
                                <p><strong>Hora:</strong> {selectedInterview.hora}</p>
                                <p><strong>Lugar:</strong> {selectedInterview.lugarMedio}</p>
                                <p><strong>Descripción:</strong> {selectedInterview.descripcion}</p>
                                <p>id entrevista : {selectedInterview.identrevista}</p>
                                <p>id postulacion {selectedInterview.idpostulacion}</p>
                                <button className="btn btn-secondary me-2" onClick={() => setSelectedInterview(null)}>
                                    Cerrar
                                </button>
                                <button className="btn btn-primary" onClick={abrirModalHojadevida}>
                                    Revisar hoja de vida
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-5">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                            <h5 className="mb-3">Calendario de Entrevistas</h5>
                            <CalendarioDeEntrevistas entrevistas={entrevistas} onSelectInterview={setSelectedInterview} />
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && selectedInterview && (
                <ModalHojadeVidaEntrevistado num_doc={selectedInterview.num_doc} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
};

export default TablaEntrevistas;
