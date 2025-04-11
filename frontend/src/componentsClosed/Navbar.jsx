import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/Gestorplus.png";

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
      if (decodedToken?.exp * 1000 < Date.now()) return;
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
    if (item.subMenu) return item.subMenu.some((sub) => sub.path === activeLink);
    return false;
  };

  const styles = {
    navbar: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: isCollapsed ? "80px" : "260px",
      background: "linear-gradient(to bottom, #ffffff, #eaf4ff)",
      transition: "width 0.3s ease",
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      overflowY: "auto",
      position: "relative",
    },
    toggleBtn: {
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "1.8rem",
      margin: "1rem",
      alignSelf: "flex-end",
    },
    logoContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem 0",
      gap: "0.5rem",
      transition: "all 0.3s ease",
    },
    logoImage: {
      height: isCollapsed ? "140px" : "180px", // más grande
      width: isCollapsed ? "140px" : "180px",
      borderRadius: "16px",
      objectFit: "contain",
      transition: "all 0.3s ease",
    },
    logoText: {
      fontSize: isCollapsed ? "1rem" : "1.4rem",
      fontWeight: "bold",
      color: "#3498db",
      textAlign: "center",
      transition: "all 0.3s ease",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      cursor: "pointer",
      transition: "0.2s",
      color: "#2c3e50",
    },
    activeMenu: {
      background: "#dff0ff",
      borderLeft: "4px solid #3498db",
      color: "#3498db",
    },
    subMenu: {
      maxHeight: "300px",
      paddingLeft: isCollapsed ? "1.5rem" : "2.8rem",
      transition: "max-height 0.3s ease",
    },
    subItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      color: "#5d6d7e",
      borderRadius: "6px",
    },
    floatingMenu: {
      position: "absolute",
      left: "80px",
      background: "#fff",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      padding: "0.5rem",
      zIndex: 100,
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
      subMenu: [{ label: "Vacaciones", icon: "flight", path: "/Vacaciones" }],
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
    <aside style={styles.navbar}>
      <button style={styles.toggleBtn} onClick={toggleCollapse}>
        <span className="material-icons">{isCollapsed ? "menu_open" : "menu"}</span>
      </button>

      <div style={styles.logoContainer}>
        <img src={logo} alt="GestorPlus Logo" style={styles.logoImage} />
        <span style={styles.logoText}>Gestorplus</span>
      </div>

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
                ...(isMenuItemActive(item) ? styles.activeMenu : {}),
              }}
              title={isCollapsed ? item.label : ""}
              onClick={() =>
                item.subMenu ? handleDoubleClick(index) : handleClick(item)
              }
            >
              <span className="material-icons">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
              {item.subMenu && !isCollapsed && (
                <span className="material-icons" style={{ marginLeft: "auto" }}>
                  {openSubMenu === index ? "expand_less" : "expand_more"}
                </span>
              )}
            </div>

            {/* Submenú normal (expandido) */}
            {item.subMenu && openSubMenu === index && !isCollapsed && (
              <div style={styles.subMenu}>
                {item.subMenu.map((sub, i) => (
                  <div
                    key={i}
                    style={styles.subItem}
                    onClick={() => navigate(sub.path)}
                  >
                    <span className="material-icons">{sub.icon}</span>
                    <span>{sub.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submenú flotante en colapsado */}
            {item.subMenu && isCollapsed && hoveredIndex === index && (
              <div style={{ ...styles.floatingMenu, top: index * 60 + 80 }}>
                {item.subMenu.map((sub, i) => (
                  <div
                    key={i}
                    style={styles.subItem}
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

        <div style={styles.logout} onClick={handleLogout}>
          <span className="material-icons">exit_to_app</span>
          {!isCollapsed && <span>Cerrar sesión</span>}
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
 