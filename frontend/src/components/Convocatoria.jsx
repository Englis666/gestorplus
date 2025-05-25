import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoGP from "../assets/GestorplusXFayette.png";
import API_URL from "../config";

const Convocatoria = () => {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL, {
        params: { action: "obtenerConvocatorias" },
      })
      .then((response) => {
        console.log(response);
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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const filteredConvocatorias = convocatorias.filter(
    (convocatoria) =>
      (selectedCategory
        ? convocatoria.nombreCargo === selectedCategory
        : true) &&
      (convocatoria.nombreConvocatoria
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        convocatoria.nombreCargo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const handleCategoryClick = (cargo) => {
    setSelectedCategory(cargo);
  };

  const handleDetailsClick = (convocatoria) => {
    const token = getCookie("auth_token");
    if (token) {
      navigate("/aspirante/DetallesDeTrabajo", {
        state: { idconvocatoria: convocatoria.idconvocatoria },
      });
    } else {
      navigate("/Login");
    }
  };

  if (loading)
    return (
      <div className="text-center text-primary fw-bold mt-5">
        Cargando convocatorias...
      </div>
    );
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div style={{ background: "linear-gradient(to bottom, #E3F2FD, #ECF0F1)" }}>
      <Banner setSearchTerm={setSearchTerm} />

      {/* Sección de Categorías */}
      <section className="container py-5 text-center">
        <h1 className="text-primary fw-bold mb-4">Categorías de Trabajo</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {Array.from(new Set(convocatorias.map((c) => c.nombreCargo))).map(
            (cargo, index) => (
              <div key={index} className="col">
                <div
                  className="card shadow-lg rounded-4 p-4 border-0 hover-scale"
                  onClick={() => handleCategoryClick(cargo)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <h3 className="fs-5 text-dark text-capitalize mb-3">
                    {cargo}
                  </h3>
                  <p className="text-muted">
                    Convocatorias disponibles:{" "}
                    {
                      convocatorias.filter((c) => c.nombreCargo === cargo)
                        .length
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Sección de Convocatorias Recientes */}
      <section className="container py-5">
        <h1 className="text-primary fw-bold text-center mb-4">
          Convocatorias Recientes
        </h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredConvocatorias.slice(0, 3).map((convocatoria, index) => (
            <div
              key={
                convocatoria.idconvocatoria ||
                `${convocatoria.idcargo}-${index}`
              }
              className="col"
            >
              <div
                className="card shadow-lg rounded-4 border-0 hover-scale"
                style={{ transition: "transform 0.3s ease" }}
              >
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
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.7))",
                      color: "#fff",
                      padding: "10px",
                    }}
                  >
                    <h3 className="fs-5 text-capitalize m-0">
                      {convocatoria.nombreConvocatoria}
                    </h3>
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
                    onClick={() => handleDetailsClick(convocatoria)}
                  >
                    Detalles del trabajo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <button
            onClick={() => navigate("/aspirante/Trabajo")}
            className="btn btn-primary rounded-pill px-4 py-2"
          >
            Ver todas las convocatorias
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Convocatoria;
