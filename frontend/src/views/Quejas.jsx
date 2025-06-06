/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

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
  }, [navigate, token]);

  return (
    <div className="main-layout">
      <NavbarClosed />
      <div
        className="main-content container-fluid d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="row w-100 h-100 g-0"
          style={{
            maxWidth: "1200px",
            height: "85vh",
            backgroundColor: "#fff",
            boxShadow: "0 0 24px rgba(0,0,0,0.08)",
            borderRadius: "1.5rem",
            overflow: "hidden",
          }}
        >
          <div className="col-md-4 bg-white border-end p-4 d-flex flex-column">
            <h5 className="fw-bold text-primary mb-4">Chats</h5>
            <SidebarChat onChatSelect={setSelectedChatId} />
          </div>
          <div className="col-md-8 d-flex flex-column">
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
