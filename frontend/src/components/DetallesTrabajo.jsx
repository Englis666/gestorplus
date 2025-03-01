import React, { useEffect, useState } from "react";
import axios from "axios";

const DetallesTrabajo = ({ idconvocatoria }) => {
    const [detalleConvocatoria, setDetalleConvocatoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [aplicado, setAplicado] = useState(false);

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

        checkIfApplied();
    }, [idconvocatoria]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const checkIfApplied = () => {
        const token = getCookie("auth_token");

        axios
            .get("http://localhost/gestorplus/backend/", {
                params: {
                    action: "verificarPostulacion",
                    idconvocatoria: idconvocatoria,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Respuesta de la API:", response.data);
                if (response.data.PostulacionVerificada == null) {
                    setAplicado(false);
                } else {
                    setAplicado(true);
                }
            })
            .catch((err) => {
                console.error("Error al verificar la aplicación: ", err);
            });
    };

    const handleApply = () => {
        const token = getCookie("auth_token");

        const data = {
            action: "aplicacionDeAspirante",
            idconvocatoria: idconvocatoria,
        };

        setAplicado(true);

        axios
            .post("http://localhost/gestorplus/backend/", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.success) {
                    setSuccessMessage(response.data.message);
                } else {
                    console.error("Error en la respuesta del servidor: ", response.data.error);
                    setError(response.data.error);
                }
            })
            .catch((err) => {
                console.error("Error al enviar la aplicación: ", err);
                setError("Error al enviar la aplicación.");
            });
    };

    if (loading) {
        return <div className="text-center py-5">Cargando detalles...</div>;
    }
    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <div
            id="vacante"
            className="d-flex flex-column min-vh-100"
            style={{
                background: "linear-gradient(to bottom, #E3F2FD, #ECF0F1)",
            }}
        >
            <section className="job-details py-5 flex-grow-1">
                <div className="container">
                    <h1 className="heading text-center mb-4 text-primary">
                        Detalles del trabajo
                    </h1>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div
                                className="card shadow-lg rounded-4 border-0"
                                style={{
                                    transition: "transform 0.3s ease-in-out",
                                    background: "white",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1.02)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1)")
                                }
                            >
                                <div className="card-body p-5">
                                    <h3 className="card-title text-primary text-center">
                                        {detalleConvocatoria?.nombreConvocatoria}
                                    </h3>

                                    <hr className="mb-4" />

                                    <div className="mb-3">
                                        <h5 className="text-secondary">
                                            Salario
                                        </h5>
                                        <p className="fw-bold text-dark">
                                            {detalleConvocatoria?.salario}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <h5 className="text-secondary">
                                            Requerimientos
                                        </h5>
                                        <p className="text-dark">
                                            {detalleConvocatoria?.requisitos}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <h5 className="text-secondary">
                                            Descripción del trabajo
                                        </h5>
                                        <p className="text-dark">
                                            {detalleConvocatoria?.descripcion}
                                        </p>
                                    </div>

                                    {successMessage && (
                                        <div className="alert alert-success text-center">
                                            {successMessage}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger text-center">
                                            {error}
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-center mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary rounded-pill px-5 py-2 fw-bold"
                                            style={{
                                                transition:
                                                    "all 0.3s ease-in-out",
                                            }}
                                            onClick={handleApply}
                                            disabled={aplicado}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "#007bff")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "#0d6efd")
                                            }
                                        >
                                            {aplicado ? "Ya aplicado" : "Aplicar ahora"}
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