import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ModalPostulantes = ({ convocatoria, onClose }) => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .then((response) => {
        console.log(response);
        const data = response.data?.data;
        setPostulantes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los postulantes");
      })
      .finally(() => setLoading(false));
  }, [convocatoria]);

  return (
    <div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Postulantes - {convocatoria.nombreConvocatoria}
              </h5>
              <button
                type="button"
                className="close btn"
                onClick={onClose}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <p>Cargando postulantes...</p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre y Apellido</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Ver Hoja De Vida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postulantes.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombres} {p.apellidos}</td>
                        <td>{p.email}</td>
                        <td>{p.telefono}</td>
                        <td>
                          <button
                            className="btn btn-primary">
                            Ver Hoja De Vida
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
      <div className="modal-backdrop fade show"></div>
    </div>
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
