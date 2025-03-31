import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Convocatoria = () => {
    const navigate = useNavigate();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        axios.get("http://localhost/gestorplus/backend/", { params: { action: "obtenerConvocatorias" } })
            .then((response) => {
                if (Array.isArray(response.data.convocatorias)) {
                    setConvocatorias(response.data.convocatorias);
                } else {
                    setConvocatorias([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar las convocatorias");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center text-primary fw-bold mt-5">Cargando convocatorias...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const filteredConvocatorias = convocatorias.filter(convocatoria =>
        (selectedCategory ? convocatoria.nombreCargo === selectedCategory : true) &&
        (convocatoria.nombreConvocatoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convocatoria.nombreCargo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleCategoryClick = (cargo) => {
        setSelectedCategory(cargo);
    };

    const handleDetailsClick = (convocatoria) => {
        const token = getCookie("auth_token");
        if (token) {
            navigate("/aspirante/DetallesDeTrabajo", { state: { idconvocatoria: convocatoria.idconvocatoria } });
        } else {
            navigate("/Login");
        }
    };

    return (
        <div style={{ background: "linear-gradient(to bottom, #E3F2FD, #ECF0F1)" }}>
            <Banner setSearchTerm={setSearchTerm} />
            <section className="container py-5 text-center">
                <h1 className="text-primary fw-bold mb-4">Categorías de Trabajo</h1>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {Array.from(new Set(convocatorias.map(c => c.nombreCargo))).map((cargo, index) => (
                        <div key={index} className="col">
                            <div className="card shadow-lg rounded-4 p-4 border-0" onClick={() => handleCategoryClick(cargo)} style={{ cursor: "pointer" }}>
                                <h3 className="fs-5 text-dark text-capitalize mb-3">{cargo}</h3>
                                <p className="text-muted">Convocatorias disponibles: {convocatorias.filter(c => c.nombreCargo === cargo).length}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container py-5 text-center">
                <h1 className="text-primary fw-bold mb-4">Convocatorias Recientes</h1>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredConvocatorias.slice(0, 3).map((convocatoria, index) => (
                        <div key={convocatoria.idconvocatoria || `${convocatoria.idcargo}-${index}`} className="col">
                            <div className="card shadow-lg rounded-4 p-4 border-0">
                                <h3 className="fs-4 text-dark text-capitalize text-truncate mb-3">{convocatoria.nombreConvocatoria}</h3>
                                <p className="text-muted">Día de publicación</p>
                                <div className="tags d-flex justify-content-center gap-3 mb-4">
                                    <p className="p-2 rounded bg-light shadow-sm text-dark">
                                        <i className="fas fa-dollar-sign me-2 text-success"></i>
                                        {convocatoria.salario}
                                    </p>
                                    <p className="p-2 rounded bg-light shadow-sm text-dark">
                                        <i className="fas fa-briefcase me-2 text-primary"></i>
                                        {convocatoria.nombreCargo}
                                    </p>
                                </div>
                                <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold" onClick={() => handleDetailsClick(convocatoria)}>
                                    Detalles del trabajo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <button onClick={() => navigate("/aspirante/Trabajo")} className="btn btn-primary rounded-pill px-4 py-2">
                        Ver todas las convocatorias
                    </button>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Convocatoria;
