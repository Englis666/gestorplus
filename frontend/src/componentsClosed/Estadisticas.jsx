import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";  

const Estadisticas = () => {
  const [totalEntradas, setTotalEntradas] = useState(0); 
  const [totalAusencias, setTotalAusencias] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };
    
    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();  
        if (isTokenExpired) {
          console.error("El token ha expirado.");
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        axios.get('http://localhost/gestorplus/backend/', { 
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { action: 'obtenerTotalEstadisticas' }, 
        })
        .then(response => {
          console.log(response.data);
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
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setError('Error al procesar el token.');
        setLoading(false);
      }
    } else {
      setError("No se encontró un token de autenticación.");
      setLoading(false);
    }
  }, []);  

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
              <h3 className="fs-4" style={{ color: "#333" }}>0</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Estadisticas;
