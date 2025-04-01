import React, { useState } from "react";
import axios from "axios";

const UploadContractModal = ({ isOpen, onClose, num_doc }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadStatus({ type: "error", message: "Por favor selecciona un archivo." });
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("action", "subirContrato");
        formData.append("num_doc", num_doc);

        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                setUploadStatus({ type: "success", message: "Contrato subido con éxito" });
                setTimeout(onClose, 2000); 
            } else {
                setUploadStatus({ type: "error", message: "Error al subir el contrato" });
            }
        } catch (err) {
            setUploadStatus({ type: "error", message: "Hubo un problema al subir el contrato." });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4">
                    <div className="modal-header">
                        <h5 className="modal-title">Subir contrato en PDF</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        <input
                            type="file"
                            accept="application/pdf"
                            className="form-control mb-3"
                            onChange={handleFileChange}
                        />
                        <button className="btn btn-primary w-100" onClick={handleFileUpload}>
                            Subir contrato
                        </button>
                        {uploadStatus && (
                            <div className={`alert mt-3 ${uploadStatus.type === "success" ? "alert-success" : "alert-danger"}`}>
                                {uploadStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </div>
    );
};

export default UploadContractModal;
