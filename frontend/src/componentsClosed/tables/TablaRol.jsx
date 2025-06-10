/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { obtenerRoles } from "../../services/RolService";

const TablaRol = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
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

  // Definir columnas para DataTable (solo visualización)
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
  ];

  return (
    <div className="container">
      <h1 className="mb-4">Roles del sistema</h1>
      <div className="row">
        <div className="col-md-10 mx-auto">
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
