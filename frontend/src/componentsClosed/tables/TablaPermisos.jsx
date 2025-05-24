import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import DataTable from "react-data-table-component";
import SolicitudPermiso from "../form/FormularioSolicitudPermisos";

const TablaPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

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
        if (decodedToken?.exp * 1000 < Date.now()) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = Rol === "1" || Rol === "2" ? "obtenerTodosLosPermisos" : Rol === "3" ? "obtenerPermisos" : null;
        if (!action) {
          setError("Rol no reconocido.");
          setLoading(false);
          return;
        }

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: { Authorization: `Bearer ${token}` },
            params: { action },
          })
          .then((res) => {
            const data = res.data?.permisos;
            setPermisos(Array.isArray(data) ? data : []);
            setLoading(false);
          })
          .catch(() => {
            setError("Hubo un problema al cargar los permisos.");
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

  const handleAceptar = (idPermisos) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "permisoAceptado",
        idPermisos,
      })
      .then(() => {
        alert("Permiso aceptado con éxito.");
        setPermisos((prev) =>
          prev.map((permiso) =>
            permiso.idPermisos === idPermisos ? { ...permiso, aprobado: true } : permiso
          )
        );
      })
      .catch(() => alert("Hubo un problema al aceptar el permiso."));
  };

  const handleRechazar = (idPermisos) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "permisoRechazado",
        idPermisos,
      })
      .then((response) => {
        if (response.data.success) {
          alert("Permiso rechazado con éxito.");
          setPermisos((prev) =>
            prev.map((permiso) =>
              permiso.idPermisos === idPermisos ? { ...permiso, aprobado: false } : permiso
            )
          );
        } else {
          alert("Hubo un problema al rechazar el permiso.");
        }
      })
      .catch(() => alert("Hubo un problema al rechazar el permiso."));
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
          <div className="card shadow-sm border-0" style={{ borderRadius: "10px" }}>
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
                      fontWeight: 'bold',
                      backgroundColor: '#e9ecef',
                      textAlign: 'center',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <SolicitudPermiso />
        </div>
      </div>
    </div>
  );
};

export default TablaPermisos;
