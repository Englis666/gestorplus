import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "animate.css"; // Asegúrate de importar esto

const ModalHojaDeVida = ({ num_doc = null, identrevista, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (num_doc) {
            fetchHojaDeVida();
        }
    }, [num_doc]);

    const fetchHojaDeVida = async () => {
        try {
            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: {
                    action: "obtenerDatosDelEntrevistado",
                    num_doc: num_doc
                }
            });
            const data = response.data?.Entrevistado || {};
            setHasData(Object.keys(data).length > 0);
            setFormData(data);
        } catch (error) {
            console.error("Error al obtener la hoja de vida:", error);
            alert("Ocurrió un error al cargar los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="modal-backdrop show d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered animate__animated animate__fadeInDown">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header bg-info text-white rounded-top-4">
                        <h5 className="modal-title">🧾 Hoja de Vida del Aspirante</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {!hasData ? (
                            <div className="alert alert-warning d-flex justify-content-between align-items-center">
                                <div>
                                    ⚠️ Este aspirante aún no ha registrado su hoja de vida.
                                </div>
                                <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>👤 Nombre:</strong> {formData.nombres}</li>
                                <li className="list-group-item"><strong>📧 Correo:</strong> {formData.email}</li>
                                <li className="list-group-item"><strong>🎂 Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</li>
                                <li className="list-group-item"><strong>🏠 Dirección:</strong> {formData.direccion}</li>
                                <li className="list-group-item"><strong>🌆 Ciudad:</strong> {formData.ciudad}</li>
                                <li className="list-group-item"><strong>📞 Teléfono:</strong> {formData.telefono}</li>
                                <li className="list-group-item"><strong>🎓 Nivel de Estudio:</strong> {formData.nivelEstudio}</li>
                                <li className="list-group-item"><strong>🏅 Título Obtenido:</strong> {formData.tituloEstudio}</li>
                                <li className="list-group-item"><strong>🏫 Institución:</strong> {formData.institucionEstudio}</li>
                                <li className="list-group-item"><strong>💼 Profesión:</strong> {formData.profesion}</li>
                                <li className="list-group-item"><strong>🧠 Perfil:</strong> {formData.descripcion}</li>
                                <li className="list-group-item"><strong>📅 Inicio Experiencia:</strong> {formData.fechaInicioExp}</li>
                                <li className="list-group-item"><strong>📅 Fin Experiencia:</strong> {formData.fechaFinExp}</li>
                            </ul>
                        )}
                    </div>
                    <div className="modal-footer d-flex justify-content-between">
                        <button className="btn btn-outline-danger" onClick={onClose}>
                            ❌ Rechazar
                        </button>
                        {hasData && (
                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    navigate("/SistemaDeGestion", {
                                        state: {
                                            num_doc,
                                            nombres: formData.nombres,
                                            identrevista,
                                            idpostulacion: formData.idpostulacion
                                        }
                                    })
                                }
                            >
                                ✅ Asignar al Sistema de Gestión
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalHojaDeVida;
