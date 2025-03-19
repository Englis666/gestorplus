import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SidebarChat = ({ onChatSelect }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Función para obtener una cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  // Función para obtener los usuarios
  const fetchUsuarios = async (action) => {
    try {
      const response = await axios.get("http://localhost/gestorplus/backend/", {
        params: { action },
      });

      if (Array.isArray(response.data.RRHH)) {
        setUsuarios(response.data.RRHH);
      } else {
        setErrorMessage("Error al obtener los usuarios.");
      }
    } catch (error) {
      setErrorMessage("Error al obtener los usuarios.");
    }
  };

  useEffect(() => {
    const token = getCookie("auth_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const rol = decodedToken?.data?.rol;
        let action = rol === "3" ? "obtenerRRHH" : "obtenerUsuarios";
        fetchUsuarios(action);
      } catch {
        setErrorMessage("Token inválido.");
      }
    } else {
      setErrorMessage("Token no encontrado.");
    }
  }, []);

  // Función para manejar la selección de un usuario y obtener/crear el chat
  const handleChatSelection = async (num_doc_receptor) => {
    try {
      const token = getCookie("auth_token");
      if (!token) {
        setErrorMessage("Token no encontrado.");
        return;
      }

      // Decodificar el token para obtener el ID del usuario actual
      const decodedToken = jwtDecode(token);
      const num_doc_emisor = decodedToken?.data?.num_doc;

      if (!num_doc_emisor) {
        setErrorMessage("No se pudo obtener el ID del usuario.");
        return;
      }

      // Enviar la petición al backend
      const response = await axios.post(
        "http://localhost/gestorplus/backend/",
        {
          action: "obtenerOcrearChat",
          num_doc_emisor,
          num_doc_receptor,
        }
      );

      if (response.data.status === "success") {
        onChatSelect(response.data.idChat);
      } else {
        setErrorMessage("Error al obtener o crear el chat.");
      }
    } catch (error) {
      setErrorMessage("Error al gestionar el chat.");
    }
  };

  return (
    <div style={{ background: "#fff", width: "100%", maxWidth: "400px", height: "45rem", marginTop: "3rem", borderRadius: "16px", boxShadow: "0 0 128px 0 rgba(0,0,0,0.1)", padding: "20px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>Usuarios Activos</h3>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar empleado"
        style={{ padding: "5px 10px", width: "100%", border: "1px solid #ddd", borderRadius: "20px" }}
      />

      {errorMessage && <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>}

      <div style={{ overflowY: "auto", maxHeight: "calc(100% - 50px)" }}>
        {usuarios
          .filter(usuario => usuario.nombres.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(usuario => (
            <div
              key={usuario.num_doc}
              onClick={() => handleChatSelection(usuario.num_doc)}
              style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ddd" }}
            >
              <strong>{usuario.nombres}</strong> - {usuario.nombreRol}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SidebarChat;
