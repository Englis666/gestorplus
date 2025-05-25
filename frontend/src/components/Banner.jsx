/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";

const Banner = ({ setSearchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  return (
    <article
      className="banner-hero position-relative text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.75), rgba(20, 20, 20, 0.95))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div className="container text-center" style={{ maxWidth: "700px" }}>
        <h1
          style={{ fontSize: "3.2rem", fontWeight: "700", lineHeight: "1.2" }}
        >
          Conecta con oportunidades laborales reales
        </h1>
        <p style={{ fontSize: "1.4rem", color: "#ccc", marginTop: "1rem" }}>
          Encuentra la convocatoria ideal, postúlate y da el siguiente paso en
          tu carrera profesional.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-dark p-4 mt-4 rounded-4 shadow-lg"
        >
          <div className="mb-3 text-start">
            <label
              htmlFor="searchInput"
              className="form-label"
              style={{ fontWeight: "600" }}
            >
              Tipo de trabajo <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="searchInput"
              type="text"
              name="title"
              placeholder="Palabra clave, categoría o cargo"
              required
              maxLength="200"
              className="form-control"
              style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }}
              value={localSearchTerm}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            style={{
              fontSize: "1.2rem",
              padding: "0.8rem",
              fontWeight: "600",
              borderRadius: "0.5rem",
              letterSpacing: "0.5px",
            }}
          >
            🔍 Buscar convocatoria
          </button>
        </form>
      </div>
    </article>
  );
};

export default Banner;
