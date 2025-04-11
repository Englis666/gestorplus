import React, { useState } from "react";
import axios from 'axios';

const Estudios = ({ modalEstudios, toggleModalEstudios, onAgregarEstudio }) => {
  const [formData, setFormData] = useState({
    action: 'agregarEstudio',
    nivelEstudio: "",
    areaEstudio: "",
    estadoEstudio: "",
    fechaInicioEstudio: "",
    fechaFinEstudio: "",
    tituloEstudio: "",
    institucionEstudio: "",
    ubicacionEstudio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
  const token = getCookie("auth_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const data = { ...formData };

    axios
      .post("http://localhost/gestorplus/backend/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const serverMessage = response.data.message;

        if (serverMessage === "Estudio agregado") {
          alert("Estudio agregado correctamente.");
        } else {
          alert("Hubo un error al agregar el estudio.");
        }
      })
      .catch((error) => {
        console.error("Error al registrar el estudio:", error);
        alert("Ocurrió un error al agregar el estudio. Por favor, inténtalo nuevamente.");
      })
      .finally(() => {
        setIsSubmitting(false);
        toggleModalEstudios();
      });
  };

  return (
    <div
      className={`modal fade ${modalEstudios ? "show" : ""}`}
      style={{ display: modalEstudios ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="modalEstudiosLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalEstudiosLabel">
              Actualizar Estudios
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModalEstudios}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* Formulario Estudios */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nivelEstudio" className="form-label">
                  Nivel de estudio
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nivelEstudio"
                  id="nivelEstudio"
                  value={formData.nivelEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="areaEstudio" className="form-label">
                  Área de estudio
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="areaEstudio"
                  id="areaEstudio"
                  value={formData.areaEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="estadoEstudio" className="form-label">
                  Estado del estudio
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="estadoEstudio"
                  id="estadoEstudio"
                  value={formData.estadoEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fechaInicioEstudio" className="form-label">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaInicioEstudio"
                  id="fechaInicioEstudio"
                  value={formData.fechaInicioEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fechaFinEstudio" className="form-label">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaFinEstudio"
                  id="fechaFinEstudio"
                  value={formData.fechaFinEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tituloEstudio" className="form-label">
                  Título obtenido
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="tituloEstudio"
                  id="tituloEstudio"
                  value={formData.tituloEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="institucionEstudio" className="form-label">
                  Institución educativa
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="institucionEstudio"
                  id="institucionEstudio"
                  value={formData.institucionEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ubicacionEstudio" className="form-label">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="ubicacionEstudio"
                  id="ubicacionEstudio"
                  value={formData.ubicacionEstudio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModalEstudios}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
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
