import React, { useState, useEffect } from "react";
import axios from "axios";

const EditarEstudio = ({ modalEditarEstudio, toggleModalEditarEstudio, onEditarEstudio, estudioSeleccionado }) => {
  const [formData, setFormData] = useState({
    tituloEstudio: "",
    institucionEstudio: "",
    nivelEstudio: "",
    areaEstudio: "",
    estadoEstudio: "",
    fechaInicioEstudio: "",
    fechaFinEstudio: "",
    ubicacionEstudio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (estudioSeleccionado && modalEditarEstudio) {
      setFormData({
        idestudio: estudioSeleccionado.idestudio || "",
        tituloEstudio: estudioSeleccionado.tituloEstudio || "",
        institucionEstudio: estudioSeleccionado.institucionEstudio || "",
        nivelEstudio: estudioSeleccionado.nivelEstudio || "",
        areaEstudio: estudioSeleccionado.areaEstudio || "",
        estadoEstudio: estudioSeleccionado.estadoEstudio || "",
        fechaInicioEstudio: estudioSeleccionado.fechaInicioEstudio || "",
        fechaFinEstudio: estudioSeleccionado.fechaFinEstudio || "",
        ubicacionEstudio: estudioSeleccionado.ubicacionEstudio || "",
      });
    }
  }, [estudioSeleccionado, modalEditarEstudio]);

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
    const requiredFields = [
      "tituloEstudio", 
      "institucionEstudio", 
      "nivelEstudio", 
      "areaEstudio", 
      "estadoEstudio", 
      "fechaInicioEstudio", 
      "ubicacionEstudio"
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        alert(`El campo ${field} es obligatorio.`);
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
      if (!token) return alert("No se encontró el token de autenticación.");

      const response = await axios.patch(
        "http://localhost/gestorplus/backend/",
        { 
          ...formData,
          action: "actualizarEstudio" 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        alert("Estudio actualizado correctamente");
        onEditarEstudio(response.data.data || { ...formData, idestudio: estudioSeleccionado.idestudio });
        toggleModalEditarEstudio();
      } else {
        alert("Error al actualizar el estudio.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error.message);
      alert("Error del servidor: " + (error.response?.data?.message || "Inténtalo nuevamente."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal fade ${modalEditarEstudio ? "show d-block animate__animated animate__fadeInDown" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalEditarEstudioLabel"
      aria-hidden={!modalEditarEstudio}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="material-icons">school</span> Editar Estudio
              </h5>
              <button type="button" className="btn-close" onClick={toggleModalEditarEstudio} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="tituloEstudio" className="form-label fw-semibold">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tituloEstudio"
                    name="tituloEstudio"
                    value={formData.tituloEstudio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="institucionEstudio" className="form-label fw-semibold">Institución</label>
                  <input
                    type="text"
                    className="form-control"
                    id="institucionEstudio"
                    name="institucionEstudio"
                    value={formData.institucionEstudio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="nivelEstudio" className="form-label fw-semibold">Nivel</label>
                  <select
                    className="form-select"
                    id="nivelEstudio"
                    name="nivelEstudio"
                    value={formData.nivelEstudio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione nivel</option>
                    <option value="Bachillerato">Bachillerato</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Especialización">Especialización</option>
                    <option value="Maestría">Maestría</option>
                    <option value="Doctorado">Doctorado</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="areaEstudio" className="form-label fw-semibold">Área</label>
                  <input
                    type="text"
                    className="form-control"
                    id="areaEstudio"
                    name="areaEstudio"
                    value={formData.areaEstudio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="estadoEstudio" className="form-label fw-semibold">Estado</label>
                  <select
                    className="form-select"
                    id="estadoEstudio"
                    name="estadoEstudio"
                    value={formData.estadoEstudio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione estado</option>
                    <option value="En curso">En curso</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Abandonado">Abandonado</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaInicioEstudio" className="form-label fw-semibold">Fecha de inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaInicioEstudio"
                    name="fechaInicioEstudio"
                    value={formData.fechaInicioEstudio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fechaFinEstudio" className="form-label fw-semibold">Fecha de fin</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaFinEstudio"
                    name="fechaFinEstudio"
                    value={formData.fechaFinEstudio}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="ubicacionEstudio" className="form-label fw-semibold">Ubicación</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ubicacionEstudio"
                    name="ubicacionEstudio"
                    value={formData.ubicacionEstudio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={toggleModalEditarEstudio} disabled={isSubmitting}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" /> Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-icons me-1">save</span> Guardar cambios
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

export default EditarEstudio;