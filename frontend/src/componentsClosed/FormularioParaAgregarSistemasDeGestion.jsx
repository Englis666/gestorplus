import React, { useState } from "react";

const FormularioParaAgregarSistemaDeGestion = () => {
    const [formData, setFormData] = useState({
        estado_salud: "",
        evaluacioRiesgos: "",
        recomendaciones: "",
        aptitudLaboral: "",
        comentarios: "",
        estadoEvaluacion: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="row mt-4 container-fluid mt-5 card shadow-sm border-0 mb-5">
            <div className="col-12">
                <h4>Asignación de sistema de gestión</h4>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Resultados de estado de la salud del entrevistado", name: "estado_salud", type: "text" },
                        { label: "Resultados de evaluación de riesgos del entrevistado", name: "evaluacioRiesgos", type: "text" },
                        { label: "Recomendaciones", name: "recomendaciones", type: "text" },
                        { label: "Aptitud Laboral", name: "aptitudLaboral", type: "text" },
                        { label: "Comentarios", name: "comentarios", type: "text" },
                        { label: "Estado de las evaluaciones (Apto o No Apto)", name: "estadoEvaluacion", type: "text" },
                    ].map(({ label, name, type }) => (
                        <div key={name} className="mb-3">
                            <label htmlFor={name} className="form-label">
                                {label}
                            </label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                className="form-control"
                                value={formData[name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary mb-2">
                        Subir resultados del sistema de gestión al entrevistado
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioParaAgregarSistemaDeGestion;
