import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import imagen from "../assets/1.png";

const RestablecerPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    // Extraer token de la URL ?token=abc123
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      alert("Token no válido o no proporcionado");
      navigate("/login"); // Redirige si no hay token válido
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      alert("Por favor completa ambos campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = { action: "restablecerPassword", token, password };
      const response = await axios.post(
        "http://localhost/gestorplus/backend/",
        data
      );
      console.log(response);
      if (response.data?.status === "success") {
        console.log(response.data);
        alert("Contraseña restablecida con éxito.");
        navigate("/login");
      } else {
        alert(response.data?.message || "Error al restablecer la contraseña");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
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
                    Restablece tu contraseña
                  </h3>
                  <p className="text-center small">
                    Ingresa y confirma tu nueva contraseña
                  </p>
                </div>
                <div className="col-md-6 bg-white p-5">
                  <h4 className="mb-4 text-primary">Restablecer Contraseña</h4>
                  <form
                    onSubmit={handleSubmit}
                    className="needs-validation"
                    noValidate
                  >
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Nueva Contraseña
                      </label>
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-white border-end-0">
                          <span className="material-icons text-primary">
                            lock
                          </span>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0"
                          id="password"
                          name="password"
                          placeholder="Nueva contraseña"
                          value={formData.password}
                          onChange={handleChange}
                          maxLength={50}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar Contraseña
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <span className="material-icons text-primary">
                            lock
                          </span>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Repite tu contraseña"
                          value={formData.confirmPassword}
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
                        {isSubmitting
                          ? "Restableciendo..."
                          : "Restablecer Contraseña"}
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

export default RestablecerPassword;
