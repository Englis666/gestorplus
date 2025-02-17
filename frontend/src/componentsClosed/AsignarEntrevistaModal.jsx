import React, { useState } from "react";
import axios from "axios";

const AsignarEntrevistaModal = ({ show, handleClose, postulacion }) => {
    const [formData, setFormData] = useState({
        identrevista: "",
        fecha: "",
        hora: "",
        lugarMedio: "",
        postulacion_idpostulaciones: postulacion.idpostulacion,
        estadoEntrevista: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "asignarEntrevista",
                ...formData
            });
            if (response.data.success) {
                alert("Entrevista asignada exitosamente");
                handleClose();
            } else {
                alert("Error al asignar la entrevista");
            }
        } catch (error) {
            console.error("Error al asignar la entrevista", error);
            alert("Error al asignar la entrevista");
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Asignar Entrevista</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                           
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Hora</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Lugar/Medio</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="lugarMedio"
                                    value={formData.lugarMedio}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Asignar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsignarEntrevistaModal;
