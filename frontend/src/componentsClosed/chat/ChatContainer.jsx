import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { jwtDecode } from "jwt-decode";
import useWebSocket from "../../hook/useWebSocket";

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

  // Decodificar token para obtener el num_doc del usuario
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

  // Hook WebSocket personalizado

  useEffect(() => {
    if (selectedChat?.idChat && token) {
      sendMessage({
        action: "obtenerMensajes",
        method: "GET",
        idChat: selectedChat.idChat,
        token,
      });
    }
  }, [selectedChat, token, sendMessage]);

  // Escuchar cambios en el último mensaje recibido
  useEffect(() => {
    if (ultimoMensaje) {
      console.log("Último mensaje recibido:", ultimoMensaje); // 👀
      if (Array.isArray(ultimoMensaje)) {
        setMensajes(ultimoMensaje);
      } else if (ultimoMensaje?.nuevoMensaje) {
        setMensajes((prev) => [...prev, ultimoMensaje.nuevoMensaje]);
      }
    }
  }, [ultimoMensaje]);
  

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat?.idChat) return;

    sendMessage({
      action: "enviarMensaje",
      idChat: selectedChat.idChat,
      mensaje: message,
      token,
    });

    setMessage("");
  };

  return (
    <>
      <Chat selectedChat={selectedChat} mensajes={mensajes} numDocUsuario={numDocUsuario} />
    
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
