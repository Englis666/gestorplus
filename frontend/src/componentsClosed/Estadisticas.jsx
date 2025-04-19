import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import EstadisticaCard from "./card/EstadisticaCard";
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
    if (!token) {
      setError("No se encontró un token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        setError("El token ha expirado.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "obtenerTotalEstadisticas" },
      })
      .then((res) => {
        const { totalJornadas, totalActualizaciones, totalGenerales } = res.data;

        const totalJornadasNumber = Number(totalJornadas);
        const totalActualizacionesNumber = Number(totalActualizaciones);
        const totalGeneralesNumber = Number(totalGenerales);

        if (
          isNaN(totalJornadasNumber) ||
          isNaN(totalActualizacionesNumber) ||
          isNaN(totalGeneralesNumber)
        ) {
          setError("Datos no válidos en la respuesta.");
        } else {
          setTotalEntradas(totalJornadasNumber);
          setTotalActualizaciones(totalActualizacionesNumber);
          setNotificacionesGenerales(totalGeneralesNumber);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error al obtener las estadísticas.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error)   return <div>{error}</div>;

  return (
    <section className="container-fluid d-flex justify-content-center mt-5">
      <div className="row g-5">
        <EstadisticaCard
          icon="trending_up"
          title="Actualizaciones de información"
          value={totalActualizaciones}
        />
        <EstadisticaCard
          icon="trending_up"
          title="Entradas al trabajo"
          value={totalEntradas}
        />
        <EstadisticaCard
          icon="trending_up"
          title="Notificaciones Generales"
          value={notificacionesGenerales}
        />
      </div>
    </section>
  );
};

export default Estadisticas;
