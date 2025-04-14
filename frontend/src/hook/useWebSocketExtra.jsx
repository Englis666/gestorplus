import useWebSocket from "./useWebSocket";

const useWebSocketHorasExtra = () => {
  const {
    ws,
    mensajeEstado,
    error,
    sendMessage,
    ultimoMensaje,
  } = useWebSocket("ws://localhost:8082");

  const calcularHoras = () => {
    sendMessage({ action: "calcularHorasExtra" });
  };

  return {
    ws,
    mensajeEstado,
    error,
    calcularHoras,
    datosHorasExtra: ultimoMensaje?.calculo || [],
  };
};

export default useWebSocketHorasExtra;
