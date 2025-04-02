import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { jwtDecode } from "jwt-decode";

const NavbarClosed = ({ activeLink }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rol, setRol] = useState(null);
  const [error, setError] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // Bandera de montaje

  useEffect(() => {
    setIsMounted(true); // Marcar como montado
    return () => {
      setIsMounted(false); // Limpiar cuando se desmonte el componente
    };
  }, []);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró el token en las cookies");
      setError("No se encontró el token en las cookies.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
      if (isTokenExpired) {
        console.error("El token ha expirado");
        setError("El token ha expirado.");
        return;
      }

      const userRole = decodedToken?.data?.rol;
      setRol(userRole);
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      setError("Error al decodificar el token.");
    }
  }, []);

  const handleLogout = () => {
    logout();
    if (isMounted) {
      navigate("/");
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
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
      position: "relative",
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
      color: "#000",
      display: isCollapsed ? "none" : "block",
    },
    subMenu: {
      display: "block",
      paddingLeft: "2rem",
    },
    subMenuItem: {
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      cursor: "pointer",
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
  };

  const menuItems = [
    {
      label: "Jornadas", icon: "event", path: "/Jornadas",
      subMenu: [{ label: "Horas Extra", icon: "timeline", path: "/HorasExtra" }],
    },
    {
      label: "Ausencias", icon: "hourglass_empty", path: "/Ausencias",
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
      label: "Entrevistas", icon: "event_note", path: "/Entrevistas",
      subMenu: [
        {
          label: "Sistema de Gestion",
          icon: "work",
          path: "/SistemaDeGestion",
        }
      ]
    });
    menuItems.push({
      label: "Convocatorias",
      icon: "people",
      path: "/Convocatorias",
      subMenu: [
        {
          label: "Postulaciones",
          icon: "assignment",
          path: "/Postulaciones",
        },
        {
          label: "Cargos",
          icon: "work",
          path: "/Cargos",
        },
      ],
    });
  }

  return (
    <aside style={styles.navbarContainer}>
      <button style={styles.toggleButton} onClick={toggleCollapse}>
        <span className="material-icons">
          {isCollapsed ? "menu_open" : "menu"}
        </span>
      </button>
      <div style={styles.header}>
        <h1 style={styles.title}>{isCollapsed ? "G+" : "Gestorplus"}</h1>
      </div>
      <nav style={styles.menu}>
        {menuItems.map((item, index) => (
          <div key={item.label}>
            <div
              style={{
                ...styles.menuItem,
                ...(activeLink === item.path ? styles.menuItemActive : {}),
              }}
              onClick={() => {
                navigate(item.path);
                if (item.subMenu) {
                  toggleSubMenu(index);
                }
              }}
            >
              <span className="material-icons" style={styles.icon}>
                {item.icon}
              </span>
              <span style={styles.text}>{item.label}</span>
            </div>
            {item.subMenu && openSubMenu === index && (
              <div style={styles.subMenu}>
                {item.subMenu.map((subItem) => (
                  <div
                    key={subItem.label}
                    style={styles.subMenuItem}
                    onClick={() => navigate(subItem.path)}
                  >
                    <span className="material-icons" style={styles.icon}>
                      {subItem.icon}
                    </span>
                    <span style={styles.text}>{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={styles.logout} onClick={handleLogout}>
          <span className="material-icons" style={styles.icon}>
            exit_to_app
          </span>
          <span style={styles.text}>Cerrar sesión</span>
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
