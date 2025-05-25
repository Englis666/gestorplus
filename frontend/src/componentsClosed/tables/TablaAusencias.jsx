import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DataTable from "react-data-table-component";
import FormularioAusencia from "../form/FormularioSolicitudAusencia";

const TablaAusencias = () => {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [solicitud, setSolicitud] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoAusencia: "",
    descripcion: "",
  });
  const [filtroEstado, setFiltroEstado] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const fetchAusencias = (token, rol) => {
    const action =
      rol === "1" || rol === "2"
        ? "obtenerTodasLasAusencias"
        : "obtenerAusencias";

    axios
      .get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action },
      })
      .then((response) => {
        const ausencias = response.data?.Ausencias;
        if (Array.isArray(ausencias)) setAusencias(ausencias);
        else if (ausencias && typeof ausencias === "object")
          setAusencias([ausencias]);
        else setAusencias([]);
        setLoading(false);
      })
      .catch(() => {
        setError("Hubo un problema al cargar las Ausencias.");
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
      if (decodedToken.exp * 1000 < Date.now()) {
        setError("El token ha expirado.");
        setLoading(false);
        return;
      }

      const rolUsuario = decodedToken?.data?.rol;
      setRol(rolUsuario);

      fetchAusencias(token, rolUsuario);
    } catch {
      setError("Token inválido o malformado.");
      setLoading(false);
    }
  }, []);

  const handleAceptar = (idausencia) => {
    const token = getCookie("auth_token");
    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          action: "ausenciaAceptada",
          idausencia,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Ausencia aceptada con éxito.");
        setAusencias((prevAusencias) =>
          prevAusencias.map((ausencia) =>
            ausencia.idausencia === idausencia
              ? { ...ausencia, justificada: true }
              : ausencia
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al aceptar la ausencia.");
      });
  };

  const handleRechazar = (idausencia) => {
    const token = getCookie("auth_token");
    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          action: "ausenciaRechazada",
          idausencia,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Ausencia rechazada con éxito.");
        setAusencias((prevAusencias) =>
          prevAusencias.map((ausencia) =>
            ausencia.idausencia === idausencia
              ? { ...ausencia, justificada: false }
              : ausencia
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al rechazar la ausencia.");
      });
  };

  const handleSolicitarAusencia = (e) => {
    e.preventDefault();

    const token = getCookie("auth_token");
    if (!token) {
      alert("Token no encontrado. Inicia sesión nuevamente.");
      return;
    }

    if (new Date(solicitud.fechaInicio) > new Date(solicitud.fechaFin)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          action: "solicitarAusencia",
          ...solicitud,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Solicitud de ausencia enviada con éxito.");
        setSolicitud({
          fechaInicio: "",
          fechaFin: "",
          tipoAusencia: "",
          descripcion: "",
        });
        fetchAusencias(token, rol);
      })
      .catch(() => {
        alert("Hubo un problema al enviar la solicitud de ausencia.");
      });
  };

  const handleFiltroEstadoChange = (e) => {
    setFiltroEstado(e.target.value);
  };

  const ausenciasFiltradas = filtroEstado
    ? ausencias.filter((a) => {
        const estado = a.justificada;
        if (filtroEstado === "justificada")
          return estado === true || estado === "Justificada";
        if (filtroEstado === "rechazada")
          return estado === false || estado === "Rechazada";
        if (filtroEstado === "en proceso")
          return estado === null || estado === undefined || estado === "";
        return true;
      })
    : ausencias;

  const columns = [
    {
      name: "Fecha de inicio",
      selector: (row) => row.fechaInicio,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha de fin",
      selector: (row) => row.fechaFin,
      sortable: true,
      center: true,
    },
    {
      name: "Tipo de Ausencia",
      selector: (row) => row.tipoAusencia,
      sortable: true,
      center: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: false,
      wrap: true,
      center: false,
    },
    {
      name: "Estado",
      selector: (row) => {
        if (row.justificada === true || row.justificada === "Justificada")
          return "Justificada";
        if (row.justificada === false || row.justificada === "Rechazada")
          return "Rechazada";
        return "En Proceso";
      },
      sortable: true,
      center: true,
    },
  ];

  if (rol === "1" || rol === "2") {
    columns.push({
      name: "Acciones",
      center: true,
      cell: (row) => (
        <div className="gap-3">
          <button
            className="btn btn-success btn-sm mt-2"
            onClick={() => handleAceptar(row.idausencia)}
          >
            Aceptar
          </button>
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => handleRechazar(row.idausencia)}
          >
            Rechazar
          </button>
        </div>
      ),
    });
  }

  if (loading) return <div>Cargando Ausencias...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
        Ausencias
      </h2>

      <div className="mb-3">
        <label htmlFor="filtroEstado" className="form-label ">
          Filtrar por estado:
        </label>
        <select
          id="filtroEstado"
          className="form-select"
          value={filtroEstado}
          onChange={handleFiltroEstadoChange}
        >
          <option value="">Todos</option>
          <option value="justificada">Justificada</option>
          <option value="rechazada">Rechazada</option>
          <option value="en proceso">En Proceso</option>
        </select>
      </div>

      <div className="row">
        <div className="col-12 col-lg-7 mb-4">
          <DataTable
            columns={columns}
            data={ausenciasFiltradas}
            pagination
            highlightOnHover
            striped
            noDataComponent="No hay ausencias para mostrar."
            defaultSortField="fechaInicio"
            responsive
          />
        </div>

        <div className="col-12 col-lg-5">
          <FormularioAusencia
            solicitud={solicitud}
            setSolicitud={setSolicitud}
            handleSubmit={handleSolicitarAusencia}
          />
        </div>
      </div>
    </div>
  );
};

export default TablaAusencias;
