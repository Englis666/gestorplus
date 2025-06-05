/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

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
        console.log("Convocatorias response:", response);
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
    <div
      style={{
        background: "linear-gradient(120deg, #e3f0ff 0%, #f8fbff 100%)",
        minHeight: "100vh",
      }}
    >
      <Banner setSearchTerm={setSearchTerm} />

      {/* Sección de Categorías */}
      <section className="container py-4 text-center">
        <h1
          className="text-primary fw-bold mb-3"
          style={{ fontSize: "2rem", letterSpacing: ".5px" }}
        >
          Categorías de Trabajo
        </h1>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {Array.from(new Set(convocatorias.map((c) => c.nombreCargo))).map(
            (cargo, index) => (
              <button
                key={index}
                className={`badge rounded-pill px-3 py-2 shadow-sm border-0 fw-semibold category-badge ${
                  selectedCategory === cargo
                    ? "bg-primary text-white"
                    : "bg-light text-primary"
                }`}
                style={{
                  fontSize: ".98rem",
                  minWidth: 120,
                  maxWidth: 220,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  border:
                    selectedCategory === cargo
                      ? "2px solid #1976d2"
                      : "2px solid #e3f0ff",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                  display: "inline-block",
                }}
                onClick={() => handleCategoryClick(cargo)}
              >
                <span style={{ fontWeight: 600 }}>{cargo}</span>
                <span
                  className="ms-2 badge bg-white text-primary"
                  style={{ fontSize: ".92em" }}
                >
                  {convocatorias.filter((c) => c.nombreCargo === cargo).length}
                </span>
              </button>
            )
          )}
          {selectedCategory && (
            <button
              className="badge rounded-pill px-3 py-2 shadow-sm border-0 fw-semibold bg-light text-secondary"
              style={{
                fontSize: ".98rem",
                minWidth: 120,
                maxWidth: 220,
                whiteSpace: "nowrap",
                border: "2px solid #e3f0ff",
                display: "inline-block",
              }}
              onClick={() => setSelectedCategory(null)}
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </section>

      {/* Sección de Convocatorias Recientes */}
      <section className="container py-5">
        <h1
          className="text-primary fw-bold text-center mb-4"
          style={{ fontSize: "2.2rem", letterSpacing: ".5px" }}
        >
          Convocatorias Recientes
        </h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
          {filteredConvocatorias.slice(0, 3).map((convocatoria, index) => (
            <div
              key={
                convocatoria.idconvocatoria ||
                `${convocatoria.idcargo}-${index}`
              }
              className="col"
            >
              <div
                className="card shadow-lg rounded-4 border-0 hover-scale h-100"
                style={{
                  transition: "transform 0.3s, box-shadow 0.3s",
                  minHeight: 420,
                  minWidth: 320,
                  maxWidth: 440,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="card-header p-0 rounded-top"
                  style={{
                    height: "230px",
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
                        "linear-gradient(transparent, rgba(25,118,210,0.85))",
                      color: "#fff",
                      padding: "14px 12px 10px 16px",
                      borderRadius: "0 0 1rem 1rem",
                    }}
                  >
                    <h3
                      className="fs-5 text-capitalize m-0"
                      style={{
                        fontWeight: 700,
                        fontSize: "1.18rem",
                        wordBreak: "break-word",
                      }}
                    >
                      {convocatoria.nombreConvocatoria}
                    </h3>
                    <p className="m-0 small" style={{ opacity: 0.85 }}>
                      Publicado: {convocatoria.fechaPublicacion || "-"}
                    </p>
                  </div>
                </div>
                {/* Cuerpo de la tarjeta */}
                <div
                  className="card-body d-flex flex-column align-items-center justify-content-between"
                  style={{ flex: 1 }}
                >
                  <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
                    <span
                      className="p-2 rounded bg-light shadow-sm text-dark small"
                      style={{ minWidth: 110, textAlign: "center" }}
                    >
                      <i className="fas fa-dollar-sign me-1 text-success"></i>
                      {convocatoria.salario}
                    </span>
                    <span
                      className="p-2 rounded bg-light shadow-sm text-dark small"
                      style={{ minWidth: 110, textAlign: "center" }}
                    >
                      <i className="fas fa-briefcase me-1 text-primary"></i>
                      {convocatoria.nombreCargo}
                    </span>
                  </div>
                  <button
                    className="btn btn-primary w-100 rounded-pill py-2 fw-bold mt-auto"
                    style={{ fontSize: "1.08rem", letterSpacing: ".2px" }}
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
            className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold"
            style={{ fontSize: "1.08rem", letterSpacing: ".2px" }}
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
