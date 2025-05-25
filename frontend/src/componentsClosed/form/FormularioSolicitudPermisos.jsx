import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";
const SolicitudPermiso = () => {
  const [formData, setFormData] = useState({
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const authToken = getCookie("auth_token");
    if (authToken) {
      setToken(authToken);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!formData.tipo) errs.tipo = "El tipo de permiso es obligatorio.";
    if (!formData.fechaInicio)
      errs.fechaInicio = "La fecha de inicio es obligatoria.";
    if (!formData.fechaFin) errs.fechaFin = "La fecha de fin es obligatoria.";
    if (
      formData.fechaInicio &&
      formData.fechaFin &&
      formData.fechaInicio > formData.fechaFin
    ) {
      errs.fechaFin =
        "La fecha de fin no puede ser anterior a la fecha de inicio.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const response = await axios.post(
        API_URL,
        {
          action: "solicitarPermiso",
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setSuccess("Permiso solicitado con éxito.");
        setFormData({ tipo: "", fechaInicio: "", fechaFin: "" });
      } else {
        setErrors({
          general: response.data.message || "Error al enviar la solicitud.",
        });
      }
    } catch (error) {
      if (error.response) {
        setErrors({
          general: error.response.data.message || "Error del servidor.",
        });
      } else if (error.request) {
        setErrors({ general: "No se recibió respuesta del servidor." });
      } else {
        setErrors({ general: "Error de conexión: " + error.message });
      }
    }
  };

  return (
    <div className="container mt-4 animate__animated animate__fadeIn">
      <div className="card shadow rounded-4">
        <div className="card-body">
          <h4 className="mb-4">
            <i className="material-icons text-primary align-middle">
              event_note
            </i>{" "}
            Solicitud de Permiso
          </h4>

          {success && <div className="alert alert-success">{success}</div>}
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">
                Tipo de Permiso
              </label>
              <select
                className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                name="tipo"
                id="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="Incapacidad">Incapacidad</option>
                <option value="Permiso por hijo menor de edad">
                  Permiso por hijo menor de edad
                </option>
                <option value="Cita médica por especialista">
                  Cita médica por especialista
                </option>
              </select>
              {errors.tipo && (
                <div className="invalid-feedback">{errors.tipo}</div>
              )}
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="fechaInicio" className="form-label">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    errors.fechaInicio ? "is-invalid" : ""
                  }`}
                  name="fechaInicio"
                  id="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
                {errors.fechaInicio && (
                  <div className="invalid-feedback">{errors.fechaInicio}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="fechaFin" className="form-label">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    errors.fechaFin ? "is-invalid" : ""
                  }`}
                  name="fechaFin"
                  id="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                />
                {errors.fechaFin && (
                  <div className="invalid-feedback">{errors.fechaFin}</div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-primary px-4">
                <i className="material-icons align-middle">send</i> Solicitar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitudPermiso;
