/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import imagen from "../assets/1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/userContext";
import API_URL from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ num_doc: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "num_doc" && !/^\d{0,10}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.num_doc || !formData.password) {
      alert("Por favor complete todos los campos.");
      return;
    }

    const data = {
      action: "login",
      num_doc: formData.num_doc,
      password: formData.password,
    };

    setIsSubmitting(true);
    axios
      .post(API_URL, data)
      .then((response) => {
        console.log(response.data);
        const res = response.data;
        if (res?.status === "success") {
          const token = res?.data?.token;
          document.cookie = `auth_token=${token}; path=/; domain=localhost;`;
          login({ token });

          const decoded = decodeToken(token);
          const role = decoded?.data?.rol;
          localStorage.setItem("rol", role);
          localStorage.setItem("jornadaFinalizada", "false");
          if (["1", "2", "3"].includes(role)) {
            navigate("/Inicio");
          } else {
            navigate("/aspirante/inicio");
          }
        } else {
          alert(res?.message || "Error en el inicio de sesión");
          setIsSubmitting(false);
        }
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Intenta de nuevo.");
        setIsSubmitting(false);
      });
  };

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error("Error decodificando el token:", e);
      return null;
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
                    Bienvenido a GestorPlus
                  </h3>
                  <p className="text-center small">
                    Plataforma de recursos humanos para La Fayette
                  </p>
                </div>

                <div className="col-md-6 bg-white p-5">
                  <h4 className="mb-4 text-primary">Inicia Sesión</h4>
                  <form
                    onSubmit={handleSubmit}
                    className="needs-validation"
                    noValidate
                  >
                    <div className="mb-3">
                      <label htmlFor="num_doc" className="form-label">
                        Número de Documento
                      </label>
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-white border-end-0">
                          <span className="material-icons text-primary">
                            person
                          </span>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          name="num_doc"
                          placeholder="Ej: 1234567890"
                          value={formData.num_doc}
                          onChange={handleChange}
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="input-group mb-4">
                      <span className="input-group-text bg-white border-end-0">
                        <span className="material-icons text-primary">
                          lock
                        </span>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-lg shadow-sm"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Iniciando..." : "Ingresar"}
                      </button>

                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => navigate("/Registro")}
                      >
                        Crear una cuenta
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => navigate("/RecuperarPassword")}
                      >
                        Recuperar Password
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

export default Login;
