/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/Gestorplus.png";
import "./css/NavbarClosed.css";

const NavbarClosed = ({ activeLink }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 900);
  const [rol, setRol] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");
    if (!token) return navigate("/layout");

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.exp * 1000 < Date.now()) return;
      const userRole = decodedToken?.data?.rol;
      setRol(userRole);
    } catch {
      return;
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "auth_token=; Max-Age=0; path=/;";
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    document.cookie = "auth_token=; Max-Age=0; path=/; domain=localhost";
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=localhost";
    localStorage.removeItem("rol");
    localStorage.removeItem("jornadaFinalizada");
    navigate("/Login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClick = (item) => {
    if (!item.subMenu) {
      navigate(item.path);
    }
  };

  const handleDoubleClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const isMenuItemActive = (item) => {
    if (item.path === activeLink) return true;
    if (item.subMenu)
      return item.subMenu.some((sub) => sub.path === activeLink);
    return false;
  };

  // Usa useMemo para evitar duplicados y recalcular solo cuando cambia el rol
  const menuItems = useMemo(() => {
    const items = [
      { label: "Inicio", icon: "home", path: "/Inicio" },
      {
        label: "Sección de jornadas",
        icon: "event",
        subMenu: [
          { label: "Jornadas", icon: "event", path: "/Jornadas" },
          { label: "Horas Extra", icon: "timeline", path: "/HorasExtra" },
        ],
      },
      {
        label: "Sección Novedades",
        icon: "hourglass_empty",
        subMenu: [
          { label: "Permisos", icon: "event_available", path: "/Permisos" },
          { label: "Vacaciones", icon: "beach_access", path: "/Vacaciones" },
          { label: "Ausencias", icon: "event_busy", path: "/Ausencias" },
        ],
      },
      { label: "Paz y salvos", icon: "check_circle", path: "/PazYsalvo" },
      { label: "Publicaciones", icon: "library_books", path: "/Publicaciones" },
      { label: "PQRS", icon: "report_problem", path: "/Quejas" },
      { label: "Mi perfil", icon: "person", path: "/Perfil" },
      { label: "Certificados", icon: "description", path: "/Certificados" },
    ];

    if (rol === "1" || rol === "2") {
      items.push({ label: "Empleados", icon: "people", path: "/Empleados" });
      items.push({ label: "Contratos", icon: "work", path: "/Contratos" });
      items.push({
        label: "Seccion Entrevistas",
        icon: "event_note",
        subMenu: [
          { label: "Entrevistas", icon: "event_note", path: "/Entrevistas" },
          {
            label: "Sistema de Gestión",
            icon: "work",
            path: "/SistemaDeGestion",
          },
        ],
      });
      items.push({
        label: "Seccion Convocatorias",
        icon: "people",
        subMenu: [
          { label: "Convocatorias", icon: "people", path: "/Convocatorias" },
          {
            label: "Postulaciones",
            icon: "assignment",
            path: "/Postulaciones",
          },
          { label: "Cargos", icon: "work", path: "/Cargos" },
        ],
      });
    }

    // SIEMPRE agrega el logout al final
    items.push({
      label: "Cerrar sesión",
      icon: "exit_to_app",
      path: "/",
      onClick: handleLogout,
      isLogout: true,
    });

    return items;
    // eslint-disable-next-line
  }, [rol]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsCollapsed(false); // Siempre abierta en desktop
      } else {
        setIsCollapsed(true); // Siempre cerrada en mobile
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`navbar-closed${isCollapsed ? " collapsed" : ""}`}>
      <button
        className="navbar-toggle-btn"
        onClick={() => {
          if (window.innerWidth > 900) toggleCollapse();
        }}
        title={isCollapsed ? "Abrir menú" : "Cerrar menú"}
        disabled={window.innerWidth <= 900}
      >
        <span className="material-icons">
          {isCollapsed ? "menu_open" : "menu"}
        </span>
      </button>

      <div className="logo-container">
        <img src={logo} alt="GestorPlus Logo" className="logo-image" />
        <span className="logo-text">Gestorplus</span>
      </div>

      <nav>
        {/* Renderiza todos los items menos el logout */}
        {menuItems
          .filter((item) => !item.isLogout)
          .map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`menu-item${
                  isMenuItemActive(item) && !item.isLogout ? " active" : ""
                }`}
                title={isCollapsed ? item.label : ""}
                onClick={() =>
                  item.onClick
                    ? item.onClick()
                    : item.subMenu
                    ? handleDoubleClick(index)
                    : handleClick(item)
                }
              >
                <span className="material-icons">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
                {item.subMenu && !isCollapsed && (
                  <span
                    className="material-icons"
                    style={{ marginLeft: "auto" }}
                  >
                    {openSubMenu === index ? "expand_less" : "expand_more"}
                  </span>
                )}
              </div>

              {/* Submenús */}
              {item.subMenu && openSubMenu === index && !isCollapsed && (
                <div className="sub-menu">
                  {item.subMenu.map((sub, i) => (
                    <div
                      key={i}
                      className="sub-item"
                      onClick={() => navigate(sub.path)}
                    >
                      <span className="material-icons">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {item.subMenu && isCollapsed && hoveredIndex === index && (
                <div className="floating-menu" style={{ top: index * 60 + 80 }}>
                  {item.subMenu.map((sub, i) => (
                    <div
                      key={i}
                      className="sub-item"
                      onClick={() => navigate(sub.path)}
                    >
                      <span className="material-icons">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        {/* Logout SIEMPRE al final */}
        <div
          className="logout"
          title={isCollapsed ? "Cerrar sesión" : ""}
          onClick={menuItems[menuItems.length - 1].onClick}
        >
          <span className="material-icons">
            {menuItems[menuItems.length - 1].icon}
          </span>
          {!isCollapsed && <span>{menuItems[menuItems.length - 1].label}</span>}
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
