import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "../componentsClosed/Chat";
import SidebarChat from "../componentsClosed/sidebarChat";

const Quejas = () => {
  const [message, setMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    e.preventDefault();

  };

  return (
    <div className="container-fluid vh-100 d-flex p-3 bg-light">
      <div className="row flex-grow-1 w-100">
        <div className="col-md-3 bg-white border-end p-3">
          <SidebarChat onChatSelect={setSelectedChatId} />
        </div>

        <div className="col-md-9 d-flex flex-column bg-white shadow rounded p-3">
          <header className="d-flex align-items-center border-bottom pb-2 mb-3">
            <h5 className="m-0">{selectedChatId ? `Chat ID: ${selectedChatId}` : "Selecciona un usuario"}</h5>
          </header>

          <div className="flex-grow-1 overflow-auto">
            <Chat selectedChat={selectedChatId} />
          </div>

          <form className="d-flex mt-3" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="form-control me-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              disabled={!selectedChatId}
            />
            <button type="submit" className="btn btn-primary" disabled={!selectedChatId || !message.trim()}>
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Quejas;
