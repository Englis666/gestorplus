/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import CalendarioDeEntrevistas from "../CalendarioDeEntrevistas";
import ModalHojadeVidaEntrevistado from "../modals/ModalHojadeVidaEntrevistado";
import {
  obtenerEntrevistas,
  enviarAsistenciaEntrevista,
  enviarNoAsistenciaEntrevista,
} from "../../services/EntrevistasService";

const TablaEntrevistas = () => {
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchEntrevistas = obtenerEntrevistas();
    fetchEntrevistas
      .then((data) => {
        if (Array.isArray(data)) {
          setEntrevistas(data);
        } else {
          setEntrevistas([]);
        }
      })
      .catch((err) => {
        setError("Hubo un problema al cargar las entrevistas");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    setLoading(true);
    setError(null);
    setSelectedInterview(null);
    setModalOpen(false);
  }, []);
  useEffect(() => {
    const fetchEntrevistas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerEntrevistas();
        setEntrevistas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Hubo un problema al cargar las entrevistas");
      } finally {
        setLoading(false);
      }
    };
    fetchEntrevistas();
  }, []);

  const enviarAsistencia = async (asistencia, identrevista) => {
    try {
      if (asistencia) {
        await enviarAsistenciaEntrevista(identrevista, true);
      } else {
        await enviarNoAsistenciaEntrevista(identrevista, "No asistió");
      }
      setEntrevistas((prev) =>
        prev.map((e) =>
          e.identrevista === identrevista
            ? { ...e, estadoEntrevista: asistencia ? "Asistió" : "No asistió" }
            : e
        )
      );
    } catch (err) {
      console.error("Error al actualizar la asistencia", err);
    }
  };

  const abrirModalHojadevida = () => {
    setModalOpen(true);
  };

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Hora",
      selector: (row) => row.hora,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre empleado",
      selector: (row) => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Número de documento",
      selector: (row) => row.usuario_num_doc,
      sortable: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estadoEntrevista,
      sortable: true,
      center: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        cursor: "pointer",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#e9ecef",
        fontWeight: "bold",
        textAlign: "center",
      },
    },
    cells: {
      style: {
        textAlign: "center",
      },
    },
  };

  if (loading) return <div>Cargando entrevistas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Entrevistas</h1>

      <div className="row">
        <div className="col-md-7">
          <div
            className="card shadow-sm border-0 mb-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body">
              <p>Entrevistas en totalidad por empleado</p>

              <DataTable
                columns={columns}
                data={entrevistas}
                customStyles={customStyles}
                pagination
                highlightOnHover
                pointerOnHover
                onRowClicked={setSelectedInterview}
                responsive
              />
            </div>
          </div>

          {selectedInterview && (
            <div
              className="card shadow-sm border-1 mb-4"
              style={{ borderRadius: "10px" }}
            >
              <div className="card-body">
                <h5>Detalles de la Entrevista</h5>
                <p>
                  <strong>Nombre:</strong> {selectedInterview.nombres}{" "}
                  {selectedInterview.apellidos}
                </p>
                <p>
                  <strong>Fecha:</strong> {selectedInterview.fecha}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedInterview.hora}
                </p>
                <p>
                  <strong>Lugar:</strong> {selectedInterview.lugarMedio}
                </p>
                <p>
                  <strong>Descripción:</strong> {selectedInterview.descripcion}
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setSelectedInterview(null)}
                >
                  <span className="material-icons me-1">close</span>
                  Cerrar
                </button>

                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={abrirModalHojadevida}
                >
                  <span className="material-icons me-1">description</span>
                  Revisar hoja de vida
                </button>

                <button
                  className="btn btn-outline-danger d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    enviarAsistencia(false, selectedInterview.identrevista);
                  }}
                >
                  <span className="material-icons me-1">block</span>
                  No asistió
                </button>

                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    enviarAsistencia(true, selectedInterview.identrevista);
                  }}
                >
                  <span className="material-icons me-1">check_circle</span>
                  Asistencia correcta
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-5">
          <div
            className="card shadow-sm border-0 mb-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="card-body">
              <h5 className="mb-3">Calendario de Entrevistas</h5>
              <CalendarioDeEntrevistas
                entrevistas={entrevistas}
                onSelectInterview={setSelectedInterview}
              />
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedInterview && (
        <ModalHojadeVidaEntrevistado
          num_doc={selectedInterview.num_doc}
          identrevista={selectedInterview.identrevista}
          idpostulacion={selectedInterview.idpostulacion}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TablaEntrevistas;
