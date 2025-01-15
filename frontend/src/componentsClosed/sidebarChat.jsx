import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SidebarChat = ({ onUserSelect }) => {
  const [usuariosRRHH, setUsuariosRRHH] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [rol, setRol] = useState(null);

  const handleUserClick = (targetNum_doc) => {
    onUserSelect(targetNum_doc);
  };

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        let action = ""; 

        switch (Rol) {
          case "1":
            action = "obtenerUsuarios";
            break;
          case "2":
            action = "obtenerUsuarios";
            break;
          case "3":
            action = "obtenerRRHH";
            break;
          default:
            console.error("Rol no válido");
            setErrorMessage("Rol no reconocido.");
            return;
        }

        if (!action) return;

  
        axios
          .get("http://localhost/gestorplus/backend/", {
            params: { action },
          })
          .then((response) => {
            const rrhhData = response.data.RRHH;
            console.log(response.data);
            if (Array.isArray(rrhhData)) {
              setUsuariosRRHH(rrhhData);
            } else {
              console.error("La respuesta no contiene un arreglo válido:", response.data);
              setErrorMessage("Error al obtener los usuarios.");
            }
          })
          .catch((error) => {
            console.error("Error al obtener los usuarios:", error);
            setErrorMessage("Error al obtener los usuarios.");
          });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setErrorMessage("Token inválido o malformado.");
      }
    } else {
      console.error("No se encontró el token en las cookies.");
      setErrorMessage("Token no encontrado.");
    }
  }, []); 

  return (
    <div
      style={{
        background: "#fff",
        width: "400px",
        maxWidth: "400px",
        height: "400px",
        marginTop: "3rem",
        borderRadius: "16px",
        boxShadow: "0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5)",
        marginRight: "40px",
        padding: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
        }}
      >
        Usuarios Activos
      </h3>

      {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {usuariosRRHH.length > 0 ? (
          usuariosRRHH.map((usuario) => (
            <div
              key={usuario.num_doc}
              style={{
                background: "#f9f9f9",
                padding: "10px 15px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => handleUserClick(usuario.num_doc)}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginRight: "15px",
                  fontSize: "18px",
                }}
              >
                {usuario.nombres.charAt(0)}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                  {usuario.nombres}
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>{usuario.nombreRol}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>No hay usuarios disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarChat;
