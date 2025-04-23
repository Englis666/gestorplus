import { useEffect, useRef, useState, useCallback } from "react";

const useWebSocket = (url) => {
  const ws = useRef(null);
  const [mensajeEstado, setMensajeEstado] = useState(null);
  const [ultimoMensaje, setUltimoMensaje] = useState(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setMensajeEstado("Gestorplus En Linea");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setUltimoMensaje(data);
      } catch (e) {
        console.error("❌ Error al parsear mensaje:", e);
      }
    };

    ws.current.onerror = (error) => {
      setMensajeEstado("Error de conexión WebSocket");
      console.error("WebSocket Error:", error);
    };

    ws.current.onclose = () => {
      setMensajeEstado("Gestorplus Fuera De Linea");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((mensaje) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(mensaje));
    } else {
      console.warn("WebSocket no está listo para enviar mensajes.");
    }
  }, []);

  return {
    mensajeEstado,
    ultimoMensaje,
    sendMessage,
  };
};

export default useWebSocket;
