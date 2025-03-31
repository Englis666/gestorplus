import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ModalHojaDeVida = ({ num_doc = null, identrevista, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (num_doc) {
            fetchHojaDeVida();
        }
    }, [num_doc]);


    const fetchHojaDeVida = async () => {
        try {
            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: {
                    action: "obtenerDatosDelEntrevistado",
                    num_doc: num_doc
                }
            });
            const data = response.data?.Entrevistado || {};
            setFormData(data);

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
                        {Object.keys(formData).length > 0 ? (
                            <>
                                <p><strong>Nombre y Apellido del aspirante:</strong> {formData.nombres}</p>
                                <p><strong>Correo Electrónico:</strong> {formData.email}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</p>
                                <p><strong>Dirección:</strong> {formData.direccion}</p>
                                <p><strong>Ciudad:</strong> {formData.ciudad}</p>
                                <p><strong>Teléfono:</strong> {formData.telefono}</p>
                                <p><strong>Nivel del estudio:</strong> {formData.nivelEstudio}</p>
                                <p><strong>Título del estudio:</strong> {formData.tituloEstudio}</p>
                                <p><strong>Institución del estudio:</strong> {formData.institucionEstudio}</p>
                                <p><strong>Profesión:</strong> {formData.profesion}</p>
                                <p><strong>Descripción del perfil:</strong> {formData.descripcion}</p>
                                <p><strong>Fecha de inicio de experiencia laboral:</strong> {formData.fechaInicioExp}</p>
                                <p><strong>Fecha de finalización de experiencia laboral:</strong> {formData.fechaFinExp}</p>
                                {/* <p>{formData.idpostulacion}</p> */}
                            </>
                        ) : (
                            <p>No se encontraron datos para este usuario.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Rechazar</button>
                        <button className="btn btn-primary" onClick={() => navigate("/SistemaDeGestion", { state: { num_doc, nombres: formData.nombres, identrevista, idpostulacion: formData.idpostulacion } })}>Aceptar y asignarle Sistema de Gestión</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalHojaDeVida;
