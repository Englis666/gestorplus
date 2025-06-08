/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import FormularioAgregarConvocatoria from "../form/agregarConvocatoria";
import { obtenerCargos } from "../../services/Cargos";
import {
  obtenerConvocatorias,
  agregarConvocatoria,
} from "../../services/ConvocatoriasService";

const TablaVacantes = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agregar, setAgregar] = useState({
    nombreConvocatoria: "",
    descripcion: "",
    requisitos: "",
    salario: "",
    cantidadConvocatoria: "",
    idcargo: "",
  });

  useEffect(() => {
    obtenerCargos()
      .then((cargosData) => {
        setCargos(Array.isArray(cargosData) ? cargosData : []);
      })
      .catch((err) => {
        console.error("Error al obtener los cargos:", err);
        setError("Hubo un problema al cargar los cargos para la convocatoria");
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    obtenerConvocatorias()
      .then((convocatoriasData) => {
        setConvocatorias(
          Array.isArray(convocatoriasData) ? convocatoriasData : []
        );
      })
      .catch((err) => {
        console.error("Error al obtener convocatorias:", err);
        setError("Hubo un problema al cargar las Convocatorias");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      await agregarConvocatoria(agregar);
      alert("Convocatoria agregada exitosamente");
      const nuevasConvocatorias = await obtenerConvocatorias();
      setConvocatorias(
        Array.isArray(nuevasConvocatorias) ? nuevasConvocatorias : []
      );
    } catch (err) {
      console.error("Error al agregar convocatoria:", err);
      setError("Hubo un problema al agregar la convocatoria");
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombreConvocatoria,
      sortable: true,
      wrap: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
    },
    {
      name: "Requisitos",
      selector: (row) => row.requisitos,
      sortable: true,
      wrap: true,
    },
    {
      name: "Salario",
      selector: (row) => row.salario,
      sortable: true,
      center: true,
    },
    {
      name: "Cantidad Puestos",
      selector: (row) => row.cantidadConvocatoria,
      sortable: true,
      center: true,
    },
    {
      name: "Cargo",
      selector: (row) => row.nombreCargo,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha Apertura",
      selector: (row) => row.fecha_apertura,
      sortable: true,
      center: true,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">
        Gestión y Control de Convocatorias
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p className="text-center">Cargando datos...</p>
      ) : (
        <div className="card shadow-sm border-0 mb-5 p-3">
          <DataTable
            title="Lista de Convocatorias"
            columns={columns}
            data={convocatorias}
            pagination
            paginationPerPage={3}
            fixedHeader
            responsive
            highlightOnHover
            striped
            persistTableHead
            progressPending={loading}
            customStyles={{
              tableWrapper: {
                style: { overflowX: "auto" },
              },
            }}
          />
        </div>
      )}

      {/* Formulario para agregar convocatoria */}
      <FormularioAgregarConvocatoria
        agregar={agregar}
        setAgregar={setAgregar}
        handleAgregar={handleAgregar}
        cargos={cargos}
      />
    </div>
  );
};

export default TablaVacantes;
