import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./css/chat.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ChatContainer = ({ selectedChat }) => {
  const [mensajes, setMensajes] = useState([]);
  const [message, setMessage] = useState("");
  const [numDocUsuario, setNumDocUsuario] = useState(null);
  const bottomRef = useRef(null);

  // Obtener el num_doc del usuario desde el token
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

  // Función para obtener los mensajes
  const fetchMessages = () => {
    const token = getCookie("auth_token");

    if (selectedChat?.idChat && token) {
      axios
        .get("http://localhost/gestorplus/backend/", {
          params: { idChat: selectedChat.idChat, action: "obtenerMensajes" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.status === "success") {
            setMensajes(data.mensajes); // Mensajes ya vienen con usuario_num_doc
          } else {
            setMensajes([]);
          }
        })
        .catch((error) => {
          console.error("Error al cargar mensajes:", error);
        });
    }
  };

  // Cargar mensajes iniciales al cambiar el chat
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 1000); // 3 segundos

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Auto scroll hacia el último mensaje
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  // Enviar un mensaje nuevo
  const handleSendMessage = (e) => {
    e.preventDefault();
    const token = getCookie("auth_token");

    if (!message.trim() || !selectedChat?.idChat) return;

    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          idChat: selectedChat.idChat,
          mensaje: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            action: "enviarMensaje",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          setMensajes((prev) => [
            ...prev,
            {
              mensaje: message,
              usuario_num_doc: numDocUsuario,
              fecha_envio: new Date().toISOString(),
            },
          ]);
          setMessage("");
        } else {
          console.warn("No se pudo enviar el mensaje");
        }
      })
      .catch((error) => {
        console.error("Error al enviar mensaje:", error);
      });
  };

  return (
    <div className="chat-container d-flex flex-column" style={{ height: "80vh" }}>
      {/* Contenedor de mensajes con scroll */}
      <div
        className="message-container flex-grow-1 overflow-auto px-3"
        style={{ scrollBehavior: "smooth" }}
      >
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`message my-2 p-2 rounded-pill ${
              msg.usuario_num_doc === numDocUsuario
                ? "sent-message"
                : "received-message"
            }`}
            style={{ maxWidth: "75%", wordBreak: "break-word" }}
          >
            {msg.mensaje}
            <div className="small text-muted mt-1">
              {new Date(msg.fecha_envio).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Barra de envío de mensaje */}
      <form
        className="send-message-form d-flex align-items-center gap-3 border-top pt-3 px-3 mt-2"
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
    </div>
  );
};

export default ChatContainer;
