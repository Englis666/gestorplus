import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const NavbarClosed = ({ numDoc, activeLink }) => {
  const { user , logout } = useUser();
  const navigate = useNavigate();
  
  const handleLogout = () =>{
    logout();
    navigate('/')
  }
  console.log(user);

  return (
    <aside className="col-12 col-md-3 col-lg-2">
      <div className="top d-none d-md-block">
        <div className="logo text-center">
        </div>
      </div>
      <nav
        className="d-md-block"
        id="menuLateral"
        style={{
          backgroundColor: "white",
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)", 
          height: "100vh",
          borderTopRightRadius: "1rem", 
          borderBottomRightRadius: "1rem",
          padding: "20px 0", 
        }}
      >
        <h1
          className="text-primary text-center"
          style={{
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#2980b9", 
            marginBottom: "2rem",
          }}
        >
          Gestorplus
        </h1>

        {/* Enlace "Jornadas" */}
        <div
          className={`d-flex align-items-center p-3 mt-5 text-dark text-decoration-none ${
            activeLink === "jornadas" ? "bg-light" : "hover-bg"
          }`}
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", 
            borderRadius: "0.5rem", 
          }}
        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem",
              color: "#3498db", 
            }}
          >
            insights
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem",
              fontWeight: "500", // Peso de fuente medio
              color: "#333",
            }}
            onClick={() => navigate('/empleado/Jornadas')}
          >
            Jornadas
          </h3>
        </div>

        {/* Enlace "Ausencias" */}
        <div
          className={`d-flex align-items-center p-3 text-dark text-decoration-none ${
            activeLink === "ausencias" ? "bg-light" : "hover-bg"
          }`}
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", // Transición suave
            borderRadius: "0.5rem", 
          }}
          onClick={() => navigate('/empleado/Ausencias')}
        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem", 
              color: "#3498db", 
            }}
          >
            receipt_long
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem", 
              fontWeight: "500",
              color: "#333", 
            }}
          >
            Ausencias
          </h3>
        </div>

        {/* Enlace "Paz y salvos" */}
        <div
          className={`d-flex align-items-center p-3 text-dark text-decoration-none ${
            activeLink === "pazysalvos" ? "bg-light" : "hover-bg"
          }`}
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", 
            borderRadius: "0.5rem", 
          }}
        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem", 
              color: "#3498db", 
            }}
          >
            receipt_long
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem", 
              fontWeight: "500",
              color: "#333", 
            }}
          >
            Paz y salvos
          </h3>
        </div>

        {/* Enlace "Quejas y reclamos" */}
        <div
          className={`d-flex align-items-center p-3 text-dark text-decoration-none ${
            activeLink === "quejas" ? "bg-light" : "hover-bg"
          }`}
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
            borderRadius: "0.5rem", 
          }}
          onClick={() => navigate('/empleado/Quejas')}
        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem", 
              color: "#3498db", 
            }}
          >
            report
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem", 
              fontWeight: "500", 
              color: "#333", 
            }}
          >
            Quejas y reclamos
          </h3>
        </div>

        {/* Enlace "Mi perfil" */}
        <div
          className={`d-flex align-items-center p-3 text-dark text-decoration-none ${
            activeLink === "perfil" ? "bg-light" : "hover-bg"
          }`}
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", 
            borderRadius: "0.5rem", 
          }}
        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem", 
              color: "#3498db", 
            }}
          >
            settings
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem", 
              fontWeight: "500", 
              color: "#333", 
            }}
          >
            Mi perfil
          </h3>
        </div>

        {/* Enlace "Cerrar sesión" */}
        <div
          className="d-flex align-items-center p-3 text-dark text-decoration-none"
          style={{
            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out", 
            borderRadius: "0.5rem", 
          }}
          onClick={handleLogout}

        >
          <span
            className="material-icons me-2"
            style={{
              fontSize: "1.5rem", // Iconos más grandes y visibles
              color: "#e74c3c", 
            }}
          >
            logout
          </span>
          <h3
            className="m-0"
            style={{
              fontSize: "1.2rem", 
              fontWeight: "500", 
              color: "#e74c3c", 
            }}
          >
            Cerrar sesión
          </h3>
        </div>
      </nav>
    </aside>
  );
};

export default NavbarClosed;
