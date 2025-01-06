import React from "react";

const Experiencia = ({ modalExperiencia, toggleModalExperiencia }) => {
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
              <label htmlFor="cargo" className="form-label">Cargo</label>
              <input
                type="text"
                className="form-control"
                name="cargo"
                id="cargo"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="empresa" className="form-label">Empresa</label>
              <input
                type="text"
                className="form-control"
                name="empresa"
                id="empresa"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaIngreso" className="form-label">Fecha de ingreso</label>
              <input
                type="date"
                className="form-control"
                name="fechaIngreso"
                id="fechaIngreso"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaSalida" className="form-label">Fecha de salida</label>
              <input
                type="date"
                className="form-control"
                name="fechaSalida"
                id="fechaSalida"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={toggleModalExperiencia}>Cerrar</button>
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiencia;
