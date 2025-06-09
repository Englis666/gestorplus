import { toast } from "react-toastify";

export const notificarExito = (mensaje) => toast.success(mensaje);
export const notificarError = (mensaje) => toast.error(mensaje);
export const notificarInfo = (mensaje) => toast.info(mensaje);
export const notificarWarning = (mensaje) => toast.warning(mensaje);
export const confirmarAccion = (mensaje) => window.confirm(mensaje);
