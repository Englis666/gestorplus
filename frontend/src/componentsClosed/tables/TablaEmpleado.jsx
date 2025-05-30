import { useState, useEffect } from "react";
import Estadisticas from "../Estadisticas";
import Grafica from "../Grafica";
import SeccionNotificaciones from "../Notifications/SeccionNotificaciones.jsx";
import { decodedTokenWithRol } from "../../utils/Auth.jsx";
import { obtenerNotificacionesDependiendoRol } from "../../services/NotififacionesService.jsx";

const TablaEmpleado = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const rolObtenido = decodedTokenWithRol();
        setRol(rolObtenido);
        const data = await obtenerNotificacionesDependiendoRol(rolObtenido);
        setNotificaciones(data);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setError("No se pudieron cargar las notificaciones.");
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
  }, []);

  if (loading)
    return <div className="text-center mt-5">Cargando notificaciones...</div>;
  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  const jornada = notificaciones.filter((n) => n.tipo === "Jornada");
  const actualizaciones = notificaciones.filter((n) =>
    rol === "3" ? n.tipo === "PostulacionAspirantes" : n.tipo === "Postulacion"
  );
  const generales = notificaciones.filter((n) => n.tipo === "General");

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-12">
          <Estadisticas />
        </div>
        <div className="col-md-6 col-12">
          <Grafica />
        </div>
      </div>

      <div className="row g-4">
        <SeccionNotificaciones
          titulo="Notificaciones generales"
          datos={generales}
        />
        <SeccionNotificaciones
          titulo="Actualizaciones"
          datos={actualizaciones}
        />
        <SeccionNotificaciones titulo="Control de jornadas" datos={jornada} />
      </div>
    </div>
  );
};

export default TablaEmpleado;
