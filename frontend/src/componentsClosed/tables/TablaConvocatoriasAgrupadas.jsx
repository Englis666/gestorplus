import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalPostulantes from "../modals/ModalPostulacionesAgrupadas";

const TablaConvocatoriasAgrupadas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/gestorplus/backend/", {
        params: { action: "calcularPostulacionesEnConvocatorias" },
      })
      .then((response) => {
        const data = response.data?.convocatorias;
        setConvocatorias(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar las convocatorias");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenModal = (convocatoria) => {
    setSelectedConvocatoria(convocatoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedConvocatoria(null);
  };

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
          style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
        >
          <div className="card-body">
            <b>Lista de Convocatorias</b>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th># Aspirantes</th>
                  <th>Salario</th>
                  <th>Cargo</th>
                  <th>Agrupación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {convocatorias.map((c) => (
                  <tr key={c.idconvocatoria}>
                    <td>{c.nombreConvocatoria}</td>
                    <td>{c.descripcion}</td>
                    <td>{c.cantidad_postulaciones}</td>
                    <td>{c.salario}</td>
                    <td>{c.nombreCargo}</td>
                    <td>{c.agrupacion}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenModal(c)}
                      >
                        Ver Postulantes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
