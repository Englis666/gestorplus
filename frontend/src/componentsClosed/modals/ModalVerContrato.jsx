/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

const ModalVerContratoPdf = ({ pdfUrl, closeModal }) => {
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Contrato PDF</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body" style={{ height: "80vh" }}>
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalVerContratoPdf;
