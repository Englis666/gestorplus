import { useEffect, useState } from "react";

const useWebSocket = (url) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(url);
        setSocket(ws);

        ws.onopen = () => console.log("WebSocket conectado 🚀");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
            console.log("Mensaje recibido:", data);
        };

        ws.onclose = () => console.log("WebSocket desconectado ❌");

        return () => ws.close();
    }, [url]);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket no está listo para enviar mensajes");
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
