import React, { useEffect, useState } from "react";

const Chat = ({ selectedChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8082");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.idChat === selectedChat) {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => ws.close();
  }, [selectedChat]);

  return (
    <div className="chat-container">
      {chatMessages.length === 0 ? (
        <p>No hay mensajes</p>
      ) : (
        chatMessages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.from}</strong>: {msg.message}
          </div>
        ))
      )}
    </div>
  );
};

export default Chat;
