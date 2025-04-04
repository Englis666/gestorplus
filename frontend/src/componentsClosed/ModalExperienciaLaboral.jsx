import React, { useState } from "react";
import axios from "axios";

const Experiencia = ({ modalExperiencia, toggleModalExperiencia, onAgregarExperiencia }) => {
  const [formData, setFormData] = useState({
    action: 'agregarExp',
    profesion: "",
    descripcionPerfil: "",
    fechaInicioExp: "",
    fechaFinExp: "",
    cargo: "",
    empresa: "",
    fechaIngreso: "",
    fechaSalida: "",
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
        if (serverMessage === "Experiencia agregada") {
          alert("Experiencia agregada correctamente");
          onAgregarExperiencia(response.data.nuevaExperiencia); // Llamar a la función para actualizar el estado
        } else {
          alert("Hubo un error al agregar la experiencia.");
        }
      })
      .catch((error) => {
        console.error("Error al registrar la experiencia:", error);
        alert("Ocurrió un error al agregar la experiencia. Por favor, inténtalo nuevamente.");
      })
      .finally(() => {
        setIsSubmitting(false);
        toggleModalExperiencia();
      });
  };

  return (
    <div className={`modal fade ${modalExperiencia ? 'show' : ''}`} style={{ display: modalExperiencia ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalExperienciaLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalExperienciaLabel">Actualizar Experiencia Laboral</h5>
            <button type="button" className="btn-close" onClick={toggleModalExperiencia} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* Formulario Experiencia Laboral */}
            <div className="mb-3">
              <label htmlFor="profesion" className="form-label">Profesión</label>
              <input
                type="text"
                className="form-control"
                name="profesion"
                id="profesion"
                value={formData.profesion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcionPerfil" className="form-label">Descripción del perfil</label>
              <input
                type="text"
                className="form-control"
                name="descripcionPerfil"
                id="descripcionPerfil"
                value={formData.descripcionPerfil}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaInicioExp" className="form-label">Fecha de inicio</label>
              <input
                type="date"
                className="form-control"
                name="fechaInicioExp"
                id="fechaInicioExp"
                value={formData.fechaInicioExp}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaFinExp" className="form-label">Fecha de fin</label>
              <input
                type="date"
                className="form-control"
                name="fechaFinExp"
                id="fechaFinExp"
                value={formData.fechaFinExp}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cargo" className="form-label">Cargo</label>
              <input
                type="text"
                className="form-control"
                name="cargo"
                id="cargo"
                value={formData.cargo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="empresa" className="form-label">Empresa</label>
              <input
                type="text"
                className="form-control"
                name="empresa"
                id="empresa"
                value={formData.empresa}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaIngreso" className="form-label">Fecha de ingreso</label>
              <input
                type="date"
                className="form-control"
                name="fechaIngreso"
                id="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaSalida" className="form-label">Fecha de salida</label>
              <input
                type="date"
                className="form-control"
                name="fechaSalida"
                id="fechaSalida"
                value={formData.fechaSalida}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={toggleModalExperiencia}>Cerrar</button>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiencia;
