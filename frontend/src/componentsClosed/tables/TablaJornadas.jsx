import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  obtenerJornadasDependiendoRol,
  corroborarJornada,
  noCorroborarJornada,
} from "../../services/JornadasService";
import { decodedTokenWithRol } from "../../utils/Auth";
import JornadaChart from "../Graphics/JornadaChart";
import FinalizarJornada from "../FinalizarJornada";
import JornadaEstadosChart from "../Graphics/JornadaEstadosChart";
import { notificarError, notificarExito } from "../../utils/notificaciones";

const TablaJornadas = () => {
  const [jornadas, setJornadas] = useState([]);
  const [filtrado, setFiltrado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [filtroNombreTabla, setFiltroNombreTabla] = useState("todos");
  const [filtroFechaTabla, setFiltroFechaTabla] = useState("");

  useEffect(() => {
    try {
      const rolObtenido = decodedTokenWithRol();
      setRol(rolObtenido);
      obtenerJornadasDependiendoRol(rolObtenido)
        .then((res) => {
          const jornadas = res?.Jornadas || [];
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
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [jornadas, filtroNombreTabla, filtroFechaTabla]);

  const aplicarFiltros = () => {
    let resultado = [...jornadas];
    if (filtroNombreTabla !== "todos") {
      resultado = resultado.filter((j) => j.nombres === filtroNombreTabla);
    }
    if (filtroFechaTabla !== "") {
      resultado = resultado.filter((j) => j.fecha === filtroFechaTabla);
    }
    setFiltrado(resultado);
  };

  const handleCorroborar = async (idJornada) => {
    try {
      await corroborarJornada(idJornada);
      notificarExito("Jornada corroborada con éxito.");
      setJornadas((prev) =>
        prev.map((j) =>
          j.idJornada === idJornada
            ? { ...j, estadoJornada: "Jornada Corroborada" }
            : j
        )
      );
    } catch {
      notificarError("Hubo un problema al corroborar la jornada.");
    }
  };

  const handleNoCorroborar = async (idJornada) => {
    try {
      await noCorroborarJornada(idJornada);
      notificarExito("Jornada rechazada con éxito.");
      setJornadas((prev) =>
        prev.map((j) =>
          j.idJornada === idJornada
            ? { ...j, estadoJornada: "Jornada rechazada" }
            : j
        )
      );
    } catch {
      notificarError("Hubo un problema al rechazar la jornada.");
    }
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
            disabled={row.estadoJornada === "Jornada Rechazada"}
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
    <div className="container-fluid px-3">
      <div className="container-fluid mt-4">
        <h2 className="text-center mb-4 text-dark fw-bold">
          Jornadas (Control de Entrada de Trabajo)
        </h2>
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            <h2>Gráfica de Jornadas</h2>
            <p className="text-muted">
              Esta gráfica muestra la distribución de las jornadas registradas
              por empleado. Puedes filtrar por fecha y nombre de empleado para
              ver detalles específicos.
            </p>
            <JornadaChart jornadas={filtrado} />
          </div>
          <div className="col-12 col-lg-6 mb-4">
            <h2>Gráfica de Estados de Jornadas</h2>
            <p className="text-muted">
              Esta gráfica muestra el estado de las jornadas registradas. Puedes
              filtrar por fecha y nombre de empleado para ver detalles
              específicos.
            </p>
            <JornadaEstadosChart jornadas={filtrado} />
          </div>
        </div>
      </div>

      <div className="row mb-3 justify-content-center">
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
        className="table-responsive"
        title="Lista de Jornadas"
        fixedHeader
        defaultSortField="fecha"
        defaultSortAsc={false}
        sortIcon={<span className="material-icons">sort</span>}
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
        }}
        paginationPerPage={4}
        columns={columnas}
        data={filtrado}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay jornadas disponibles."
      />
      <FinalizarJornada />
    </div>
  );
};

export default TablaJornadas;
