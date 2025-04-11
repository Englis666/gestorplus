import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import StatisticCard from "./StaticCard";

const Estadisticas = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalActualizaciones, setTotalActualizaciones] = useState(0);
  const [notificacionesGenerales, setNotificacionesGenerales] = useState(0);
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

        axios.get("http://localhost/gestorplus/backend/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { action: "obtenerTotalEstadisticas" },
        })
          .then((response) => {
            console.log(response.data);
            const { totalJornadas, totalActualizaciones, notificacionesGenerales } = response.data;

            // Convierte los valores a números (asegúrate de que sean números válidos)
            const totalJornadasNumber = parseInt(totalJornadas, 10); // Usamos parseInt
            const totalActualizacionesNumber = parseInt(totalActualizaciones, 10); // Usamos parseInt
            const notificacionesGeneralesNumber = parseInt(notificacionesGenerales, 10); // Usamos parseInt

            if (
              !isNaN(totalJornadasNumber) &&
              !isNaN(totalActualizacionesNumber) &&
              !isNaN(notificacionesGeneralesNumber)
            ) {
              // Asignar valores al estado
              setTotalEntradas(totalJornadasNumber); // Se asigna a totalEntradas
              setTotalActualizaciones(totalActualizacionesNumber);
              setNotificacionesGenerales(notificacionesGeneralesNumber);
            } else {
              setError("No se encontraron estadísticas válidas.");
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener las estadísticas:", err);
            setError(err.message || "Error desconocido");
            setLoading(false);
          });
      } catch (error) {
        console.error("Error al procesar el token:", error);
        setError("Error al procesar el token.");
        setLoading(false);
      }
    } else {
      setError("No se encontró un token de autenticación.");
      setLoading(false);
    }
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="container-fluid d-flex justify-content-center mt-5">
      <div className="row g-5">
        <StatisticCard
          icon="trending_up"
          title="Actualizaciones de informacion"
          value={totalActualizaciones}
        />
        <StatisticCard
          icon="trending_up"
          title="Entradas al trabajo"
          value={totalEntradas}
        />
        <StatisticCard
          icon="trending_up"
          title="Notificaciones Generales"
          value={notificacionesGenerales}
        />
      </div>
    </section>
  );
};

export default Estadisticas;
