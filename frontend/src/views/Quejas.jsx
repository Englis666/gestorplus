import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "../componentsClosed/Chat";
import SidebarChat from "../componentsClosed/sidebarChat";
import { jwtDecode } from "jwt-decode";

const Quejas = () => {
  const [mensajes, setMensajes] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const socket = useRef(null);
  const navigate = useNavigate();

  // Leer cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("auth_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

    if (isTokenExpired) {
      navigate("/login");
      return;
    }

    // Conectar WebSocket
    socket.current = new WebSocket("ws://localhost:8082");

    socket.current.onopen = () => {
      console.log("WebSocket conectado");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje recibido:", data);
      } catch (e) {
        console.error("No es un JSON válido:", event.data);
      }
    };


    return () => {
      socket.current?.close();
    };
  }, [selectedChatId, token, navigate]);

  useEffect(() => {
    const chatContent = document.querySelector(".flex-grow-1.overflow-auto");
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [mensajes]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedChatId || !socket.current) return;

    const payload = {
      action: "enviarMensaje",
      idChat: selectedChatId,
      mensaje: message,
      token: token,
    };

    socket.current.send(JSON.stringify(payload));
    setMessage("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="container shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "1200px", height: "85vh", backgroundColor: "#fff" }}
      >
        <div className="row h-100 g-0">
          {/* Sidebar */}
          <div className="col-md-4 bg-white border-end p-4 d-flex flex-column">
            <h5 className="fw-bold text-primary mb-4">Chats</h5>
            <SidebarChat onChatSelect={setSelectedChatId} />
          </div>

          {/* Chat Panel */}
          <div className="col-md-8 d-flex flex-column">
            {/* Header */}
            <div className="bg-primary text-white px-4 py-3">
              <h6 className="mb-0">
                {selectedChatId
                  ? `Conversación ID: ${selectedChatId}`
                  : "Selecciona un chat"}
              </h6>
            </div>

            {/* Chat Content */}
            <div
              className="flex-grow-1 overflow-auto px-4 py-3"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <Chat selectedChat={selectedChatId} mensajes={mensajes} />
            </div>

            {/* Input */}
            <form
              className="d-flex align-items-center gap-3 px-4 py-3 border-top"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                className="form-control rounded-pill px-4 py-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                disabled={!selectedChatId}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
                disabled={!selectedChatId || !message.trim()}
                title="Enviar"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quejas;
