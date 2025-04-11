// src/components/FormularioAusencia.jsx
import React, { useState } from "react";
import axios from "axios";

const FormularioAusencia = () => {
    const [solicitud, setSolicitud] = useState({
        fechaInicio: "",
        fechaFin: "",
        tipoAusencia: "",
        descripcion: "",
    });

    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [success, setSuccess] = useState(false);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const validarCampos = () => {
        const erroresTemp = {};
        const { fechaInicio, fechaFin, tipoAusencia, descripcion } = solicitud;

        if (!fechaInicio) erroresTemp.fechaInicio = "La fecha de inicio es obligatoria.";
        if (!fechaFin) erroresTemp.fechaFin = "La fecha de fin es obligatoria.";
        if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
            erroresTemp.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio.";
        }
        if (!tipoAusencia) erroresTemp.tipoAusencia = "Selecciona un tipo de ausencia.";
        if (!descripcion || descripcion.length < 10)
            erroresTemp.descripcion = "La descripción debe tener al menos 10 caracteres.";

        setErrores(erroresTemp);
        return Object.keys(erroresTemp).length === 0;
    };

    const handleSolicitarAusencia = async (e) => {
        e.preventDefault();
        setSuccess(false);

        if (!validarCampos()) return;

        const token = getCookie("auth_token");
        if (!token) {
            alert("Token no encontrado. Inicia sesión nuevamente.");
            return;
        }

        setEnviando(true);

        try {
            await axios.post(
                "http://localhost/gestorplus/backend/",
                {
                    action: "solicitarAusencia",
                    ...solicitud,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSolicitud({
                fechaInicio: "",
                fechaFin: "",
                tipoAusencia: "",
                descripcion: "",
            });
            setErrores({});
            setSuccess(true);
        } catch (err) {
            console.error("Error al enviar la solicitud de ausencia:", err);
            alert("Hubo un problema al enviar la solicitud.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div
            className="container mt-5 card shadow border-0 animate__animated animate__fadeIn"
            style={{ borderRadius: "12px", maxWidth: "600px" }}
        >
            <div className="p-4">
                <h4 className="mb-4 text-primary fw-bold d-flex align-items-center">
                    <span className="material-icons me-2">event_busy</span>
                    Solicitar Ausencia
                </h4>

                {success && (
                    <div className="alert alert-success animate__animated animate__fadeInDown">
                        <i className="material-icons me-2">check_circle</i>
                        Solicitud enviada correctamente.
                    </div>
                )}

                <form onSubmit={handleSolicitarAusencia} noValidate>
                    <div className="mb-3">
                        <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio</label>
                        <input
                            type="date"
                            id="fechaInicio"
                            className={`form-control ${errores.fechaInicio ? "is-invalid" : ""}`}
                            value={solicitud.fechaInicio}
                            onChange={(e) => setSolicitud({ ...solicitud, fechaInicio: e.target.value })}
                        />
                        <div className="invalid-feedback">{errores.fechaInicio}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fechaFin" className="form-label">Fecha de Fin</label>
                        <input
                            type="date"
                            id="fechaFin"
                            className={`form-control ${errores.fechaFin ? "is-invalid" : ""}`}
                            value={solicitud.fechaFin}
                            onChange={(e) => setSolicitud({ ...solicitud, fechaFin: e.target.value })}
                        />
                        <div className="invalid-feedback">{errores.fechaFin}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="tipoAusencia" className="form-label">Tipo de Ausencia</label>
                        <select
                            id="tipoAusencia"
                            className={`form-select ${errores.tipoAusencia ? "is-invalid" : ""}`}
                            value={solicitud.tipoAusencia}
                            onChange={(e) => setSolicitud({ ...solicitud, tipoAusencia: e.target.value })}
                        >
                            <option value="">Seleccione un tipo</option>
                            <option value="Enfermedad">Enfermedad</option>
                            <option value="Personal">Personal</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <div className="invalid-feedback">{errores.tipoAusencia}</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            id="descripcion"
                            rows="3"
                            className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
                            placeholder="Describe el motivo de la ausencia..."
                            value={solicitud.descripcion}
                            onChange={(e) => setSolicitud({ ...solicitud, descripcion: e.target.value })}
                        ></textarea>
                        <div className="invalid-feedback">{errores.descripcion}</div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        disabled={enviando}
                    >
                        {enviando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <span className="material-icons me-2">send</span>
                                Enviar Solicitud
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioAusencia;
