import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { decodedTokenWithRol } from "../../utils/Auth";
import { calcularMinutosTrabajados } from "../../services/HoraExtraService";
import MinutosTrabajadosExtraChart from "../Graphics/MinutosTrabajadosExtraChart";

const TablaMinutosTrabajados = () => {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [empleadoFiltro, setEmpleadoFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const obtenerRol = decodedTokenWithRol();
        setRol(obtenerRol);
        const data = await calcularMinutosTrabajados(obtenerRol);
        setJornadas(
          Array.isArray(data.minutosTrabajados) ? data.minutosTrabajados : []
        );
        setLoading(false);
      } catch (err) {
        setError("Token inválido, malformado o error en la carga de datos.");
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const jornadasFiltradas = jornadas.filter((jornada) => {
    const fechaJornada = new Date(jornada.fecha);
    const fechaFiltro = filtroFecha ? new Date(filtroFecha) : null;

    const nombreEmpleado = (jornada.nombres || "").toLowerCase();
    const nombreFiltro = empleadoFiltro.toLowerCase();

    const fechaCoincide =
      !fechaFiltro ||
      fechaJornada.toDateString() === fechaFiltro.toDateString();

    const empleadoCoincide =
      !empleadoFiltro || nombreEmpleado.includes(nombreFiltro);

    return fechaCoincide && empleadoCoincide;
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
      <div className="mb-5">
        <MinutosTrabajadosExtraChart datos={jornadasFiltradas} />
      </div>
      {/* Filtros con separación */}
      <div className="mb-4 row">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            placeholder="Filtrar por empleado"
            value={empleadoFiltro}
            onChange={(e) => setEmpleadoFiltro(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="form-control"
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
