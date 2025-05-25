/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../../config";

const SidebarChat = ({ onChatSelect }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);

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
      const { data } = await axios.get(API_URL, {
        params: { action },
      });

      console.log(data);
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

  const handleChatSelection = async (num_doc_receptor) => {
    try {
      if (!decodedToken)
        return handleError("No se pudo obtener el ID del usuario.");
      const num_doc_emisor = decodedToken?.data?.num_doc;
      if (!num_doc_emisor)
        return handleError("No se pudo obtener el ID del usuario.");

      const { data } = await axios.post(API_URL, {
        action: "obtenerOcrearChat",
        num_doc_emisor,
        num_doc_receptor,
      });

      if (data.status === "success") {
        onChatSelect(data.idChat);
      } else {
        handleError("Error al obtener o crear el chat.");
      }
    } catch {
      handleError("Error al gestionar el chat.");
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-3">
        <h5 className="fw-bold text-primary">Usuarios Activos</h5>
        <input
          type="text"
          className="form-control rounded-pill shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar empleado..."
        />
        {errorMessage && (
          <div className="alert alert-danger mt-2 py-2 px-3">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex-grow-1 overflow-auto">
        <div className="list-group rounded-4">
          {usuarios
            .filter((u) =>
              u.nombres.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((usuario) => (
              <button
                key={usuario.num_doc}
                className="list-group-item list-group-item-action d-flex flex-column align-items-start rounded-3 mb-2 shadow-sm"
                onClick={() => handleChatSelection(usuario.num_doc)}
              >
                <strong>{usuario.nombres}</strong>
                <small className="text-muted">{usuario.nombreRol}</small>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarChat;
