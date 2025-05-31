import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import FormularioAusencia from "../form/FormularioSolicitudAusencia";
import { decodedTokenWithRol } from "../../utils/Auth";
import {
  obtenerAusencias,
  aceptarAusencia,
  rechazarAusencia,
} from "../../services/AusenciasService";
import AusenciasChart from "../Graphics/AusenciasChart";

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

  const fetchAusencias = async (rolUsuario) => {
    try {
      const data = await obtenerAusencias(rolUsuario);
      const ausencias = data?.Ausencias;
      if (Array.isArray(ausencias)) setAusencias(ausencias);
      else if (ausencias && typeof ausencias === "object")
        setAusencias([ausencias]);
      else setAusencias([]);
    } catch (error) {
      setError("Hubo un problema al cargar las Ausencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rolUsuario = decodedTokenWithRol();
    setRol(rolUsuario);
    fetchAusencias(rolUsuario);
  }, []);

  const handleAceptar = async (idausencia) => {
    try {
      await aceptarAusencia(idausencia);
      alert("Ausencia aceptada con éxito.");
      setAusencias((prev) =>
        prev.map((a) =>
          a.idausencia === idausencia ? { ...a, justificada: true } : a
        )
      );
    } catch {
      alert("Hubo un problema al aceptar la ausencia.");
    }
  };

  const handleRechazar = async (idausencia) => {
    try {
      await rechazarAusencia(idausencia);
      alert("Ausencia rechazada con éxito.");
      setAusencias((prev) =>
        prev.map((a) =>
          a.idausencia === idausencia ? { ...a, justificada: false } : a
        )
      );
    } catch {
      alert("Hubo un problema al rechazar la ausencia.");
    }
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
      <h2 className="text-center mb-4">Gestión de Ausencias</h2>

      <p>Grafica de Ausencias</p>

      <AusenciasChart ausencias={ausencias} />

      <div className="row justify-content-center mt-4">
        <div className="col-12 col-lg-6 mb-4">
          <h3 className="text-center mb-3">Lista de Ausencias</h3>
        </div>
        <div className="col-12 col-lg-6 mb-4">
          <h3 className="text-center mb-3">Formulario de Solicitud</h3>
        </div>
        <div className="col-12 col-lg-6">
          <FormularioAusencia
            solicitud={solicitud}
            setSolicitud={setSolicitud}
          />
        </div>
        <div className="col-12 col-lg-6">
          <div className="mb-3">
            <label htmlFor="filtroEstado" className="form-label">
              Filtrar por Estado
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
            </select>
          </div>
          <DataTable
            columns={columns}
            data={ausenciasFiltradas}
            pagination
            paginationPerPage={5}
            highlightOnHover
            striped
            noDataComponent="No hay ausencias para mostrar."
            defaultSortField="fechaInicio"
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default TablaAusencias;
