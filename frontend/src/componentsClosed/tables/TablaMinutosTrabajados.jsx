import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaMinutosTrabajados = () => {
  const [jornadas, setJornadas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [empleadoFiltro, setEmpleadoFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("auth_token");

  useEffect(() => {
    if (!token) {
      setError("Token no encontrado.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

      if (isTokenExpired) {
        setError("El token ha expirado.");
        setLoading(false);
        return;
      }

      const Rol = decodedToken?.data?.rol;
      setRol(Rol);

      const action = {
        "1": "obtenerMinutosTrabajadosDelEmpleado",
        "2": "obtenerMinutosTrabajadosDelEmpleado",
        "3": "obtenerMinutosTrabajados",
      }[Rol];

      axios
        .get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action },
        })
        .then((res) => {
          console.log(res.data);
          const data = res.data?.minutosTrabajados;
          const jornadas = Array.isArray(data) ? data : data ? [data] : [];

          setJornadas(jornadas);
          setEmpleados([...new Set(jornadas.map((j) => j.nombres))]);
          setLoading(false);
        })
        .catch(() => {
          setError("Hubo un problema al cargar las Jornadas.");
          setLoading(false);
        });
    } catch {
      setError("Token inválido o malformado.");
      setLoading(false);
    }
  }, []);

  const jornadasFiltradas = jornadas.filter((j) => {
    const coincideEmpleado = empleadoFiltro
      ? j.nombres.toLowerCase().includes(empleadoFiltro.toLowerCase())
      : true;
    const coincideFecha = filtroFecha ? j.fecha === filtroFecha : true;
    return coincideEmpleado && coincideFecha;
  });

  if (loading)
    return <div className="text-center mt-5">Cargando jornadas...</div>;
  if (error)
    return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center text-dark fw-bold mb-4">
        Minutos Extra trabajados por empleados
      </h2>
      <p>
        El propósito de esta consulta es obtener detalles sobre las jornadas
        laborales de los empleados, incluyendo la fecha, hora de entrada, hora
        de salida, tiempo total trabajado (minutos_trabajados) y, si
        corresponde, los minutos extra trabajados (minutos_extra), todo
        relacionado con el empleado (nombre, apellidos, número de documento).
      </p>

      <div
        className="card shadow-sm border-0"
        style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
      >
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="text-center bg-light">
                <tr>
                  <th>
                    Fecha
                    <input
                      type="date"
                      className="form-control mt-1"
                      value={filtroFecha}
                      onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                  </th>
                  <th>Hora entrada</th>
                  <th>Hora salida</th>
                  <th>
                    Empleado
                    <input
                      type="text"
                      className="form-control mt-1"
                      placeholder="Buscar"
                      value={empleadoFiltro}
                      onChange={(e) => setEmpleadoFiltro(e.target.value)}
                    />
                  </th>
                  <th>Min. Trabajados</th>
                  <th>Min. Extra</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {jornadasFiltradas.length > 0 ? (
                  jornadasFiltradas.map((j) => (
                    <tr key={j.idJornada}>
                      <td>{j.fecha}</td>
                      <td>{j.horaEntrada}</td>
                      <td>{j.horaSalida}</td>
                      <td>{j.nombres}</td>
                      <td>{j.minutos_trabajados ?? "-"}</td>
                      <td>{j.minutos_extra ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      No hay trabajadores con minutos trabajados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaMinutosTrabajados;
