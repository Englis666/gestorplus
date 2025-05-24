import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import AsignarEntrevistaModal from "../form/AsignarEntrevistaModal";

const TablaPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        const response = await axios.get("http://localhost/gestorplus/backend/", {
          params: { action: "obtenerPostulaciones" },
        });
        const data = response.data.Postulaciones;
        if (Array.isArray(data)) {
          setPostulaciones(data);
        } else {
          console.error("Las postulaciones no están en un arreglo o está vacía la consulta");
          setPostulaciones([]);
        }
      } catch (err) {
        console.error("Error al obtener las postulaciones");
        setError("Error al obtener las postulaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchPostulaciones();
  }, []);

  const handleShowModal = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostulacion(null);
  };


  const columns = [
    {
      name: "Nombre del postulante",
      selector: row => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Cargo de la postulacion",
      selector: row => row.nombreCargo,
      sortable: true,
      center: true,
    },
    {
      name: "Estado de la postulacion",
      selector: row => row.estadoPostulacion,
      sortable: true,
      center: true,
    },
    {
      name: "Accion",
      cell: row => (
        <button
          className="btn btn-primary"
          onClick={() => handleShowModal(row)}
        >
          Asignar Entrevista
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  if (loading) return <div>Cargando Postulaciones...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <h1>Postulaciones</h1>
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body">
          <p>Tabla de notificaciones en el sistema de convocatorias</p>
          <DataTable
            columns={columns}
            data={postulaciones}
            pagination
            highlightOnHover
            striped
            noDataComponent="No existen postulaciones"
            progressPending={loading}
            responsive
          />
        </div>
      </div>

      {selectedPostulacion && (
        <AsignarEntrevistaModal
          show={showModal}
          handleClose={handleCloseModal}
          postulacion={selectedPostulacion}
        />
      )}
    </div>
  );
};

export default TablaPostulaciones;
