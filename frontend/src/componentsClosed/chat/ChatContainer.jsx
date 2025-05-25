/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_URL from "../../config";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
};

const ChatContainer = ({ selectedChat }) => {
  const [numDocUsuario, setNumDocUsuario] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const token = getCookie("auth_token");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setNumDocUsuario(decodedToken.data.num_doc);
      } catch (error) {
        setErrorMessage("Error al decodificar el token.");
      }
    } else {
      setErrorMessage("No se pudo encontrar el token de autenticación.");
    }
  }, [token]);

  // Obtener mensajes del chat seleccionado
  useEffect(() => {
    if (selectedChat?.idChat && token) {
      axios
        .post(API_URL, {
          action: "obtenerMensajes",
          idChat: selectedChat.idChat,
          token,
        })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setMensajes(response.data);
          } else if (response.data?.mensajes) {
            setMensajes(response.data.mensajes);
          } else {
            setMensajes([]);
          }
        })
        .catch(() => setErrorMessage("Error al obtener mensajes del chat."));
    }
  }, [selectedChat, token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat?.idChat) return;

    axios
      .post(API_URL, {
        action: "enviarMensaje",
        idChat: selectedChat.idChat,
        mensaje: message,
        token,
      })
      .then((response) => {
        // Puedes actualizar los mensajes localmente o volver a obtenerlos
        setMensajes((prev) => [
          ...prev,
          {
            mensaje: message,
            idChat: selectedChat.idChat,
            num_doc: numDocUsuario,
            fecha: new Date().toISOString(),
          },
        ]);
        setMessage("");
      })
      .catch(() => setErrorMessage("Error al enviar el mensaje."));
  };

  return (
    <>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <Chat
        selectedChat={selectedChat}
        mensajes={mensajes}
        numDocUsuario={numDocUsuario}
      />

      <form
        className="d-flex align-items-center gap-3 mt-3 border-top pt-3"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          className="form-control rounded-pill px-4 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!selectedChat?.idChat}
        />
        <button
          type="submit"
          className="btn btn-primary rounded-pill px-4"
          disabled={!selectedChat?.idChat || !message.trim()}
          title="Enviar"
        >
          <i className="bi bi-send-fill"></i>
        </button>
      </form>
    </>
  );
};

export default ChatContainer;
