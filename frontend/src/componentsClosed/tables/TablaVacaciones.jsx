import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API_URL from "../../config";

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

  const fetchVacaciones = (token, action) => {
    setLoading(true);
    setError(null);
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { action },
      })
      .then((response) => {
        const vacacionesData = Array.isArray(response.data)
          ? response.data
          : response.data.Vacaciones || [];
        setVacaciones(vacacionesData);
      })
      .catch(() => {
        setError("Hubo un problema al cargar las vacaciones.");
      })
      .finally(() => {
        setLoading(false);
      });
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

      const action =
        Rol === "1" || Rol === "2"
          ? "obtenerTodasLasVacaciones"
          : Rol === "3"
          ? "obtenerMisVacaciones"
          : null;

      if (!action) {
        setError("Rol no válido.");
        setLoading(false);
        return;
      }

      fetchVacaciones(token, action);
    } catch {
      setError("Token inválido o malformado.");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getCookie("auth_token");
    if (!token) {
      setError("Token no encontrado.");
      return;
    }

    axios
      .post(
        API_URL,
        {
          action: "solicitarVacaciones",
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Vacaciones solicitadas correctamente.");
        setForm({ fechaInicio: "", fechaFin: "" });
        const decodedToken = jwtDecode(token);
        const rolActual = decodedToken?.data?.rol;
        const action =
          rolActual === "1" || rolActual === "2"
            ? "obtenerTodasLasVacaciones"
            : rolActual === "3"
            ? "obtenerMisVacaciones"
            : null;
        if (action) fetchVacaciones(token, action);
      })
      .catch(() => {
        alert("Error al solicitar vacaciones.");
      });
  };

  const aceptarVacacion = (idvacacion) => {
    const token = getCookie("auth_token");
    if (!token) {
      setError("Token no proporcionado");
      return;
    }

    axios
      .post(
        API_URL,
        {
          action: "aceptarVacacion",
          idvacacion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Vacación aceptada.");
        setVacaciones((prev) =>
          prev.map((v) =>
            v.idvacacion === idvacacion
              ? { ...v, estadoVacacion: "Aceptada" }
              : v
          )
        );
      })
      .catch(() => {
        alert("Error al aceptar la vacación.");
      });
  };

  const rechazarVacacion = (idvacacion) => {
    const token = getCookie("auth_token");
    if (!token) {
      setError("Token no proporcionado");
      return;
    }

    axios
      .post(
        API_URL,
        {
          action: "rechazarVacacion",
          idvacacion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Vacación rechazada.");
        setVacaciones((prev) =>
          prev.map((v) =>
            v.idvacacion === idvacacion
              ? { ...v, estadoVacacion: "Rechazada" }
              : v
          )
        );
      })
      .catch(() => {
        alert("Error al rechazar la vacación.");
      });
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
                          onClick={() => aceptarVacacion(vacacion.idvacacion)}
                          disabled={vacacion.estadoVacacion === "aceptada"}
                        >
                          Aceptar
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rechazarVacacion(vacacion.idvacacion)}
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
