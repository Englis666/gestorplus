/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useState } from "react";
import ChatContainer from "../componentsClosed/ChatContainer";
import SidebarChat from "../componentsClosed/sidebarChat";
import NavbarClosed from "../componentsClosed/Navbar";

const Quejas = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

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
                <ChatContainer selectedChat={{ idChat: selectedChatId }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quejas;
