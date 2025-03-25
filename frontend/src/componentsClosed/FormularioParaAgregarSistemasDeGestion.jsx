import React, { useState, useEffect } from "react";
import axios from "axios";

const FormularioParaAgregarSistemasDeGestion = ({ num_doc, nombres }) => {
    const [formData, setFormData] = useState({
        num_doc: "",
        nombres: "",
        estado_salud: "",
        evaluacionRiesgos: "",
        recomendaciones: "",
        aptitudLaboral: "",
        comentarios: "",
        estadoEvaluacion: "",
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            num_doc: num_doc || "",
            nombres: nombres || "",
        }));
    }, [num_doc, nombres]);

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
                action: "guardarResultadosSistemaGestion",
                ...formData,
            });

            if (response.data.success) {
                alert("Resultados guardados con éxito.");
            } else {
                alert("Error al guardar los resultados.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Hubo un problema al conectar con el servidor.");
        }
    };

    return (
        <div className="container-fluid mt-5 card shadow-sm border-0 mb-5">
            <div className="col-12">
                <h4>Asignación de sistema de gestión</h4>
                <form onSubmit={handleSubmit}>
                    {/* Número de documento */}
                    <div className="mb-3">
                        <label className="form-label">Número de documento del aspirante</label>
                        <input
                            type="number"
                            name="num_doc"
                            className="form-control"
                            value={formData.num_doc}
                            readOnly
                        />
                    </div>

                    {/* Nombre del aspirante */}
                    <div className="mb-3">
                        <label className="form-label">Nombre del aspirante</label>
                        <input
                            type="text"
                            name="nombres"
                            className="form-control"
                            value={formData.nombres}
                            readOnly
                        />
                    </div>

                    {/* Campos del formulario */}
                    {[
                        { label: "Estado de salud del entrevistado", name: "estado_salud" },
                        { label: "Evaluación de riesgos del entrevistado", name: "evaluacionRiesgos" },
                        { label: "Recomendaciones", name: "recomendaciones" },
                        { label: "Aptitud Laboral", name: "aptitudLaboral" },
                        { label: "Comentarios", name: "comentarios" },
                        { label: "Estado de evaluación (Apto o No Apto)", name: "estadoEvaluacion" },
                    ].map(({ label, name }) => (
                        <div key={name} className="mb-3">
                            <label className="form-label">{label}</label>
                            <input
                                type="text"
                                name={name}
                                className="form-control"
                                value={formData[name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    {/* Botón de enviar */}
                    <button type="submit" className="btn btn-primary mb-2">
                        Subir resultados del sistema de gestión
                    </button>
                    <button className="btn btn-danger mb-2">
                        Rechazar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioParaAgregarSistemasDeGestion;
