/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import imagen from "../assets/1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import "../css/forms/registro.css";

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
    if (!value) return "Este campo es obligatorio";
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
      .post(API_URL, data)
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

  return (
    <div className="registro-bg">
      <div className="registro-container">
        <div className="registro-side">
          <img src={imagen} alt="logo" className="registro-side-img" />
          <h2 className="registro-side-title">GestorPlus</h2>
          <p className="registro-side-desc">
            Únete a la plataforma de Recursos Humanos <br />
            <strong>La Fayette</strong>
          </p>
        </div>
        <div className="registro-form-wrap">
          <form className="registro-form" onSubmit={handleSubmit} noValidate>
            <h3 className="registro-title">Crear Cuenta</h3>
            <div className="registro-field">
              <label htmlFor="nombres">Nombres</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">badge</span>
                <input
                  type="text"
                  name="nombres"
                  id="nombres"
                  placeholder="Tus nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={errors.nombres ? "registro-error" : ""}
                />
              </div>
              {errors.nombres && (
                <div className="registro-alert">{errors.nombres}</div>
              )}
            </div>
            <div className="registro-field">
              <label htmlFor="apellidos">Apellidos</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">badge</span>
                <input
                  type="text"
                  name="apellidos"
                  id="apellidos"
                  placeholder="Tus apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={errors.apellidos ? "registro-error" : ""}
                />
              </div>
              {errors.apellidos && (
                <div className="registro-alert">{errors.apellidos}</div>
              )}
            </div>
            <div className="registro-field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">mail</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "registro-error" : ""}
                />
              </div>
              {errors.email && (
                <div className="registro-alert">{errors.email}</div>
              )}
            </div>
            <div className="registro-field">
              <label htmlFor="num_doc">Número de Documento</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">person</span>
                <input
                  type="text"
                  name="num_doc"
                  id="num_doc"
                  placeholder="Ej: 1234567890"
                  value={formData.num_doc}
                  onChange={handleChange}
                  maxLength={10}
                  className={errors.num_doc ? "registro-error" : ""}
                />
              </div>
              {errors.num_doc && (
                <div className="registro-alert">{errors.num_doc}</div>
              )}
            </div>
            <div className="registro-field">
              <label htmlFor="password">Contraseña</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">lock</span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "registro-error" : ""}
                />
              </div>
              {errors.password && (
                <div className="registro-alert">{errors.password}</div>
              )}
            </div>
            <div className="registro-field">
              <label htmlFor="tipodDoc">Tipo de documento</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">
                  description
                </span>
                <select
                  name="tipodDoc"
                  id="tipodDoc"
                  value={formData.tipodDoc}
                  onChange={handleChange}
                  className={errors.tipodDoc ? "registro-error" : ""}
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
              </div>
              {errors.tipodDoc && (
                <div className="registro-alert">{errors.tipodDoc}</div>
              )}
            </div>
            <button
              className="registro-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
            <div className="registro-links">
              <button
                type="button"
                className="registro-link"
                onClick={() => navigate("/Login")}
              >
                Ya tengo una cuenta
              </button>
            </div>
          </form>
          <div className="registro-copyright">
            © {new Date().getFullYear()} GestorPlus - La Fayette
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
