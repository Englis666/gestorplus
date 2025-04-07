// Cambios marcados con comentarios 🔧

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { jwtDecode } from "jwt-decode";

const NavbarClosed = ({ activeLink }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
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
      if (decodedToken?.exp * 1000 < Date.now()) {
        return;
      }
      const userRole = decodedToken?.data?.rol;
      setRol(userRole);
    } catch {
      return;
    }
  }, []);

  const handleLogout = () => {
    logout();
    if (isMounted) navigate("/");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClick = (item, index) => {
    if (!item.subMenu) {
      navigate(item.path);
    }
  };

  const handleDoubleClick = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const styles = {
    navbarContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(to bottom, #ffffff, #e8f4ff)",
      width: isCollapsed ? "80px" : "260px",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      transition: "width 0.3s ease",
      overflowY: "auto",
      position: "relative",
    },
    header: {
      padding: "1.5rem 1rem",
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: "#2980b9",
      textAlign: isCollapsed ? "center" : "left",
    },
    toggleButton: {
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "1.8rem",
      margin: "1rem",
      alignSelf: "flex-end",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      cursor: "pointer",
      transition: "0.2s",
      color: "#2c3e50",
      position: "relative",
    },
    menuItemActive: {
      background: "#dff0ff",
      borderLeft: "4px solid #3498db",
      color: "#3498db",
    },
    icon: {
      fontSize: "1.5rem",
    },
    text: {
      display: isCollapsed ? "none" : "inline-block",
    },
    subMenu: {
      maxHeight: "300px",
      overflow: "hidden",
      transition: "max-height 0.3s ease",
      paddingLeft: isCollapsed ? "1.5rem" : "2.8rem",
    },
    subMenuItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.7rem 1rem",
      cursor: "pointer",
      color: "#5d6d7e",
      borderRadius: "6px",
      transition: "background 0.2s ease",
    },
    logout: {
      marginTop: "auto",
      padding: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      color: "#e74c3c",
      cursor: "pointer",
      fontWeight: "bold",
      borderTop: "1px solid #ccc",
    },
    floatingSubMenu: {
      position: "absolute",
      top: 0,
      left: "80px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      padding: "0.5rem",
      zIndex: 10,
    },
  };
  const isMenuItemActive = (item) => {
    if (item.path === activeLink) return true;
    if (item.subMenu) {
      return item.subMenu.some((sub) => sub.path === activeLink);
    }
    return false;
  };


  const menuItems = [
    {
      label: "Sección de jornadas",
      icon: "event",
      subMenu: [
        { label: "Jornadas", icon: "event", path: "/Jornadas" },
        { label: "Horas Extra", icon: "timeline", path: "/HorasExtra" },
      ],
    },
    {
      label: "Seccion Ausencias",
      icon: "hourglass_empty",
      subMenu: [
        { label: "Vacaciones", icon: "flight", path: "/Vacaciones" },
      ],
    },
    { label: "Paz y salvos", icon: "check_circle", path: "/PazYsalvo" },
    { label: "Quejas", icon: "report_problem", path: "/Quejas" },
    { label: "Mi perfil", icon: "person", path: "/Perfil" },
    { label: "Certificados", icon: "description", path: "/Certificados" },
  ];

  if (rol === "1" || rol === "2") {
    menuItems.push({ label: "Empleados", icon: "people", path: "/Empleados" });
    menuItems.push({ label: "Contratos", icon: "work", path: "/Contratos" });
    menuItems.push({
      label: "Seccion Entrevistas",
      icon: "event_note",
      subMenu: [
        { label: "Entrevistas", icon: "event_note", path: "/Entrevistas" },
        { label: "Sistema de Gestión", icon: "work", path: "/SistemaDeGestion" },
      ],
    });
    menuItems.push({
      label: "Seccion Convocatorias",
      icon: "people",
      subMenu: [
        { label: "Convocatorias", icon: "people", path: "/Convocatorias" },
        { label: "Postulaciones", icon: "assignment", path: "/Postulaciones" },
        { label: "Cargos", icon: "work", path: "/Cargos" },
      ],
    });
  }

  return (
    <aside style={styles.navbarContainer}>
      <button style={styles.toggleButton} onClick={toggleCollapse}>
        <span className="material-icons">{isCollapsed ? "menu_open" : "menu"}</span>
      </button>
      <div style={styles.header}>{isCollapsed ? "G+" : "GestorPlus"}</div>

      <nav>
        {menuItems.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              style={{
                ...styles.menuItem,
                ...(isMenuItemActive(item) ? styles.menuItemActive : {}),
              }}
              title={isCollapsed ? item.label : ""}
              onClick={() => {
                if (item.subMenu) {
                  handleDoubleClick(index);
                } else {
                  handleClick(item, index);
                }
              }}
            >
              <span className="material-icons" style={styles.icon}>
                {item.icon}
              </span>
              <span style={styles.text}>{item.label}</span>
              {item.subMenu && !isCollapsed && (
                <span className="material-icons" style={{ marginLeft: "auto" }}>
                  {openSubMenu === index ? "expand_less" : "expand_more"}
                </span>
              )}
            </div>

            {/* Submenú normal (expandido) */}
            {item.subMenu && openSubMenu === index && !isCollapsed && (
              <div style={styles.subMenu}>
                {item.subMenu.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    style={styles.subMenuItem}
                    onClick={() => navigate(sub.path)}
                  >
                    <span className="material-icons" style={styles.icon}>
                      {sub.icon}
                    </span>
                    <span style={styles.text}>{sub.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 🔧 Submenú flotante cuando navbar está colapsado */}
            {item.subMenu && isCollapsed && hoveredIndex === index && (
              <div style={{ ...styles.floatingSubMenu, top: index * 60 + 80 }}>
                {item.subMenu.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    style={styles.subMenuItem}
                    onClick={() => navigate(sub.path)}
                  >
                    <span className="material-icons" style={styles.icon}>
                      {sub.icon}
                    </span>
                    <span>{sub.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={styles.logout} onClick={handleLogout}>
          <span className="material-icons" style={styles.icon}>exit_to_app</span>
          <span style={styles.text}>Cerrar sesión</span>
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
