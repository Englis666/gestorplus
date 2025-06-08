/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import axios from "axios";
import imagen from "../assets/2.png";
import { Link } from "react-router-dom";
import API_URL from "../config";
import "../css/forms/registro.css"; // Importa los estilos

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
      .post(`${API_URL}recuperarPassword`, formData)
      .then((response) => {
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
      .catch(() => {
        alert("Error en la conexión con el servidor.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="registro-bg">
      <div className="registro-container animate__animated animate__fadeInDown">
        <div className="registro-side">
          <img src={imagen} alt="logo" className="registro-side-img" />
          <h2 className="registro-side-title">GestorPlus</h2>
          <p className="registro-side-desc">
            Recupera tu contraseña
            <br />
            <strong>Recibirás un correo con instrucciones</strong>
          </p>
        </div>
        <div className="registro-form-wrap">
          <form
            className="registro-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <h3 className="registro-title">Recuperar Contraseña</h3>
            <div className="registro-field">
              <label htmlFor="email">Correo Electrónico</label>
              <div className="registro-input-wrap">
                <span className="material-icons registro-icon">email</span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={50}
                  required
                />
              </div>
            </div>
            <button
              className="registro-btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="registro-spinner"></span>
              ) : (
                "Enviar Correo"
              )}
            </button>
            <div className="registro-links">
              <Link to="/login" className="registro-link">
                Volver al Login
              </Link>
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

export default RecuperarPassword;
