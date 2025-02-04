import React, { useEffect, useState } from "react";
import axios from "axios";

const DetallesTrabajo = ({ idconvocatoria }) => {
    const [detalleConvocatoria, setDetalleConvocatoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/gestorplus/backend/", {
                params: {
                    action: "obtenerDetalleConvocatoria",
                    idconvocatoria: idconvocatoria,
                },
            })
            .then((response) => {
                if (response.data.DetalleConvocatoria) {
                    setDetalleConvocatoria(response.data.DetalleConvocatoria);
                } else {
                    console.error("Detalle de convocatoria no encontrado");
                    setDetalleConvocatoria(null);
                    setError("No se encontró la convocatoria seleccionada.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar el detalle: ", err);
                setError("Error al cargar el detalle de la convocatoria");
                setLoading(false);
            });
    }, [idconvocatoria]);

    const handleApply = () => {

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
          };
          
          const token = getCookie("auth_token");

        axios
            .post("http://localhost/gestorplus/backend/", {
                Authorization: `Bearer ${token}` ,
                action: "aplicacionDeAspirante",
                idconvocatoria: idconvocatoria,
            })
            .then((response) => {
                if (response.data.success) {
                    setSuccessMessage("Aplicación enviada con éxito.");
                } else {
                    setError("No se pudo completar la aplicación.");
                }
            })
            .catch((err) => {
                console.error("Error al enviar la aplicación: ", err);
                setError("Error al enviar la aplicación.");
            });
    };

    if (loading) {
        return <div>Cargando detalles...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="vacante" className="d-flex flex-column min-vh-100"  style={{backgroundColor: "#ECF0F1"}}>
            <section className="job-details py-5 flex-grow-1">
                <div className="container">
                    <h1 className="heading text-center mb-4">Detalles del trabajo</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h3 className="card-title text-primary">
                                        {detalleConvocatoria?.nombreCargo}
                                    </h3>

                                    <div className="mb-3">
                                        <h5>Salario</h5>
                                        <p>{detalleConvocatoria?.salario}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Requerimientos</h5>
                                        <p>{detalleConvocatoria?.requerimientos}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Descripción del trabajo</h5>
                                        <p>{detalleConvocatoria?.descripcion}</p>
                                    </div>

                                    {successMessage && (
                                        <div className="alert alert-success">
                                            {successMessage}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary px-5 py-2"
                                            onClick={handleApply}
                                        >
                                            Aplicar ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer bg-dark text-white py-3 mt-auto">
                <div className="container text-center">
                    <div className="credit">
                        &copy; 2024 <span>Desarrolladores de Gestor Plus</span> | Todos los derechos reservados
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DetallesTrabajo;
