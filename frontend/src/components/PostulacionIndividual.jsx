import React, { useState } from "react";

const PostulacionIndividual = ({ postulacion }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col">
      <div className="card shadow-lg rounded-4 border-0 text-center p-4">
        <h3 className="fs-4 text-dark mb-3 text-capitalize text-truncate">
          {postulacion.nombreConvocatoria}
        </h3>
        <p className="text-muted">
          Fecha de postulación: {postulacion.fecha_postulacion}
        </p>
        <button className="btn btn-primary" onClick={toggleModal}>
          Ver detalles
        </button>
      </div>

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="modalPostulacionLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPostulacionLabel">
                Detalles de la Postulación
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Descripción:</strong> {postulacion.descripcion}
              </p>
              <p>
                <strong>Requisitos:</strong> {postulacion.requisitos}
              </p>
              <p>
                <strong>Salario:</strong> {postulacion.salario}
              </p>
              <p>
                <strong>Cantidad de Convocatorias:</strong>{" "}
                {postulacion.cantidadConvocatoria}
              </p>
              <p>
                <strong>Nombre del Cargo:</strong> {postulacion.nombreCargo}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostulacionIndividual;
