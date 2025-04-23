import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import AsignarEntrevistaModal from "../form/AsignarEntrevistaModal";

const ModalPostulantes = ({ convocatoria, onClose }) => {
  // Lista de postulantes
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal ver Hoja de Vida
  const [modalHoja, setModalHoja] = useState(false);
  const [numDoc, setNumDoc] = useState(null);
  const [hojaData, setHojaData] = useState(null);
  const [loadingHoja, setLoadingHoja] = useState(false);

  // Modal Asignar Entrevista
  const [showAsignar, setShowAsignar] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);

  // Carga de postulantes
  useEffect(() => {
    if (!convocatoria) return;
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost/gestorplus/backend/", {
        params: {
          action: "obtenerPostulacionesAgrupadasPorConvocatoria",
          idconvocatoria: convocatoria.idconvocatoria,
        },
      })
      .then((resp) => {
        const data = resp.data?.data;
        setPostulantes(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setError("Error al cargar los postulantes");
      })
      .finally(() => setLoading(false));
  }, [convocatoria]);

  // Abrir modal de Hoja de Vida
  const handleVerHoja = (p) => {
    setNumDoc(p.usuario_num_doc || p.num_doc);
    setModalHoja(true);
  };

  // Cerrar modal de Hoja de Vida
  const toggleModalHoja = () => {
    setModalHoja(false);
    setHojaData(null);
    setNumDoc(null);
  };

  // Cargar datos de Hoja de Vida al abrir
  useEffect(() => {
    if (!modalHoja || !numDoc) return;
    setLoadingHoja(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    axios
      .get("http://localhost/gestorplus/backend/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { action: "datosPerfil", num_doc: numDoc },
      })
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setHojaData(data.data);
        } else {
          setError("No se encontraron datos de la hoja de vida");
        }
      })
      .catch((err) => {
        console.error("Error al obtener hoja de vida:", err);
        setError("Error al cargar los datos de la hoja de vida");
      })
      .finally(() => setLoadingHoja(false));
  }, [modalHoja, numDoc]);

  // Abrir modal de Asignar Entrevista
  const handleShowAsignar = (p) => {
    setSelectedPostulacion(p);
    setShowAsignar(true);
  };

  // Cerrar modal de Asignar Entrevista
  const handleCloseAsignar = () => {
    setShowAsignar(false);
    setSelectedPostulacion(null);
  };

  return (
    <>
      {/* Modal de Postulantes */}
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
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
                <p>Cargando postulantes…</p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Hoja de Vida</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postulantes.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombres} {p.apellidos}</td>
                        <td>{p.email}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleVerHoja(p)}
                          >
                            Ver Hoja
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => handleShowAsignar(p)}
                          >
                            Asignar Entrevista
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />

      {/* Modal de Hoja de Vida (solo visualización) */}
      {modalHoja && (
        <>
          <div
            className="modal fade show d-block animate__fadeInDown"
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow-lg rounded-4">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <span className="material-icons">visibility</span> Hoja de Vida
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={toggleModalHoja}
                  />
                </div>
                <div className="modal-body">
                  {loadingHoja ? (
                    <p>Cargando hoja de vida…</p>
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
                        <strong>Estado:</strong>
                        <p>{hojaData.estadohojadevida}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No hay datos para mostrar.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
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

      {/* Modal de Asignar Entrevista */}
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
  convocatoria: PropTypes.shape({
    idconvocatoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombreConvocatoria: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalPostulantes;
