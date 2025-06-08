import React, { useEffect, useState } from "react";
import PostulacionIndividual from "./PostulacionIndividual";
import { obtenerPostulacionesAspirante } from "../services/Postulaciones";

const Postulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const data = await obtenerPostulacionesAspirante();
        setPostulaciones(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        setError("Error al cargar las postulaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5 text-primary fw-bold">
        Cargando postulaciones...
      </div>
    );
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center text-primary fw-bold">
        Mis Postulaciones
      </h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {postulaciones.length > 0 ? (
          postulaciones.map((postulacion) => (
            <PostulacionIndividual
              key={postulacion.idpostulacion}
              postulacion={postulacion}
            />
          ))
        ) : (
          <div className="text-center text-muted">
            No se encontraron postulaciones.
          </div>
        )}
      </div>
    </div>
  );
};

export default Postulaciones;
