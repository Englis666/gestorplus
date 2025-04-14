import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoGP from "../assets/GestorplusXFayette.png"; 

const ConvocatoriaIndividual = () => {
    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [filteredConvocatorias, setFilteredConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const handleClick = (convocatoria) => {
        const token = getCookie("auth_token");
        if (token) {
            navigate("/aspirante/DetallesDeTrabajo", { state: { idconvocatoria: convocatoria.idconvocatoria } });
        } else {
            navigate("/Login");
        }
    };

    useEffect(() => {
        axios.get('http://localhost/gestorplus/backend/', {
            params: { action: 'obtenerConvocatorias' },
        })
            .then(response => {
                if (Array.isArray(response.data.convocatorias)) {
                    setConvocatorias(response.data.convocatorias);
                    setFilteredConvocatorias(response.data.convocatorias);
                } else {
                    setConvocatorias([]);
                    setFilteredConvocatorias([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar las convocatorias');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setFilteredConvocatorias(
            convocatorias.filter(convocatoria =>
                convocatoria.nombreConvocatoria.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, convocatorias]);

    if (loading) return <div className="text-center mt-5 text-primary fw-bold">Cargando convocatorias...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: "linear-gradient(to bottom, #E3F2FD, #ECF0F1)" }}>
            <section className="container py-5 flex-grow-1">
                <h1 className="mb-4 text-center text-primary fw-bold">Convocatorias</h1>
                
                <div className="mb-4 text-center">
                    <input
                        type="text"
                        className="form-control w-50 mx-auto shadow-lg border-0 rounded-pill px-4 py-2"
                        placeholder="Buscar vacante por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ transition: "all 0.3s ease-in-out" }}
                        onFocus={(e) => e.target.style.boxShadow = "0px 0px 12px rgba(0, 123, 255, 0.4)"}
                        onBlur={(e) => e.target.style.boxShadow = "none"}
                    />
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredConvocatorias.length > 0 ? (
                        filteredConvocatorias.map(convocatoria => (
                            <div key={convocatoria.idconvocatoria} className="col">
                                <div
                                    className="card shadow-lg rounded-4 border-0"
                                    style={{ overflow: "hidden", transition: "transform 0.3s ease-in-out" }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    {/* Encabezado con logo como background */}
                                    <div
                                        className="card-header p-0 rounded-top"
                                        style={{
                                            height: "220px",
                                            backgroundImage: `url(${logoGP})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                width: "100%",
                                                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                                                color: "#fff",
                                                padding: "10px",
                                            }}
                                        >
                                            <h3 className="fs-5 text-capitalize m-0">{convocatoria.nombreConvocatoria}</h3>
                                            <p className="m-0 small">Día de publicación</p>
                                        </div>
                                    </div>
                                    {/* Cuerpo de la tarjeta */}
                                    <div className="card-body">
                                        <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
                                            <span className="p-2 rounded bg-light shadow-sm text-dark small">
                                                <i className="fas fa-dollar-sign me-1 text-success"></i>
                                                {convocatoria.salario}
                                            </span>
                                            <span className="p-2 rounded bg-light shadow-sm text-dark small">
                                                <i className="fas fa-briefcase me-1 text-primary"></i>
                                                {convocatoria.nombreCargo}
                                            </span>
                                        </div>
                                        <button
                                            className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                                            onClick={() => handleClick(convocatoria)}
                                            style={{ transition: "all 0.3s ease-in-out" }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0d6efd"}
                                        >
                                            Ver detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">No se encontraron resultados.</div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default ConvocatoriaIndividual;
