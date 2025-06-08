/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";

const Estudios = ({ modalEstudios, toggleModalEstudios, onAgregarEstudio }) => {
  const [formData, setFormData] = useState({
    nivelEstudio: "",
    areaEstudio: "",
    estadoEstudio: "",
    fechaInicioEstudio: "",
    fechaFinEstudio: "",
    tituloEstudio: "",
    institucionEstudio: "",
    ubicacionEstudio: "",
    modalidad: "",
    paisInstitucion: "",
    duracionEstudio: "",
    materiasDestacadas: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Limpiar errores cuando el modal se cierra
    if (!modalEstudios) {
      setErrors({});
      setFormData({
        nivelEstudio: "",
        areaEstudio: "",
        estadoEstudio: "",
        fechaInicioEstudio: "",
        fechaFinEstudio: "",
        tituloEstudio: "",
        institucionEstudio: "",
        ubicacionEstudio: "",
        modalidad: "",
        paisInstitucion: "",
        duracionEstudio: "",
        materiasDestacadas: "",
      });
    }
  }, [modalEstudios]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("auth_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "nivelEstudio",
      "areaEstudio",
      "estadoEstudio",
      "fechaInicioEstudio",
      "fechaFinEstudio",
      "tituloEstudio",
      "institucionEstudio",
      "ubicacionEstudio",
      "modalidad",
      "paisInstitucion",
      "duracionEstudio",
      "materiasDestacadas",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es obligatorio.";
      }
    });

    // Validación de fechas
    if (formData.fechaInicioEstudio && formData.fechaFinEstudio) {
      const inicio = new Date(formData.fechaInicioEstudio);
      const fin = new Date(formData.fechaFinEstudio);
      if (inicio > fin) {
        newErrors.fechaFinEstudio =
          "La fecha de fin no puede ser anterior a la fecha de inicio.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    axios
      .post(`${API_URL}agregarEstudio`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Respuesta del servidor:", res);
        alert("✅ Estudio agregado correctamente.");

        if (res.data && res.data.data) {
          onAgregarEstudio(res.data.data);
        } else {
          onAgregarEstudio(formData);
        }
      })
      .catch((err) => {
        console.error("Error response:", err.response?.data || err.message);
        alert("❌ Error al guardar estudio.");
      })
      .finally(() => {
        setIsSubmitting(false);
        toggleModalEstudios();
      });
  };

  return (
    <div
      className={`modal fade ${
        modalEstudios
          ? "show d-block animate__animated animate__fadeInDown"
          : ""
      }`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalEstudiosLabel"
      aria-hidden={!modalEstudios}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <span className="material-icons">school</span> Agregar Estudios
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModalEstudios}
            />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit} className="row g-3">
              {[
                { label: "Nivel de estudio", name: "nivelEstudio" },
                { label: "Área de estudio", name: "areaEstudio" },
                { label: "Estado del estudio", name: "estadoEstudio" },
                {
                  label: "Fecha de inicio",
                  name: "fechaInicioEstudio",
                  type: "date",
                },
                {
                  label: "Fecha de fin",
                  name: "fechaFinEstudio",
                  type: "date",
                },
                { label: "Título obtenido", name: "tituloEstudio" },
                { label: "Institución educativa", name: "institucionEstudio" },
                { label: "Ubicación", name: "ubicacionEstudio" },
                { label: "Modalidad del estudio", name: "modalidad" },
                { label: "País de la Institución", name: "paisInstitucion" },
                { label: "Duración del estudio", name: "duracionEstudio" },
                { label: "Materias Destacadas", name: "materiasDestacadas" },
              ].map(({ label, name, type = "text" }) => (
                <div className="col-md-6" key={name}>
                  <label htmlFor={name} className="form-label fw-semibold">
                    {label}
                  </label>
                  <input
                    type={type}
                    className={`form-control ${
                      errors[name] ? "is-invalid" : ""
                    }`}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                  />
                  {errors[name] && (
                    <div className="invalid-feedback">{errors[name]}</div>
                  )}
                </div>
              ))}

              <div className="col-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={toggleModalEstudios}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" />{" "}
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-icons me-1">save</span> Guardar
                      cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estudios;
