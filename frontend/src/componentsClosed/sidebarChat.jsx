import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SidebarChat = ({ onChatSelect }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);
  const [socket, setSocket] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const handleError = (message) => {
    console.error(message);
    setErrorMessage(message);
  };

  const fetchUsuarios = useCallback(async (action) => {
    try {
      const { data } = await axios.get("http://localhost/gestorplus/backend/", {
        params: { action },
      });

      if (data?.RRHH && Array.isArray(data.RRHH)) {
        setUsuarios(data.RRHH);
      } else {
        handleError("Error al obtener los usuarios.");
      }
    } catch (error) {
      handleError("Error al obtener los usuarios.");
    }
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
        const rol = decoded?.data?.rol;
        const action = rol === "3" ? "obtenerRRHH" : "obtenerUsuarios";
        fetchUsuarios(action);
      } catch {
        handleError("Token inválido.");
      }
    } else {
      handleError("Token no encontrado.");
    }
  }, [fetchUsuarios]);

  // Configurar WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8082");

    ws.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.usuarios && Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        }
      } catch (error) {
        console.error("Error al procesar datos de WebSocket:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("Error en WebSocket:", error);
      fetchUsuarios(decodedToken?.data?.rol === "3" ? "obtenerRRHH" : "obtenerUsuarios");
    };

    ws.onclose = () => {
      console.log("Desconectado del WebSocket");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [fetchUsuarios, decodedToken]);

  const handleChatSelection = async (num_doc_receptor) => {
    try {
      if (!decodedToken) {
        handleError("No se pudo obtener el ID del usuario.");
        return;
      }

      const num_doc_emisor = decodedToken?.data?.num_doc;
      if (!num_doc_emisor) {
        handleError("No se pudo obtener el ID del usuario.");
        return;
      }

      const { data } = await axios.post("http://localhost/gestorplus/backend/", {
        action: "obtenerOcrearChat",
        num_doc_emisor,
        num_doc_receptor,
      });
      console.log(data);
      if (data.status === "success") {
        onChatSelect(data.idChat);
      } else {
        handleError("Error al obtener o crear el chat.");
      }
    } catch (error) {
      handleError("Error al gestionar el chat.");
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
