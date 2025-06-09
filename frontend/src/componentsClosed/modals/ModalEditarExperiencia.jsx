/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";
import { notificarExito, notificarError } from "../../utils/notificaciones";

const EditarExperiencia = ({
  modalEditarExperiencia,
  toggleModalEditarExperiencia,
  onEditarExperiencia,
  experienciaSeleccionada,
}) => {
  const [formData, setFormData] = useState({
    profesion: "",
    descripcionPerfil: "",
    fechaInicioExp: "",
    fechaFinExp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experienciaSeleccionada && modalEditarExperiencia) {
      setFormData({
        idexperienciaLaboral:
          experienciaSeleccionada.idexperienciaLaboral || "",
        profesion: experienciaSeleccionada.profesion || "",
        descripcionPerfil: experienciaSeleccionada.descripcionPerfil || "",
        fechaInicioExp: experienciaSeleccionada.fechaInicioExp || "",
        fechaFinExp: experienciaSeleccionada.fechaFinExp || "",
      });
    }
  }, [experienciaSeleccionada, modalEditarExperiencia]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ["profesion", "descripcionPerfil", "fechaInicioExp"];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        notificarError(`El campo ${field} es obligatorio.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const token = getCookie("auth_token");
      if (!token) {
        notificarError("No se encontró el token de autenticación.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}actualizarExperiencia`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        notificarExito("Experiencia laboral actualizada correctamente");
        onEditarExperiencia(
          response.data.data || {
            ...formData,
            idexperienciaLaboral: experienciaSeleccionada.idexperienciaLaboral,
          }
        );
        toggleModalEditarExperiencia();
      } else {
        notificarError("Error al actualizar la experiencia laboral.");
      }
    } catch (error) {
      console.error(
        "Error al actualizar:",
        error.response?.data || error.message
      );
      notificarError(
        "Error del servidor: " +
          (error.response?.data?.message || "Inténtalo nuevamente.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal fade ${
        modalEditarExperiencia
          ? "show d-block animate__animated animate__fadeInDown"
          : ""
      }`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalEditarExperienciaLabel"
      aria-hidden={!modalEditarExperiencia}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="material-icons">work</span> Editar Experiencia
                Laboral
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModalEditarExperiencia}
              />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="profesion" className="form-label fw-semibold">
                    Profesión o Cargo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="profesion"
                    name="profesion"
                    value={formData.profesion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label
                    htmlFor="descripcionPerfil"
                    className="form-label fw-semibold"
                  >
                    Descripción del perfil
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcionPerfil"
                    name="descripcionPerfil"
                    value={formData.descripcionPerfil}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="fechaInicioExp"
                    className="form-label fw-semibold"
                  >
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaInicioExp"
                    name="fechaInicioExp"
                    value={formData.fechaInicioExp}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="fechaFinExp"
                    className="form-label fw-semibold"
                  >
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaFinExp"
                    name="fechaFinExp"
                    value={formData.fechaFinExp}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleModalEditarExperiencia}
                disabled={isSubmitting}
              >
                Cerrar
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
  );
};

export default EditarExperiencia;
