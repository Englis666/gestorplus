import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";

const Certificados = () => {
  const fechaEmision = new Date().toLocaleDateString("es-ES");
  return (
    <div className="bg-light min-vh-100" style={{ transition: "all 3s ease", display: "flex" }}>
      <NavbarClosed />
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#ECF0F1" }}>
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-header bg-primary text-white text-center py-4">
            <h1 className="mb-0">Certificado de Autenticidad</h1>
          </div>
          <div className="card-body p-4">
            <p className="card-text mb-2">
              <strong>Documento de certificacion La Fayette</strong>
            </p>
            <p className="card-text mb-2">
              <strong>Rol ejercido del empleado:</strong> 
            </p>
            <p className="card-text mb-4">
              <strong>Certificación:</strong> Esta hoja certifica que <strong></strong> pertenece a la empresa La Frayette como <strong></strong>. Este certificado tiene valor de acuerdo con las normativas de La Frayette en Colombia, siendo válido en los procesos internos de la organización.
            </p>
            <p className="card-text mb-2">
              <strong>Fecha de emisión:</strong> {fechaEmision}
            </p>
          </div>
          <div className="card-footer text-center">
            <p className="mb-1">Firma autorizada: La Frayette</p>
            <p className="mb-1">_______________________</p>
            <p className="mb-0">Representante autorizado</p>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="text-center mt-4">
          <a className="btn btn-secondary px-5 py-2">
            Volver al inicio
          </a>
          <button className="btn btn-primary px-5 py-2 ms-3">
            Descargar certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificados;
