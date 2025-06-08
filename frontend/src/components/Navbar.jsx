/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import logo from "../assets/Gestorplus.png";
import "./css/Navbar.css";
import API_URL from "../config";

const Navbar = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}obtenerNotificacionesAspirante`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    if (user) fetchNotifications();
  }, [user, token]);

  const handleLogout = () => {
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
    navigate("/");
  };

  return (
    <>
      <header
        className="navbar-modern position-fixed top-0 w-100 d-flex align-items-center justify-content-between px-4 py-2 shadow-lg animate__animated animate__fadeInDown"
        style={{
          background: "rgba(255,255,255,0.98)",
          zIndex: 1050,
          minHeight: 80,
          height: 80,
        }}
      >
        <div
          className="d-flex align-items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
          style={{ textDecoration: "none" }}
        >
          <img
            src={logo}
            alt="Gestorplus Logo"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "3px",
              boxShadow: "0 2px 8px #1976d211",
            }}
          />
          <span
            className="fw-bold text-dark"
            style={{
              fontSize: "1.6rem",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: ".5px",
            }}
          >
            Gestorplus
          </span>
        </div>
        <nav className="d-flex align-items-center gap-3">
          <button
            className="btn-modern btn-primary"
            onClick={() => navigate("/")}
          >
            Inicio
          </button>
          <button
            className="btn-modern"
            onClick={() => navigate("/aspirante/trabajo")}
          >
            Trabajos
          </button>
          {user && (
            <>
              <button
                className="btn-modern"
                onClick={() => navigate("/aspirante/MisPostulaciones")}
              >
                Postulaciones
              </button>
              <button
                className="btn-modern"
                onClick={() => navigate("/Perfil")}
              >
                Perfil
              </button>
              <div className="position-relative">
                <button
                  className="btn btn-light rounded-circle p-2"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="material-icons text-primary">notifications</i>
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-box position-absolute end-0 mt-2 animate__animated animate__fadeIn">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <div key={i} className="notification-item">
                          {n.descripcionNotificacion}
                        </div>
                      ))
                    ) : (
                      <div className="notification-item text-muted">
                        No hay notificaciones nuevas.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span
                className="badge bg-light text-dark px-3 py-2 rounded-pill"
                style={{ fontSize: "1.01rem", fontWeight: 500 }}
              >
                {user.num_doc}
              </span>
              <button
                className="btn-modern bg-danger text-white"
                onClick={handleLogout}
                style={{ fontWeight: 600 }}
              >
                Cerrar sesión
              </button>
            </>
          )}
          {!user && (
            <button className="btn-modern" onClick={() => navigate("/login")}>
              Iniciar Sesión
            </button>
          )}
        </nav>
      </header>
      {/* Espaciador para que el contenido no quede debajo del navbar */}
      <div style={{ height: 80, minHeight: 80 }} />
    </>
  );
};

export default Navbar;
