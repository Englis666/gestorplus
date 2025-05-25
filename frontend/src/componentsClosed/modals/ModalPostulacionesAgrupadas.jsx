/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import AsignarEntrevistaModal from "../form/AsignarEntrevistaModal";
import API_URL from "../../config";

const ModalPostulantes = ({ convocatoria, onClose }) => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalHoja, setModalHoja] = useState(false);
  const [hojaData, setHojaData] = useState(null);
  const [loadingHoja, setLoadingHoja] = useState(false);

  const [showAsignar, setShowAsignar] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  useEffect(() => {
    if (!convocatoria) return;
    setLoading(true);
    setError(null);

    axios
      .get(API_URL, {
        params: {
          action: "obtenerPostulacionesAgrupadasPorConvocatoria",
          idconvocatoria: convocatoria.idconvocatoria,
        },
      })
      .then(({ data }) => {
        if (data.status === "error") {
          throw new Error(data.message);
        }
        setPostulantes(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar los postulantes");
      })
      .finally(() => setLoading(false));
  }, [convocatoria]);

  const handleVerHoja = (p) => {
    setLoadingHoja(true);
    setHojaData(null);
    setModalHoja(true);

    axios
      .get(API_URL, {
        params: {
          action: "obtenerHojadevidaPorNumDoc",
          num_doc: p.num_doc,
        },
      })
      .then(({ data }) => {
        console.log(data);
        if (data.status === "error") {
          throw new Error(data.message);
        }
        setHojaData(data.data);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar la hoja de vida");
      })
      .finally(() => setLoadingHoja(false));
  };

  const toggleModalHoja = () => {
    setModalHoja(false);
    setHojaData(null);
  };

  const handleShowAsignar = (p) => {
    setSelectedPostulacion(p);
    setShowAsignar(true);
  };

  const handleCloseAsignar = () => {
    setShowAsignar(false);
    setSelectedPostulacion(null);
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Postulantes – {convocatoria.nombreConvocatoria}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center py-4">Cargando postulantes…</div>
              ) : (
                <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Puntaje</th>
                        <th>Rendimiento</th>
                        <th>Hoja de Vida</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postulantes.length > 0 ? (
                        postulantes.map((p) => (
                          <tr key={p.num_doc}>
                            <td>{p.nombres}</td>
                            <td>{p.email}</td>
                            <td>{p.cargo}</td>
                            <td>{p.puntaje}</td>
                            <td>{p.rendimiento}</td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleVerHoja(p)}
                              >
                                Ver Hoja
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleShowAsignar(p)}
                              >
                                Asignar Entrevista
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-3">
                            No hay postulantes
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />

      {modalHoja && (
        <>
          <div
            className="modal fade show d-block animate__fadeInDown"
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content shadow-lg rounded-4">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <span className="material-icons me-1">visibility</span>
                    Hoja de Vida
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleModalHoja}
                  />
                </div>
                <div className="modal-body">
                  {loadingHoja ? (
                    <div className="text-center py-4">Cargando hoja…</div>
                  ) : hojaData ? (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <strong>Fecha de nacimiento:</strong>
                        <p>{hojaData.fechaNacimiento}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Dirección:</strong>
                        <p>{hojaData.direccion}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Ciudad:</strong>
                        <p>{hojaData.ciudad}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Ciudad de nacimiento:</strong>
                        <p>{hojaData.ciudadNacimiento}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Teléfono móvil:</strong>
                        <p>{hojaData.telefono}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Teléfono fijo:</strong>
                        <p>{hojaData.telefonoFijo}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Estado de HV:</strong>
                        <p>{hojaData.estadohojadevida}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center">No hay datos para mostrar.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={toggleModalHoja}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {showAsignar && selectedPostulacion && (
        <AsignarEntrevistaModal
          show={showAsignar}
          handleClose={handleCloseAsignar}
          postulacion={selectedPostulacion}
        />
      )}
    </>
  );
};

ModalPostulantes.propTypes = {
  convocatoria: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ModalPostulantes;
