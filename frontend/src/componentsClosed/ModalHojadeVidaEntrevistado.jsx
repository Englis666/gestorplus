import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalHojaDeVida = ({ num_doc = null, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(num_doc){
          fetchHojaDeVida();
        }
    }, [num_doc]);


    const fetchHojaDeVida = async () => {
        try {

            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: {action: "obtenerDatosDelEntrevistado"},
                data : {num_doc},
            });

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
                        <p><strong>Nombre y Apellido del aspirante</strong>{formData.nombres || "No disponible"}</p>
                        <p><strong>Correo Electronico</strong>{formData.email || "No disponible"}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento | "No disponible"}</p>
                        <p><strong>Dirección:</strong> {formData.direccion || "No disponible"}</p>
                        <p><strong>Ciudad:</strong> {formData.ciudad || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> {formData.telefono || "No disponible"}</p>
                        <p><strong>Nivel del estudio</strong>{formData.nivelEstudio || "No disponible "}</p>
                        <p><strong>Titulo del estudio</strong>{formData.tituloEstudio || "No disponible"}</p>
                        <p><strong>institucion del estudio</strong>{formData.institucionEstudio || "No disponible "}</p>
                        <p><strong>Profesion</strong>{formData.profesion || "No disponible"}</p>
                        <p><strong>Descripcion del perfil</strong>{formData.descripcion || "No disponible"}</p>
                        <p><strong>Fecha donde inicio su experiencia laboral</strong>{formData.inicioExp}</p>
                        <p><strong>Fecha de finalizacion de su experiencia</strong>{formData.finExp || "No disponible"}</p>
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
