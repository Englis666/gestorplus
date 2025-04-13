import React, { useState } from "react";
import axios from "axios";


const Experiencia = ({ modalExperiencia, toggleModalExperiencia, onAgregarExperiencia }) => {
  const [formData, setFormData] = useState({
    action: 'agregarExp',
    profesion: "",
    descripcionPerfil: "",
    fechaInicioExp: "",
    fechaFinExp: "",
    cargo: "",
    empresa: "",
    fechaIngreso: "",
    fechaSalida: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("auth_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim() !== "") {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["profesion", "descripcionPerfil", "fechaInicioExp", "fechaFinExp", "cargo", "empresa", "fechaIngreso", "fechaSalida"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    axios
      .post("http://localhost/gestorplus/backend/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.message === "Experiencia agregada") {
          alert("✅ Experiencia agregada correctamente");
          onAgregarExperiencia(response.data.nuevaExperiencia);
        } else {
          alert("❌ Hubo un error al agregar la experiencia.");
        }
      })
      .catch((error) => {
        console.error("Error al registrar experiencia:", error);
        alert("❌ Ocurrió un error al agregar la experiencia.");
      })
      .finally(() => {
        setIsSubmitting(false);
        toggleModalExperiencia();
      });
  };

  return (
    <div
      className={`modal fade ${modalExperiencia ? "show animate__animated animate__fadeInDown" : ""}`}
      style={{ display: modalExperiencia ? "block" : "none", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      aria-labelledby="modalExperienciaLabel"
      aria-hidden={!modalExperiencia}
    >
      <div className="modal-dialog">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <span className="material-icons">work</span>
              Actualizar Experiencia Laboral
            </h5>
            <button type="button" className="btn-close" onClick={toggleModalExperiencia} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            {[
              { name: "profesion", label: "Profesión", type: "text" },
              { name: "descripcionPerfil", label: "Descripción del perfil", type: "text" },
              { name: "fechaInicioExp", label: "Fecha de inicio", type: "date" },
              { name: "fechaFinExp", label: "Fecha de fin", type: "date" },
              { name: "cargo", label: "Cargo", type: "text" },
              { name: "empresa", label: "Empresa", type: "text" },
              { name: "fechaIngreso", label: "Fecha de ingreso", type: "date" },
              { name: "fechaSalida", label: "Fecha de salida", type: "date" },
            ].map(({ name, label, type }) => (
              <div className="form-floating mb-3" key={name}>
                <input
                  type={type}
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={label}
                />
                <label htmlFor={name}>{label}</label>
                {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
              </div>
            ))}
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={toggleModalExperiencia}>
                <span className="material-icons">close</span> Cerrar
              </button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                <span className="material-icons">save</span> Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Experiencia;
