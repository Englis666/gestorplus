import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";

const ModalHojaDeVidaEntrevistado = ({ num_doc, identrevista, onClose }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (num_doc) {
      fetchHojaDeVida();
    }
  }, [num_doc]);

  const fetchHojaDeVida = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          action: "obtenerDatosDelEntrevistado",
          num_doc: num_doc,
        },
      });

      const data = response.data.Entrevistado ?? null;

      if (data) {
        setFormData(data);
        setHasData(true);
      } else {
        setFormData({});
        setHasData(false);
      }
    } catch (error) {
      console.error("Error al obtener la hoja de vida:", error);
      alert("Ocurrió un error al cargar los datos.");
      setFormData({});
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const rechazarEntrevistado = async () => {
    try {
      const response = await axios.post("http://localhost/gestorplus/backend", {
        params: {
          action: "rechazarEntrevistado",
          num_doc: num_doc,
        },
      });
    } catch (error) {
      console.error("error al rechazar al entreevistado", error);
      alert("Ocurrio un error en el catch");
    }
  };

  if (isLoading) {
    return (
      <div className="modal-backdrop show d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered animate__animated animate__fadeInDown">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header bg-info text-white rounded-top-4">
            <h5 className="modal-title">🧾 Hoja de Vida del Aspirante</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {!hasData ? (
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <div>
                  ⚠️ Este aspirante aún no ha registrado su hoja de vida.
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>👤 Nombre:</strong> {formData.nombres}{" "}
                    {formData.apellidos}
                  </li>
                  <li className="list-group-item">
                    <strong>📧 Correo:</strong> {formData.email}
                  </li>
                  <li className="list-group-item">
                    <strong>🎂 Fecha de Nacimiento:</strong>{" "}
                    {formData.fechaNacimiento}
                  </li>
                  <li className="list-group-item">
                    <strong>🏠 Dirección:</strong> {formData.direccion}
                  </li>
                  <li className="list-group-item">
                    <strong>🌆 Ciudad:</strong> {formData.ciudad}
                  </li>
                  <li className="list-group-item">
                    <strong>📞 Teléfono:</strong> {formData.telefono}
                  </li>
                </ul>

                <h5 className="mt-4">🎓 Estudios:</h5>
                {formData.estudios && formData.estudios.length > 0 ? (
                  <div className="table-responsive rounded shadow-sm">
                    <table className="table table-striped table-hover table-bordered align-middle">
                      <thead className="table-info text-center">
                        <tr>
                          <th>Nivel</th>
                          <th>Área</th>
                          <th>Estado</th>
                          <th>Inicio</th>
                          <th>Fin</th>
                          <th>Título</th>
                          <th>Institución</th>
                          <th>Ubicación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.estudios.map((estudio, index) => (
                          <tr key={index}>
                            <td>{estudio.nivelEstudio}</td>
                            <td>{estudio.areaEstudio}</td>
                            <td>{estudio.estadoEstudio}</td>
                            <td>{estudio.fechaInicioEstudio}</td>
                            <td>{estudio.fechaFinEstudio}</td>
                            <td>{estudio.tituloEstudio}</td>
                            <td>{estudio.institucionEstudio}</td>
                            <td>{estudio.ubicacionEstudio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No se encontraron registros de estudios.</p>
                )}

                <h5 className="mt-4">💼 Experiencia:</h5>
                {formData.experiencias && formData.experiencias.length > 0 ? (
                  <div className="table-responsive rounded shadow-sm">
                    <table className="table table-striped table-hover table-bordered align-middle">
                      <thead className="table-secondary text-center">
                        <tr>
                          <th>Profesión</th>
                          <th>Descripción</th>
                          <th>Inicio</th>
                          <th>Fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.experiencias.map((exp, index) => (
                          <tr key={index}>
                            <td>{exp.profesion}</td>
                            <td>{exp.descripcionPerfil}</td>
                            <td>{exp.fechaInicioExp}</td>
                            <td>{exp.fechaFinExp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No se encontraron registros de experiencia.</p>
                )}
              </>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button className="btn btn-outline-danger" onClick={onClose}>
              ❌ Rechazar
            </button>
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancelar
            </button>
            {hasData && (
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate("/SistemaDeGestion", {
                    state: {
                      num_doc,
                      nombres: formData.nombres,
                      identrevista,
                      idpostulacion: formData.idpostulacion,
                    },
                  })
                }
              >
                ✅ Asignar al Sistema de Gestión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalHojaDeVidaEntrevistado;
