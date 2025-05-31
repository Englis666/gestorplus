/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import FormularioCargo from "../form/FormularioAgregarCargo";
import API_URL from "../../config";

const TablaCargos = () => {
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { action: "obtenerCargos" },
      });
      const lista = response.data?.cargos;
      setCargos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("[fetchCargos] Error al obtener los cargos:", err);
      setCargos([]);
    }
    setLoading(false);
  };

  const desactivarCargo = async (idCargo) => {
    try {
      await axios.patch(API_URL, {
        params: { action: "desactivarCargo" },
        data: { idCargo },
      });
      await fetchCargos();
    } catch (err) {
      const mensaje =
        err?.response?.data?.error ??
        "No se pudo desactivar el cargo. Inténtalo de nuevo.";
      alert(mensaje);
    }
  };

  const activarCargo = async (idCargo) => {
    try {
      await axios.patch(API_URL + "?action=activarCargo", { idCargo });
      await fetchCargos();
    } catch (err) {
      console.error("[activarCargo] error al activar el cargo:", err);
    }
  };

  const agregarCargo = (nuevoCargo) => {
    setCargos((prev) => [...prev, nuevoCargo]);
  };

  // Definir columnas para DataTable
  const columns = [
    {
      name: "Nombre del cargo",
      selector: (row) => row.nombreCargo,
      sortable: true,
      wrap: true,
    },
    {
      name: "Estado del cargo",
      selector: (row) => row.estadoCargo,
      sortable: true,
      center: true,
    },
    {
      name: "Desactivar",
      cell: (row) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => desactivarCargo(row.idCargo ?? row.idcargo ?? row.id)}
          disabled={row.estadoCargo !== "Activo"}
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
          onClick={() => activarCargo(row.idCargo ?? row.idcargo ?? row.id)}
          disabled={row.estadoCargo === "Activo"}
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
      <h1 className="mb-4">Cargos del sistema</h1>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <p>Cargos que están cargados en el sistema</p>
              <DataTable
                columns={columns}
                data={cargos}
                progressPending={loading}
                pagination
                highlightOnHover
                noDataComponent="No existen cargos en la base de datos"
                dense
                responsive
              />
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0 mb-5">
            <div className="card-body">
              <FormularioCargo onCargoAgregado={agregarCargo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaCargos;
