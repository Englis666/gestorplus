import React, { useState, useEffect } from "react";
import axios from "axios";

const Estadisticas = () => {
  const [totalEntradas, setTotalEntradas] = useState(0); 
  const [totalAusencias, setTotalAusencias] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/gestorplus/backend/', {
      params: { action: 'obtenerTotalEstadisticas' }, 
    })
    .then(response => {
      console.log('Respuesta completa:', response);

      const { totalEntradas, totalAusencias } = response.data;  
      setTotalEntradas(totalEntradas);
      setTotalAusencias(totalAusencias);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error al obtener las estadísticas:', err);
      setError(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <section className="container-fluid d-flex justify-content-center mt-5">
      <div className="row g-5">
        {/* PRIMERA ESTADÍSTICA: Total de Ausencias */}
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
            <div
              className="material-icons"
              style={{
                fontSize: "3rem",
                color: "#3498db",
                marginBottom: "1rem",
              }}
            >
              trending_up
            </div>
            <div className="text-center">
              <h5 className="fs-6 text-muted">Total de Ausencias</h5>
              <h3 className="fs-4" style={{ color: "#333" }}>{totalAusencias}</h3>
            </div>
          </div>
        </div>

        {/* SEGUNDA ESTADÍSTICA: Entradas al trabajo */}
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
            <div
              className="material-icons"
              style={{
                fontSize: "3rem",
                color: "#3498db",
                marginBottom: "1rem",
              }}
            >
              trending_up
            </div>
            <div className="text-center">
              <h5 className="fs-6 text-muted">Entradas al trabajo</h5>
              <h3 className="fs-4" style={{ color: "#333" }}>
                {totalEntradas}
              </h3>
            </div>
          </div>
        </div>

        {/* TERCERA ESTADÍSTICA: Total de Vacaciones */}
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
            <div
              className="material-icons"
              style={{
                fontSize: "3rem",
                color: "#3498db",
                marginBottom: "1rem",
              }}
            >
              trending_up
            </div>
            <div className="text-center">
              <h5 className="fs-6 text-muted">Total de Vacaciones</h5>
              <h3 className="fs-4" style={{ color: "#333" }}>15</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Estadisticas;
