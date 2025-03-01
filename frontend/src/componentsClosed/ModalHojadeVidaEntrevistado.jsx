import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalHojaDeVida = ({ num_doc = null, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHojaDeVida();
    }, [num_doc]);


    const fetchHojaDeVida = async () => {
        try {

            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: {action: "obtenerDatosDelEntrevistado"},
            });
            console.log(response);
            setFormData(response.data);
        } catch (error) {
            console.error("Error al obtener la hoja de vida:", error);
            alert("Ocurrió un error al cargar los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="modal-backdrop show">Cargando...</div>;
    }

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Hoja de Vida</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>Nombre y Apellido del aspirante</strong></p>
                        <p><strong>Correo Electronico</strong></p>
                        <p><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</p>
                        <p><strong>Dirección:</strong> {formData.direccion}</p>
                        <p><strong>Ciudad:</strong> {formData.ciudad}</p>
                        <p><strong>Teléfono:</strong> {formData.telefono}</p>
                        <p><strong>Nivel del estudio</strong></p>
                        <p><strong>Titulo del estudio</strong></p>
                        <p><strong>institucion del estudio</strong></p>
                        <p><strong>Profesion</strong></p>
                        <p><strong>Descripcion del perfil</strong></p>
                        <p><strong>Fecha donde inicio su experiencia laboral</strong></p>
                        <p><strong>Fecha de finalizacion de su experiencia</strong></p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Rechazar</button>
                        <button className="btn btn-primary">Aceptar y asignarle Sistema de Gestion</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalHojaDeVida;
