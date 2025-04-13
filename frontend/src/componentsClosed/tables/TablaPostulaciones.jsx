import React, { useState, useEffect } from "react";
import axios from "axios";
import AsignarEntrevistaModal from "../form/AsignarEntrevistaModal";

const TablaPostulaciones = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPostulacion, setSelectedPostulacion] = useState(null);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerPostulaciones" },
                });
                const data = response.data.Postulaciones;
                if (Array.isArray(data)) {
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

    const handleShowModal = (postulacion) => {
        setSelectedPostulacion(postulacion);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostulacion(null);
    };

    if (loading) {
        return <div>Cargando Postulaciones... </div>;
    }
    if (error) {
        return <div>{error}</div>;
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
                                {postulaciones.length === 0 ? (
                                    <tr>
                                        <td className="py-3 px-4" colSpan="4">
                                            <span className="text-dark">No existen postulaciones</span>
                                        </td>
                                    </tr>
                                ) : (
                                    postulaciones.map((postulacion, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">{postulacion.nombres}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">{postulacion.nombreCargo}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-dark">{postulacion.estadoPostulacion}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleShowModal(postulacion, postulacion.idpostulacion)}
                                                >
                                                    Asignar Entrevista
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedPostulacion && (
                <AsignarEntrevistaModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    postulacion={selectedPostulacion}
                />
            )}
        </div>
    );
};

export default TablaPostulaciones;