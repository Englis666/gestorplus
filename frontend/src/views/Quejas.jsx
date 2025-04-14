import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../componentsClosed/ChatContainer";
import SidebarChat from "../componentsClosed/sidebarChat";
import { jwtDecode } from "jwt-decode";
import NavbarClosed from "../componentsClosed/Navbar";

const Quejas = () => {
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

    socket.current = new WebSocket("ws://localhost:8082");


    return () => {
      socket.current?.close();
    };
  }, [navigate, token]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <NavbarClosed />
      <div
        className="container shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "1200px", height: "85vh", backgroundColor: "#fff" }}
      >
        <div className="row h-100 g-0">
          <div className="col-md-4 bg-white border-end p-4 d-flex flex-column">
            <h5 className="fw-bold text-primary mb-4">Chats</h5>
            <SidebarChat onChatSelect={setSelectedChatId} />
          </div>
          <div className="col-md-8 d-flex flex-column">
            <div className="bg-primary text-white px-4 py-3">
              <h6 className="mb-0">
                {selectedChatId
                  ? `Conversación ID: ${selectedChatId}`
                  : "Selecciona un chat"}
              </h6>
            </div>
            <div
              className="flex-grow-1 overflow-auto px-4 py-3"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {selectedChatId && (
                <ChatContainer
                  selectedChat={{ idChat: selectedChatId }}
                  socket={socket}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quejas;