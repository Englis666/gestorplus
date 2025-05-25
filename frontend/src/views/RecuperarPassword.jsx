import React, { useState } from "react";
import axios from "axios";
import imagen from "../assets/1.png";
import { Link } from "react-router-dom";

const RecuperarPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && value.length > 50) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Por favor ingresa tu correo electrónico.");
      return;
    }
    setIsSubmitting(true);
    axios
      .post("http://localhost/gestorplus/backend/", formData, {
        params: { action: "recuperarPassword" },
      })
      .then((response) => {
        console.log("respuesta seca response: ", response);
        console.log("Respuesta con data", response.data);
        const res = response.data;
        if (res?.status === "success") {
          alert(
            "Correo enviado con instrucciones para recuperar tu contraseña."
          );
        } else {
          alert(
            "Hubo un problema al enviar el mensaje de recuperación a tu correo."
          );
        }
      })
      .catch((error) => {
        alert("Error en la conexión con el servidor.");
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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
                  <h3 className="fw-bold text-center">
                    Recupera tu contraseña
                  </h3>
                  <p className="text-center small">
                    Introduce tu correo y te enviaremos instrucciones
                  </p>
                </div>

                <div className="col-md-6 bg-white p-5">
                  <h4 className="mb-4 text-primary">Recuperar Password</h4>
                  <form
                    onSubmit={handleSubmit}
                    className="needs-validation"
                    noValidate
                  >
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico
                      </label>
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-white border-end-0">
                          <span className="material-icons text-primary">
                            email
                          </span>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0"
                          id="email"
                          name="email"
                          placeholder="example@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          maxLength={50}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-lg shadow-sm"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Recuperando..." : "Enviar Correo"}
                      </button>
                      <Link to="/login" className="btn btn-outline-primary">
                        Volver al Login
                      </Link>
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

export default RecuperarPassword;
