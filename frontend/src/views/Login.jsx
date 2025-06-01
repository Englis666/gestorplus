/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useState } from "react";
import imagen from "../assets/2.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/userContext";
import API_URL from "../config";
import "../css/forms/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ num_doc: "", password: "" });
  const [registerData, setRegisterData] = useState({
    num_doc: "",
    password: "",
    email: "",
    nombres: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  // Login handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "num_doc" && !/^\d{0,10}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.num_doc || !formData.password) {
      setErrorMsg("Por favor complete todos los campos.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    axios
      .post(API_URL, {
        action: "login",
        num_doc: formData.num_doc,
        password: formData.password,
      })
      .then((response) => {
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
          setErrorMsg(res?.message || "Error en el inicio de sesión");
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setErrorMsg("Error al iniciar sesión. Intenta de nuevo.");
        setIsSubmitting(false);
      });
  };

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-side">
          <img src={imagen} alt="logo" className="login-side-img" />
          <h2 className="login-side-title">GestorPlus</h2>
          <p className="login-side-desc">
            Bienvenido a la plataforma de Recursos Humanos <br />
            <span>La Fayette</span>
          </p>
        </div>
        <div
          className={`login-form-wrap ${showRegister ? "show-register" : ""}`}
        >
          <form
            className={`login-form ${showRegister ? "form-hide" : "form-show"}`}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <h3 className="login-title">Iniciar Sesión</h3>
            <div className="login-field">
              <label htmlFor="num_doc">Número de Documento</label>
              <div className="login-input-wrap">
                <span className="material-icons login-icon">person</span>
                <input
                  type="text"
                  name="num_doc"
                  id="num_doc"
                  placeholder="Ej: 1234567890"
                  value={formData.num_doc}
                  onChange={handleChange}
                  maxLength="10"
                  className={errorMsg && !formData.num_doc ? "login-error" : ""}
                  autoFocus
                />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <div className="login-input-wrap">
                <span className="material-icons login-icon">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className={
                    errorMsg && !formData.password ? "login-error" : ""
                  }
                />
                <button
                  type="button"
                  className="login-eye"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  <span className="material-icons">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            {errorMsg && <div className="login-alert">{errorMsg}</div>}
            <button className="login-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="login-spinner"></span>
              ) : (
                "Ingresar"
              )}
            </button>
            <div className="login-links">
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/Registro")}
              >
                Crear una cuenta
              </button>
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/RecuperarPassword")}
              >
                Recuperar contraseña
              </button>
            </div>
          </form>

          <div className="login-copyright">
            © {new Date().getFullYear()} GestorPlus - La Fayette
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
