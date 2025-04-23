import React, { useEffect, useState } from "react";
import axios from "axios";

const DetallesTrabajo = ({ idconvocatoria }) => {
    const [detalleConvocatoria, setDetalleConvocatoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [aplicado, setAplicado] = useState(false);

    useEffect(() => {
        // Cargar los detalles de la convocatoria
        const fetchConvocatoriaDetails = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: {
                        action: "obtenerDetalleConvocatoria",
                        idconvocatoria: idconvocatoria,
                    },
                });

                if (response.data && response.data.message === "DetalleConvocatoria" && response.data.data) {
                    setDetalleConvocatoria(response.data.data);
                } else {
                    console.error("Detalle de convocatoria no encontrado", response.data);
                    setDetalleConvocatoria(null);
                    setError("No se encontró la convocatoria seleccionada.");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar el detalle: ", err);
                setError("Error al cargar el detalle de la convocatoria");
                setLoading(false);
            }
        };

        fetchConvocatoriaDetails();

        // Verificar si el usuario ya ha aplicado
        const checkIfApplied = async () => {
            try {
                const token = getCookie("auth_token");
        
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: {
                        action: "verificarPostulacion",
                        idconvocatoria: idconvocatoria,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                console.log("Respuesta de la API (verificarPostulacion):", response.data);
                if (response.data && response.data.status === "PostulacionVerificada" && Object.keys(response.data.data).length > 0) {
                    setAplicado(true);
                } else {
                    setAplicado(false);
                }
            } catch (err) {
                console.error("Error al verificar la aplicación: ", err);
            }
        };

        checkIfApplied();
    }, [idconvocatoria]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
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
                console.log("Respuesta de la API (aplicacionDeAspirante):", response.data);
                if (response.data && response.data.message === "success") {
                    alert("Has aplicado a la convocatoria");
                    setSuccessMessage(response.data.message);
                } else if (response.data && response.data.error) {
                    console.error("Error en la respuesta del servidor: ", response.data.error);
                    setError(response.data.error);
                    setAplicado(false);
                } else {
                    console.error("Respuesta inesperada del servidor: ", response.data);
                    setError("Error al aplicar a la convocatoria.");
                    setAplicado(false);
                }
            })
            .catch((err) => {
                console.error("Error al enviar la aplicación: ", err);
                setError("Error al enviar la aplicación.");
                setAplicado(false);
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
                    <h1 className="heading text-center mt-4 text-primary">
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
                                    (e.currentTarget.style.transform = "scale(1.02)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                }
                            >
                                <div className="card-body p-5">
                                    <h3 className="card-title text-primary text-center">
                                        {detalleConvocatoria ? detalleConvocatoria.nombreConvocatoria : "Detalles no disponibles"}
                                    </h3>

                                    <hr className="mb-4" />

                                    <div className="mb-3">
                                        <h5 className="text-secondary">Salario</h5>
                                        <p className="fw-bold text-dark">
                                            {detalleConvocatoria?.salario || "No disponible"}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <h5 className="text-secondary">Requerimientos</h5>
                                        <p className="text-dark">
                                            {detalleConvocatoria?.requisitos || "No disponible"}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <h5 className="text-secondary">Descripción del trabajo</h5>
                                        <p className="text-dark">
                                            {detalleConvocatoria?.descripcion || "No disponible"}
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
                                                transition: "all 0.3s ease-in-out",
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