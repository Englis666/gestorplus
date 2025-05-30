import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { decodedTokenWithRol } from "../../utils/Auth";
import { calcularMinutosTrabajados } from "../../services/HoraExtraService";

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
        // Aseguramos que data sea un array
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
