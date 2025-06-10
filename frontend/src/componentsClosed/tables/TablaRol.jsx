/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  obtenerRoles,
  desactivarRol as desactivarRolService,
  activarRol as activarRolService,
} from "../../services/RolService";
import { notificarError, notificarExito } from "../../utils/notificaciones";

const TablaRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const lista = await obtenerRoles();
      setRoles(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("[fetchRoles] Error al obtener los roles:", err);
      setRoles([]);
    }
    setLoading(false);
  };

  const desactivarRol = async (idRol) => {
    try {
      const res = await desactivarRolService(idRol);
      if (res.status === "success") {
        notificarExito("Rol desactivado correctamente.");
      } else {
        notificarError(res.message || "No se pudo desactivar el rol.");
      }
      await fetchRoles();
    } catch (err) {
      const mensaje =
        err?.response?.data?.error ??
        "No se pudo desactivar el rol. Inténtalo de nuevo.";
      notificarError(mensaje);
    }
  };

  const activarRol = async (idRol) => {
    try {
      const res = await activarRolService(idRol);
      if (res.status === "success") {
        notificarExito("Rol activado correctamente.");
      } else {
        notificarError(res.message || "No se pudo activar el rol.");
      }
      await fetchRoles();
    } catch (err) {
      notificarError(
        err?.response?.data?.error ??
          "No se pudo activar el rol. Inténtalo de nuevo."
      );
      console.error("[activarRol] error al activar el rol:", err);
    }
  };

  // Definir columnas para DataTable
  const columns = [
    {
      name: "Nombre del rol",
      selector: (row) => row.nombreRol ?? row.nombre ?? row.nombre_rol,
      sortable: true,
      wrap: true,
    },
    {
      name: "Estado del rol",
      selector: (row) => row.estadoRol ?? row.estado ?? row.estado_rol,
      sortable: true,
      center: true,
    },
    {
      name: "Desactivar",
      cell: (row) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => desactivarRol(row.idRol ?? row.idrol ?? row.id)}
          disabled={
            (row.estadoRol ?? row.estado ?? row.estado_rol) !== "Activo"
          }
        >
          Desactivar
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
    {
      name: "Activar",
      cell: (row) => (
        <button
          className="btn btn-success btn-sm"
          onClick={() => activarRol(row.idRol ?? row.idrol ?? row.id)}
          disabled={
            (row.estadoRol ?? row.estado ?? row.estado_rol) === "Activo"
          }
        >
          Activar
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Roles del sistema</h1>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <p>Roles que están cargados en el sistema</p>
              <DataTable
                columns={columns}
                data={roles}
                progressPending={loading}
                pagination
                highlightOnHover
                noDataComponent="No existen roles en la base de datos"
                dense
                responsive
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaRol;
