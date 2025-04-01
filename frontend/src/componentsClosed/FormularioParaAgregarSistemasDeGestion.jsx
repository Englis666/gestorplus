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
        console.log("Datos a enviar:", formData);
        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "guardarResultadosSistemaDeGestion",
                ...formData,
            });

            console.log("Respuesta del servidor:", response.data);
            if (response.data.success) {
                alert("Resultados guardados con éxito.");
                if (formData.estadoEvaluacion === "Apto") {
                    navigate("/contratos", { state: { num_doc: formData.num_doc, nombres: formData.nombres, identrevista: formData.identrevista, idpostulacion: formData.idpostulacion } });
                }
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
                    <div className="mb-3">
                        <label className="form-label">Número de documento del aspirante</label>
                        <input type="number" name="num_doc" className="form-control" value={formData.num_doc} readOnly />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nombre del aspirante</label>
                        <input type="text" name="nombres" className="form-control" value={formData.nombres} readOnly />
                    </div>
                    <input type="hidden" name="identrevista" value={formData.identrevista} readOnly />
                    <input type="hidden" name="idpostulaciones" value={formData.idpostulacion} />
                    {[
                        { label: "Estado de salud del entrevistado", name: "estado_salud" },
                        { label: "Evaluación de riesgos del entrevistado", name: "evaluacionRiesgos" },
                        { label: "Recomendaciones", name: "recomendaciones" },
                        { label: "Aptitud Laboral", name: "aptitudLaboral" },
                        { label: "Comentarios", name: "comentarios" },
                    ].map(({ label, name }) => (
                        <div key={name} className="mb-3">
                            <label className="form-label">{label}</label>
                            <input type="text" name={name} className="form-control" value={formData[name]} onChange={handleChange} required />
                        </div>
                    ))}
                    <div className="mb-3">
                        <label className="form-label">Estado de evaluación (Apto o No Apto)</label>
                        <select name="estadoEvaluacion" className="form-control" value={formData.estadoEvaluacion} onChange={handleChange} required>
                            <option value="">Seleccione una opción</option>
                            <option value="Apto">Apto</option>
                            <option value="No Apto">No Apto</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary mb-2">
                        Subir resultados del sistema de gestión
                    </button>
                    <button type="button" className="btn btn-danger mb-2">
                        Rechazar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioParaAgregarSistemasDeGestion;
