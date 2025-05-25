import React, { useState } from "react";
import imagen from "../assets/1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  const [formData, setFormData] = useState({
    num_doc: "",
    nombres: "",
    apellidos: "",
    email: "",
    tipodDoc: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    if (!value) {
      return "Este campo es obligatorio";
    }

    switch (name) {
      case "num_doc":
        if (!/^\d{6,10}$/.test(value))
          error = "Debe tener entre 6 y 10 dígitos";
        break;
      case "nombres":
      case "apellidos":
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          error = "Solo letras y espacios";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Correo no válido";
        break;
      case "password":
        if (value.length < 6) error = "Mínimo 6 caracteres";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["num_doc", "nombres", "apellidos"].includes(name)) {
      if (name === "num_doc" && !/^\d{0,10}$/.test(value)) return;
      if (
        ["nombres", "apellidos"].includes(name) &&
        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(value)
      )
        return;
    }

    setFormData({ ...formData, [name]: value });

    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      action: "registrarse",
      ...formData,
      estado: 1,
      rol_idrol: "4",
    };

    setIsSubmitting(true);

    axios
      .post("http://localhost/gestorplus/backend/", data)
      .then((response) => {
        let serverMessage = response.data.message;
        try {
          serverMessage = JSON.parse(serverMessage);
        } catch {}
        if (serverMessage?.message === "Usuario registrado Correctamente") {
          alert("Usuario Registrado Correctamente");
          navigate("/Login");
        } else {
          alert("Hubo un error al registrar");
        }
      })
      .catch(() => {
        alert("Error en el registro, por favor intenta de nuevo");
      })
      .finally(() => setIsSubmitting(false));
  };

  const renderInput = ({
    name,
    icon,
    placeholder,
    type = "text",
    maxLength,
  }) => (
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <span className="material-icons text-primary">{icon}</span>
        </span>
        <input
          type={type}
          name={name}
          className={`form-control border-start-0 ${
            errors[name] ? "is-invalid" : formData[name] ? "is-valid" : ""
          }`}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          maxLength={maxLength}
        />
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </div>
    </div>
  );

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-body-secondary position-relative"
      style={{
        background: "linear-gradient(135deg, #dee2e6, #ffffff)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container animate__animated animate__fadeInDown">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card border-0 shadow rounded-4 overflow-hidden">
              <div className="row g-0">
                <div
                  className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4"
                  style={{
                    background: "linear-gradient(to right, #2196f3, #0d6efd)",
                  }}
                >
                  <img
                    src={imagen}
                    alt="logo"
                    className="img-fluid mb-3 animate__animated animate__zoomIn"
                    style={{ width: "180px" }}
                  />
                  <h3 className="fw-bold text-center">Únete a GestorPlus</h3>
                  <p className="text-center small">
                    Forma parte de nuestra comunidad en La Fayette
                  </p>
                </div>

                <div className="col-md-6 bg-white p-5">
                  <h4 className="mb-4 text-primary">Crea tu cuenta</h4>
                  <form onSubmit={handleSubmit} noValidate>
                    {renderInput({
                      name: "num_doc",
                      icon: "person",
                      placeholder: "Número de documento",
                      maxLength: 10,
                    })}
                    {renderInput({
                      name: "nombres",
                      icon: "person",
                      placeholder: "Nombres",
                    })}
                    {renderInput({
                      name: "apellidos",
                      icon: "person",
                      placeholder: "Apellidos",
                    })}
                    {renderInput({
                      name: "email",
                      icon: "email",
                      placeholder: "Correo electrónico",
                    })}
                    {renderInput({
                      name: "password",
                      icon: "lock",
                      placeholder: "Contraseña",
                      type: "password",
                    })}

                    {/* Select de tipo de documento */}
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <span className="material-icons text-primary">
                            description
                          </span>
                        </span>
                        <select
                          name="tipodDoc"
                          className={`form-select border-start-0 ${
                            errors.tipodDoc
                              ? "is-invalid"
                              : formData.tipodDoc
                              ? "is-valid"
                              : ""
                          }`}
                          value={formData.tipodDoc}
                          onChange={handleChange}
                        >
                          <option value="">Tipo de documento</option>
                          <option value="Cédula">Cédula</option>
                          <option value="Tarjeta de Identidad">
                            Tarjeta de Identidad
                          </option>
                          <option value="Pasaporte">Pasaporte</option>
                          <option value="Visa">Visa</option>
                          <option value="PEP">PEP</option>
                          <option value="Otro">Otro</option>
                        </select>
                        {errors.tipodDoc && (
                          <div className="invalid-feedback">
                            {errors.tipodDoc}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-lg shadow-sm"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Registrando..." : "Registrar"}
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => navigate("/Login")}
                      >
                        Ya tengo una cuenta
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-muted small">
              © {new Date().getFullYear()} GestorPlus - La Fayette
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
