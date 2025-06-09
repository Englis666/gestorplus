import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  obtenerVacacionesDependiendoRol,
  aceptarVacacion,
  rechazarVacacion,
  solicitarVacacion,
} from "../../services/VacacionesService";
import { notificarError, notificarExito } from "../../utils/notificaciones";

const localizer = momentLocalizer(moment);

const TablaVacaciones = () => {
  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [form, setForm] = useState({ fechaInicio: "", fechaFin: "" });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const fetchVacaciones = async (rolActual) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerVacacionesDependiendoRol(rolActual);
      // El service puede devolver {Vacaciones: [...]}, {vacaciones: [...]}, o el array directo
      let vacacionesData = [];
      if (Array.isArray(data)) {
        vacacionesData = data;
      } else if (Array.isArray(data.Vacaciones)) {
        vacacionesData = data.Vacaciones;
      } else if (Array.isArray(data.vacaciones)) {
        vacacionesData = data.vacaciones;
      }
      setVacaciones(vacacionesData);
    } catch (err) {
      setError("Hubo un problema al cargar las vacaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) {
      setError("Token no encontrado.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.exp * 1000 < Date.now()) {
        setError("El token ha expirado");
        setLoading(false);
        return;
      }

      const Rol = decodedToken?.data?.rol;
      setRol(Rol);

      fetchVacaciones(Rol);
    } catch {
      setError("Token inválido o malformado.");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await solicitarVacacion({
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      });
      notificarExito("Vacaciones solicitadas correctamente.");
      setForm({ fechaInicio: "", fechaFin: "" });
      fetchVacaciones(rol);
    } catch {
      notificarError("Error al solicitar vacaciones.");
    }
  };

  const handleAceptarVacacion = async (idvacacion) => {
    try {
      await aceptarVacacion(idvacacion);
      notificarExito("Vacación aceptada.");
      setVacaciones((prev) =>
        prev.map((v) =>
          v.idvacacion === idvacacion ? { ...v, estadoVacacion: "Aceptada" } : v
        )
      );
    } catch {
      notificarError("Error al aceptar la vacación.");
    }
  };

  const handleRechazarVacacion = async (idvacacion) => {
    try {
      await rechazarVacacion(idvacacion);
      notificarExito("Vacación rechazada.");
      setVacaciones((prev) =>
        prev.map((v) =>
          v.idvacacion === idvacacion
            ? { ...v, estadoVacacion: "Rechazada" }
            : v
        )
      );
    } catch {
      notificarError("Error al rechazar la vacación.");
    }
  };

  if (loading) return <div>Cargando Vacaciones...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Vacaciones</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h4>Solicitar Vacaciones</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Fecha Inicio:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha Finalización:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaFin"
                    value={form.fechaFin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Solicitar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <Calendar
            localizer={localizer}
            events={vacaciones.map((v) => ({
              title: `Vacaciones de ${v.nombres}`,
              start: moment(v.fechaInicio).startOf("day").toDate(),
              end: moment(v.fechaFin).add(1, "day").startOf("day").toDate(),
              allDay: true,
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>

      <div className="table-responsive mt-4">
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th>Fecha Inicio</th>
              <th>Fecha Finalización</th>
              <th>Aprobado por</th>
              <th>Estado</th>
              {rol !== "3" && <th>Nombre completo del usuario</th>}
              {rol !== "3" && <th colSpan="2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {vacaciones.length > 0 ? (
              vacaciones.map((vacacion, index) => (
                <tr key={index}>
                  <td>{vacacion.fechaInicio || "N/A"}</td>
                  <td>{vacacion.fechaFin || "N/A"}</td>
                  <td>{vacacion.aprobadoPor || "Pendiente"}</td>
                  <td>{vacacion.estadoVacacion || "Desconocido"}</td>
                  {rol !== "3" && (
                    <>
                      <td>{`${vacacion.nombres} ${vacacion.apellidos}`}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleAceptarVacacion(vacacion.idvacacion)
                          }
                          disabled={vacacion.estadoVacacion === "aceptada"}
                        >
                          Aceptar
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleRechazarVacacion(vacacion.idvacacion)
                          }
                          disabled={vacacion.estadoVacacion === "rechazada"}
                        >
                          Rechazar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={rol === "3" ? 4 : 7}>
                  No hay vacaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaVacaciones;
