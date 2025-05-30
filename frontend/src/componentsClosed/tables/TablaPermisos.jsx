import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import SolicitudPermiso from "../form/FormularioSolicitudPermisos";
import { decodedTokenWithRol } from "../../utils/Auth";
import {
  obtenerPermisosDependiendoRol,
  permisoAceptado,
  permisoRechazado,
} from "../../services/PermisosService";

const TablaPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        setLoading(true);
        const rolObtenido = decodedTokenWithRol();
        setRol(rolObtenido);
        const data = await obtenerPermisosDependiendoRol(rolObtenido);
        setPermisos(data);
      } catch (err) {
        setError(err.message || "Error al obtener permisos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [refreshTrigger]);

  const recargarPermisos = () => setRefreshTrigger((prev) => prev + 1);

  const handleAceptar = async (idPermisos) => {
    try {
      await permisoAceptado(idPermisos);
      alert("Permiso aceptado con éxito.");
      setPermisos((prev) =>
        prev.map((permiso) =>
          permiso.idPermisos === idPermisos
            ? { ...permiso, estadoPermiso: "Aceptada" }
            : permiso
        )
      );
    } catch (error) {
      console.error("Error al aceptar el permiso:", error);
      alert("Hubo un problema al aceptar el permiso.");
    }
  };

  const handleRechazar = async (idPermisos) => {
    try {
      await permisoRechazado(idPermisos);
      alert("Permiso rechazado con éxito.");
      setPermisos((prev) =>
        prev.map((permiso) =>
          permiso.idPermisos === idPermisos
            ? { ...permiso, estadoPermiso: "Rechazada" }
            : permiso
        )
      );
    } catch (error) {
      console.error("Error al rechazar el permiso:", error);
      alert("Hubo un problema al rechazar el permiso.");
    }
  };

  const columns = [
    {
      name: "Nombre Empleado",
      selector: (row) => `${row.nombres} ${row.apellidos}`,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha de inicio",
      selector: (row) => row.fechaInicio,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.fechaFin,
      sortable: true,
      center: true,
    },
    {
      name: "Tipo de permiso",
      selector: (row) => row.tipo,
      sortable: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estadoPermiso,
      sortable: true,
      center: true,
    },
  ];

  if (rol === "1" || rol === "2") {
    columns.push({
      name: "Acciones",
      cell: (row) => (
        <div>
          <button
            className="btn btn-success btn-sm mt-2"
            onClick={() => handleAceptar(row.idPermisos)}
          >
            Aceptar
          </button>
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => handleRechazar(row.idPermisos)}
          >
            Rechazar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    });
  }

  if (loading) return <div>Cargando permisos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">Permisos</h2>
      <div className="row">
        <div className="col-md-8 mb-4">
          <div
            className="card shadow-sm border-0"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body">
              <p className="mb-3">Control de Permisos</p>
              <DataTable
                columns={columns}
                data={permisos}
                pagination
                highlightOnHover
                responsive
                noDataComponent="No hay permisos registrados."
                customStyles={{
                  headCells: {
                    style: {
                      fontWeight: "bold",
                      backgroundColor: "#e9ecef",
                      textAlign: "center",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <SolicitudPermiso onSuccess={recargarPermisos} />{" "}
        </div>
      </div>
    </div>
  );
};

export default TablaPermisos;
