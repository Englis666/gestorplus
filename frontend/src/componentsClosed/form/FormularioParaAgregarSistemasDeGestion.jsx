import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormularioParaAgregarSistemasDeGestion = ({ num_doc, nombres, identrevista, idpostulacion }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        num_doc: "",
        nombres: "",
        estado_salud: "",
        evaluacionRiesgos: "",
        recomendaciones: "",
        aptitudLaboral: "",
        comentarios: "",
        estadoEvaluacion: "",
        identrevista: "",
        idpostulacion: "",
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            num_doc: num_doc || "",
            nombres: nombres || "",
            identrevista: identrevista || "",
            idpostulacion: idpostulacion || "",
        }));
    }, [num_doc, nombres, identrevista, idpostulacion]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "guardarResultadosSistemaDeGestion",
                ...formData,
            });

            if (response.data.success) {
                alert("✅ Resultados guardados con éxito.");
                if (formData.estadoEvaluacion === "Apto") {
                    navigate("/contratos", {
                        state: {
                            num_doc: formData.num_doc,
                            nombres: formData.nombres,
                            identrevista: formData.identrevista,
                            idpostulacion: formData.idpostulacion,
                        },
                    });
                }
            } else {
                alert("❌ Error al guardar los resultados.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("⚠️ Hubo un problema al conectar con el servidor.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0 animate__animated animate__fadeIn">
                <div className="card-body p-4">
                    <h4 className="fw-bold mb-4 d-flex align-items-center">
                        <span className="material-icons text-primary me-2">assignment_turned_in</span>
                        Asignación del sistema de gestión
                    </h4>
                    <p className="text-muted mb-4">
                        Completa los siguientes campos relacionados con la evaluación del aspirante.
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Datos del aspirante */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        name="num_doc"
                                        className="form-control"
                                        value={formData.num_doc}
                                        readOnly
                                    />
                                    <label>Número de documento</label>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        name="nombres"
                                        className="form-control"
                                        value={formData.nombres}
                                        readOnly
                                    />
                                    <label>Nombre completo</label>
                                </div>
                            </div>
                        </div>

                        {/* Campos ocultos */}
                        <input type="hidden" name="identrevista" value={formData.identrevista} />
                        <input type="hidden" name="idpostulacion" value={formData.idpostulacion} />

                        {/* Evaluaciones */}
                        {[
                            { label: "Estado de salud", name: "estado_salud" },
                            { label: "Evaluación de riesgos", name: "evaluacionRiesgos" },
                            { label: "Recomendaciones", name: "recomendaciones" },
                            { label: "Aptitud laboral", name: "aptitudLaboral" },
                            { label: "Comentarios", name: "comentarios" },
                        ].map(({ label, name }) => (
                            <div className="form-floating mb-3" key={name}>
                                <input
                                    type="text"
                                    name={name}
                                    className="form-control"
                                    value={formData[name]}
                                    onChange={handleChange}
                                    placeholder={label}
                                    required
                                />
                                <label>{label}</label>
                            </div>
                        ))}

                        {/* Estado evaluación */}
                        <div className="form-floating mb-4">
                            <select
                                name="estadoEvaluacion"
                                className="form-select"
                                value={formData.estadoEvaluacion}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Apto">Apto</option>
                                <option value="No Apto">No Apto</option>
                            </select>
                            <label>Estado de evaluación</label>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success px-4">
                                <span className="material-icons align-middle me-2">cloud_upload</span>
                                Subir resultados
                            </button>
                            <button type="button" className="btn btn-outline-danger px-4">
                                <span className="material-icons align-middle me-2">close</span>
                                Rechazar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioParaAgregarSistemasDeGestion;
