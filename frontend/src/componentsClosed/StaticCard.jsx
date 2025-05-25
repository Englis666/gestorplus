/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

const StatisticCard = ({ icon, title, value }) => (
  <div className="col-12 col-md-5 col-lg-4">
    <div
      className="card shadow-lg border-0 rounded-4"
      style={{
        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#ffffff",
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Icono */}
      <div
        className="material-icons"
        style={{
          fontSize: "3rem",
          color: "#3498db",
          marginBottom: "1rem",
        }}
      >
        {icon}
      </div>
      <div className="text-center">
        <h5 className="fs-6 text-muted">{title}</h5>
        <h3 className="fs-4" style={{ color: "#333" }}>
          {value}
        </h3>
      </div>
    </div>
  </div>
);

export default StatisticCard;
