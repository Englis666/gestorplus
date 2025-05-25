import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../config";

const AsignarEntrevistaModal = ({ show, handleClose, postulacion }) => {
  const [formData, setFormData] = useState({
    identrevista: "",
    fecha: "",
    hora: "",
    lugarMedio: "",
    postulacion_idpostulaciones: postulacion.idpostulacion,
    estadoEntrevista: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, {
        action: "asignarEntrevista",
        ...formData,
      });
      console.log(response.data);
      if (response.data.Entrevista) {
        alert("✅ Entrevista asignada exitosamente");
        handleClose();
      } else {
        alert("❌ Error al asignar la entrevista");
      }
    } catch (error) {
      console.error("Error al asignar la entrevista", error);
      alert("⚠️ Error al conectar con el servidor");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4 animate__animated animate__fadeInDown">
          <div className="modal-header bg-primary text-white rounded-top-4">
            <h5 className="modal-title">📅 Asignar Entrevista</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                value={formData.postulacion_idpostulaciones}
              />

              <div className="mb-3">
                <label className="form-label">Fecha de la entrevista</label>
                <input
                  type="date"
                  className="form-control"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Lugar o medio de la entrevista
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="lugarMedio"
                  placeholder="Ej. Sala 2 o vía Google Meet"
                  value={formData.lugarMedio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success btn-lg">
                  ✅ Asignar Entrevista
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary mt-2"
                  onClick={handleClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarEntrevistaModal;
