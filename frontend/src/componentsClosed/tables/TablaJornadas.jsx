import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DataTable from "react-data-table-component";
import API_URL from "../../config";

const TablaJornadas = () => {
  const [Jornadas, setJornadas] = useState([]);
  const [filtrado, setFiltrado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [filtroNombreTabla, setFiltroNombreTabla] = useState("todos");
  const [filtroFechaTabla, setFiltroFechaTabla] = useState("");

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
        const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
        if (isTokenExpired) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = {
          1: "obtenerTodasLasJornadas",
          2: "obtenerTodasLasJornadas",
          3: "obtenerJornadas",
        }[Rol];

        axios
          .get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params: { action },
          })
          .then((res) => {
            const jornadas = res.data?.Jornadas || [];
            setJornadas(jornadas);
            setFiltrado(jornadas);
            const nombres = [...new Set(jornadas.map((j) => j.nombres))];
            setEmpleados(nombres);
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
    } else {
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [Jornadas, filtroNombreTabla, filtroFechaTabla]);

  const aplicarFiltros = () => {
    let resultado = [...Jornadas];
    if (filtroNombreTabla !== "todos") {
      resultado = resultado.filter((j) => j.nombres === filtroNombreTabla);
    }
    if (filtroFechaTabla !== "") {
      resultado = resultado.filter((j) => j.fecha === filtroFechaTabla);
    }
    setFiltrado(resultado);
  };

  const handleCorroborar = (idJornada) => {
    axios
      .post(API_URL, {
        action: "corroborarJornada",
        idJornada,
      })
      .then(() => {
        alert("Jornada corroborada con éxito.");
        setJornadas((prev) =>
          prev.map((j) =>
            j.idJornada === idJornada
              ? { ...j, estadoJornada: "Jornada corroborada" }
              : j
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al corroborar la jornada.");
      });
  };

  const handleNoCorroborar = (idJornada) => {
    axios
      .post(API_URL, {
        action: "noCorroborarJornada",
        idJornada,
      })
      .then(() => {
        alert("Jornada rechazada con éxito.");
        setJornadas((prev) =>
          prev.map((j) =>
            j.idJornada === idJornada
              ? { ...j, estadoJornada: "Jornada rechazada" }
              : j
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al rechazar la jornada.");
      });
  };

  const columnas = [
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Hora Entrada",
      selector: (row) => row.horaEntrada,
    },
    {
      name: "Hora Salida",
      selector: (row) => row.horaSalida,
    },
    {
      name: "Empleado",
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estadoJornada,
    },
  ];

  if (rol === "1" || rol === "2") {
    columnas.push({
      name: "Acciones",
      cell: (row) => (
        <div className="d-flex flex-column">
          <button
            className="btn btn-success btn-sm mb-1"
            onClick={() => handleCorroborar(row.idJornada)}
          >
            Corroborar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleNoCorroborar(row.idJornada)}
            disabled={row.estadoJornada === "Jornada rechazada"}
          >
            No Corroborar
          </button>
        </div>
      ),
    });
  }

  if (loading) return <div>Cargando jornadas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-dark fw-bold">
        Jornadas (Control de Entrada de Trabajo)
      </h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="date"
            className="form-control"
            value={filtroFechaTabla}
            onChange={(e) => setFiltroFechaTabla(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filtroNombreTabla}
            onChange={(e) => setFiltroNombreTabla(e.target.value)}
          >
            <option value="todos">Todos</option>
            {empleados.map((nombre, idx) => (
              <option key={idx} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columnas}
        data={filtrado}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay jornadas disponibles."
      />
    </div>
  );
};

export default TablaJornadas;
