/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ModalPostulantes from "../modals/ModalPostulacionesAgrupadas";
import { calcularPostulacionesEnConvocatorias } from "../../services/Postulaciones";

const TablaConvocatoriasAgrupadas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  useEffect(() => {
    const fetchCalculo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await calcularPostulacionesEnConvocatorias();
        setConvocatorias(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error al cargar las convocatorias agrupadas.");
      } finally {
        setLoading(false);
      }
    };
    fetchCalculo();
  }, []);

  const handleOpenModal = (convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedConvocatoria(null);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombreConvocatoria,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: false,
      wrap: true,
      center: false,
    },
    {
      name: "# Aspirantes",
      selector: (row) => row.cantidad_postulaciones,
      sortable: true,
      center: true,
    },
    {
      name: "Salario",
      selector: (row) => row.salario,
      sortable: true,
      center: true,
      format: (row) => `$${row.salario}`,
    },
    {
      name: "Cargo",
      selector: (row) => row.nombreCargo,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: "Acción",
      cell: (row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleOpenModal(row)}
        >
          Ver Postulantes
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">
        Convocatorias Agrupadas Por Postulaciones
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-center">Cargando datos...</p>
      ) : (
        <div
          className="card shadow-sm border-0 mb-5"
          style={{ borderRadius: "10px" }}
        >
          <div className="card-body">
            <b>Lista de Convocatorias</b>
            <DataTable
              columns={columns}
              data={convocatorias}
              pagination
              highlightOnHover
              striped
              noDataComponent="No hay convocatorias disponibles"
              responsive
              persistTableHead
              fixedHeader
              fixedHeaderScrollHeight="450px"
            />
          </div>
        </div>
      )}

      {showModal && selectedConvocatoria && (
        <ModalPostulantes
          convocatoria={selectedConvocatoria}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TablaConvocatoriasAgrupadas;
