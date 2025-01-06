import React from "react";

const Estudios = ({ modalEstudios, toggleModalEstudios }) => {
  return (
    <div className={`modal fade ${modalEstudios ? 'show' : ''}`} style={{ display: modalEstudios ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalEstudiosLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalEstudiosLabel">Actualizar Estudios</h5>
            <button type="button" className="btn-close" onClick={toggleModalEstudios} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* Formulario Estudios */}
            <div className="mb-3">
              <label htmlFor="tituloEstudio" className="form-label">Título obtenido</label>
              <input
                type="text"
                className="form-control"
                name="tituloEstudio"
                id="tituloEstudio"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="institucion" className="form-label">Institución educativa</label>
              <input
                type="text"
                className="form-control"
                name="institucion"
                id="institucion"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fechaGraduacion" className="form-label">Fecha de graduación</label>
              <input
                type="date"
                className="form-control"
                name="fechaGraduacion"
                id="fechaGraduacion"
              />
            </div>
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={toggleModalEstudios}>Cerrar</button>
          <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estudios;
