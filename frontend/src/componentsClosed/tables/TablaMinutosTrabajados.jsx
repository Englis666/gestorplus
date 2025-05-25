import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

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
        1: "obtenerMinutosTrabajadosDelEmpleado",
        2: "obtenerMinutosTrabajadosDelEmpleado",
        3: "obtenerMinutosTrabajados",
      }[Rol];

      axios
        .get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action },
        })
        .then((res) => {
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

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Hora Entrada",
      selector: (row) => row.horaEntrada,
      center: true,
    },
    {
      name: "Hora Salida",
      selector: (row) => row.horaSalida,
      center: true,
    },
    {
      name: "Empleado",
      selector: (row) => row.nombres,
      center: true,
    },
    {
      name: "Min. Trabajados",
      selector: (row) => row.minutos_trabajados ?? "-",
      center: true,
    },
    {
      name: "Min. Extra",
      selector: (row) => row.minutos_extra ?? "-",
      center: true,
    },
  ];

  if (loading)
    return <div className="text-center mt-5">Cargando jornadas...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

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

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Filtrar por fecha</label>
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>Buscar empleado</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del empleado"
            value={empleadoFiltro}
            onChange={(e) => setEmpleadoFiltro(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={jornadasFiltradas}
        noDataComponent="No hay trabajadores con minutos trabajados."
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
};

export default TablaMinutosTrabajados;
