import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import { jwtDecode } from "jwt-decode";

// Leer cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ChatContainer = ({ selectedChat }) => {
  const [mensajes, setMensajes] = useState([]);
  const [numDocUsuario, setNumDocUsuario] = useState(null);
  const [cargando, setCargando] = useState(true); // NUEVO
  const socket = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

      if (isTokenExpired) {
        navigate("/login");
        return;
      }

      setNumDocUsuario(decodedToken.data.num_doc);

      // Abrir WebSocket
      socket.current = new WebSocket("ws://localhost:8082");

      socket.current.onopen = () => {
        setCargando(false);
        if (selectedChat) {
          socket.current.send(
            JSON.stringify({
              action: "obtenerMensajes",
              idChat: selectedChat.idChat,
              token: token,
            })
          );
        }
      };

      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.action === "obtenerMensajes" && data.status === "success") {
          setMensajes(data.mensajes);
        }
      };

      return () => {
        socket.current.close();
      };
    } catch (error) {
      console.error("Token inválido", error);
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (selectedChat && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          action: "obtenerMensajes",
          idChat: selectedChat.idChat,
          token: token,
        })
      );
    }
  }, [selectedChat]);

  if (cargando) return <p>Cargando mensajes...</p>;

  return (
    <Chat
      selectedChat={selectedChat}
      mensajes={mensajes}
      numDocUsuario={numDocUsuario}
    />
  );
};

export default ChatContainer;
