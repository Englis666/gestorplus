/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import { agregarCargo } from "../../services/Cargos";

const FormularioCargo = ({ onCargoAgregado }) => {
  const [nombreCargo, setNombreCargo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("success");

  const handleInputChange = (e) => {
    setNombreCargo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setTipoMensaje("success");
    try {
      await agregarCargo({ nombreCargo });
      setMensaje("Cargo agregado correctamente.");
      setTipoMensaje("success");
      setNombreCargo("");
      if (onCargoAgregado) onCargoAgregado();
    } catch (error) {
      setMensaje(
        error?.response?.data?.error ||
          "Error al agregar el cargo. Intenta de nuevo."
      );
      setTipoMensaje("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 animate__animated animate__fadeInRight">
      <div className="card-body">
        <h4 className="mb-3 fw-bold d-flex align-items-center">
          <span className="material-icons me-2 text-primary">add_circle</span>
          Agregar nuevo cargo
        </h4>

        <p className="text-muted">
          Este formulario te permite registrar nuevos cargos para las
          convocatorias. Asegúrate de escribir un nombre claro y representativo.
        </p>

        {mensaje && (
          <div
            className={`alert alert-${tipoMensaje} animate__animated animate__fadeIn mb-4`}
            role="alert"
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="nombreCargo"
              name="nombreCargo"
              className="form-control"
              placeholder="Nombre del cargo"
              value={nombreCargo}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="nombreCargo">Nombre del cargo</label>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Agregando...
                </>
              ) : (
                <>
                  <span className="material-icons me-2">save</span>
                  Agregar Cargo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCargo;
