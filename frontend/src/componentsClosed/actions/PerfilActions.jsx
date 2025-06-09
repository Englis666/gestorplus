import React from "react";

const PerfilAcciones = ({
  toggleModalHojaDeVida,
  toggleModalEstudios,
  toggleModalExperiencia,
}) => (
  <div className="mt-4 d-grid gap-2">
    <button
      onClick={toggleModalHojaDeVida}
      className="btn btn-outline-primary animated fadeInUp"
    >
      <i className="material-icons me-2">description</i> Hoja de Vida
    </button>
    <button
      onClick={toggleModalEstudios}
      className="btn btn-outline-primary animated fadeInUp"
    >
      <i className="material-icons me-2">school</i> Estudios
    </button>
    <button
      onClick={toggleModalExperiencia}
      className="btn btn-outline-primary animated fadeInUp"
    >
      <i className="material-icons me-2">work</i> Experiencia Laboral
    </button>
  </div>
);

export default PerfilAcciones;
