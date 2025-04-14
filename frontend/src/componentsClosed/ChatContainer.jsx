import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { jwtDecode } from "jwt-decode";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ChatContainer = ({ selectedChat, socket }) => {
  const [mensajes, setMensajes] = useState([]);
  const [message, setMessage] = useState("");
  const [numDocUsuario, setNumDocUsuario] = useState(null);

  // Extraer el número de documento del token
  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) return;
    try {
      const decodedToken = jwtDecode(token);
      setNumDocUsuario(decodedToken.data.num_doc);
    } catch (error) {
      console.error("Error decodificando el token", error);
    }
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");

    // Enviar solicitud para obtener mensajes del chat seleccionado
    if (
      selectedChat &&
      socket.current &&
      socket.current.readyState === WebSocket.OPEN
    ) {
      socket.current.send(
        JSON.stringify({
          action: "obtenerMensajes",
          method: "GET",
          idChat: selectedChat.idChat,
          token: token,
        })
      );
    }

    const handleMessage = (event) => {
      console.log("🔴 Mensaje crudo del WebSocket:", event.data);

      try {
        const data = JSON.parse(event.data);

        // Si recibes muchos mensajes
        if (Array.isArray(data.mensajes)) {
          setMensajes(data.mensajes);
        }

        // Si recibes un solo mensaje nuevo
        else if (data.mensaje) {
          setMensajes((prev) => [...prev, data.mensaje]);
        }
      } catch (e) {
        console.error(
          "❌ Error al parsear el mensaje recibido:",
          e,
          "\nContenido recibido:",
          event.data
        );
      }
    };

    if (socket.current) {
      socket.current.addEventListener("message", handleMessage);
    }

    return () => {
      if (socket.current) {
        socket.current.removeEventListener("message", handleMessage);
      }
    };
  }, [selectedChat]);


  // Enviar un mensaje nuevo
  const handleSendMessage = (e) => {
    e.preventDefault();
    const token = getCookie("auth_token");

    if (!message.trim() || !selectedChat?.idChat || !socket.current) return;

    if (socket.current.readyState !== WebSocket.OPEN) {
      console.error("El WebSocket no está abierto.");
      return;
    }

    const payload = {
      action: "enviarMensaje",
      idChat: selectedChat.idChat,
      mensaje: message,
      token: token,
    };

    socket.current.send(JSON.stringify(payload));
    setMessage("");
  };

  return (
    <>
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