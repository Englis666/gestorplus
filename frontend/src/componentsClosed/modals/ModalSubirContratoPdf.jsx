/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import { subirContratoPDF } from "../../services/Contratos";

const UploadContractModal = ({
  isOpen,
  onClose,
  num_doc,
  nombres,
  idvinculacion,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Por favor selecciona un archivo.",
      });
      return;
    }
    setIsUploading(true);
    try {
      const response = await subirContratoPDF(
        selectedFile,
        idvinculacion,
        num_doc
      );
      if (response && (response.success || response.status === "success")) {
        setUploadStatus({
          type: "success",
          message: "Contrato subido con éxito",
        });
        setTimeout(() => {
          setSelectedFile(null);
          onClose();
        }, 2000);
      } else {
        setUploadStatus({
          type: "error",
          message: "Error al subir el contrato",
        });
      }
    } catch (err) {
      console.error("Error al subir el contrato", err);
      setUploadStatus({
        type: "error",
        message: "Hubo un problema al subir el contrato.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Subir contrato en PDF</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <p>
            Aquí sube el PDF del contrato para el empleado con número de
            identificación {num_doc} y nombres {nombres}
          </p>
          <div className="modal-body text-center">
            <input
              type="file"
              accept="application/pdf"
              className="form-control mb-3"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <button
              className="btn btn-primary w-100"
              onClick={handleFileUpload}
              disabled={isUploading}
            >
              {isUploading ? "Subiendo..." : "Subir contrato"}
            </button>
            {uploadStatus && (
              <div
                className={`alert mt-3 ${
                  uploadStatus.type === "success"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {uploadStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadContractModal;
