import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const NavbarClosed = ({ activeLink }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const styles = {
    navbarContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#fdfdfd",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      width: isCollapsed ? "80px" : "240px",
      transition: "width 0.3s ease-in-out",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1rem",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "600",
      color: "#3498db", 
      padding: "1rem",
      borderRadius: "10px",
      margin: "1rem",
      textAlign: "center",
    },
    toggleButton: {
      border: "none",
      background: "none",
      cursor: "pointer",
      margin: "0 auto",
      marginRight: "18rem",
      fontSize: "1.5rem",
    },
    menu: {
      display: "flex",
      flexDirection: "column",
      marginTop: "1rem",
      flexGrow: 1, 
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      transition: "background 0.3s ease, color 0.3s ease",
      cursor: "pointer",
    },
    menuItemHover: {
      background: "#f0f8ff",
    },
    menuItemActive: {
      background: "#eaf6ff",
      borderLeft: "4px solid #3498db",
    },
    icon: {
      fontSize: "1.8rem",
      color: "#3498db",
      marginRight: isCollapsed ? "0" : "1rem",
    },
    text: {
      fontSize: "1.2rem",
      fontWeight: "500",
      color: "#black",
      display: isCollapsed ? "none" : "block",
    },
    logout: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start", 
      padding: "1rem",
      cursor: "pointer",
      color: "#e74c3c",
      transition: "background 0.3s ease",
    },
    logoutHover: {
      background: "#ffecec",
    },
  };

  const menuItems = [
    { label: "Inicio", icon: "home", path: "/empleado/inicioEmpleado" },
    { label: "Jornadas", icon: "event", path: "/empleado/Jornadas" },
    { label: "Ausencias", icon: "hourglass_empty", path: "/empleado/Ausencias" },
    { label: "Paz y salvos", icon: "check_circle", path: "/empleado/Paz" },
    { label: "Quejas", icon: "report_problem", path: "/empleado/Quejas" },
    { label: "Mi perfil", icon: "person", path: "/Perfil" },
  ];

  return (
    <aside style={styles.navbarContainer}>
      <button style={styles.toggleButton} onClick={toggleCollapse}>
          <span className="material-icons">
            {isCollapsed ? "menu_open" : "menu"}
          </span>
        </button>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{isCollapsed ? "G+" : "Gestorplus"}</h1> 
        
      </div>

      {/* Navigation */}
      <nav style={styles.menu}>
        {menuItems.map((item) => (
          <div
            key={item.label}
            style={{
              ...styles.menuItem,
              ...(activeLink === item.path ? styles.menuItemActive : {}),
            }}
            onClick={() => navigate(item.path)}
          >
            <span
              className="material-icons"
              style={styles.icon}
            >
              {item.icon}
            </span>
            <span style={styles.text}>{item.label}</span>
          </div>
        ))}

        {/* Logout */}
        <div
          style={styles.logout}
          onClick={handleLogout}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ffecec")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span className="material-icons" style={styles.icon}>
            exit_to_app {/* Icono mejorado */}
          </span>
          <span style={styles.text}>Cerrar sesión</span>
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
