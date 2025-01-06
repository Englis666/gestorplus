import React from "react";

const ModalHojaDeVida = ({ modalHojaDeVida, toggleModalHojaDeVida }) => {
  return (
    <div className={`modal fade ${modalHojaDeVida ? 'show' : ''}`} style={{ display: modalHojaDeVida ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalHojaDeVidaLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalHojaDeVidaLabel">Actualizar Hoja de Vida</h5>
            <button type="button" className="btn-close" onClick={toggleModalHojaDeVida} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* Formulario Hoja de Vida */}
            <div className="mb-3">
              <label htmlFor="fecha" className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                className="form-control"
                name="fecha"
                id="fecha"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="direccion"
                id="direccion"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ciudad" className="form-label">Ciudad</label>
              <input
                type="text"
                className="form-control"
                name="ciudad"
                id="ciudad"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={toggleModalHojaDeVida}>Cerrar</button>
            <button type="submit" className="btn btn-primary">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHojaDeVida;
