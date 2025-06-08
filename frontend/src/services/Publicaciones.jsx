import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerPublicaciones = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.get(
      `${API_URL}obtenerPublicacionPorTipoDeContrato`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Respuesta de obtenerPublicaciones:", response.data);
    if (Array.isArray(response.data.publicaciones)) {
      return response.data.publicaciones;
    } else if (Array.isArray(response.data.Publicaciones)) {
      return response.data.Publicaciones;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    throw new Error("No se pudieron obtener las publicaciones");
  }
};
export const eliminarPublicacion = async (idPublicacion) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.delete(`${API_URL}eliminarPublicacion`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { idPublicacion },
    });
    // Considera éxito si status es success o si no hay error
    if (
      response.data?.status === "success" ||
      response.data?.mensaje ||
      response.status === 200
    ) {
      return { status: "success", ...response.data };
    } else {
      return {
        status: "error",
        message: response.data?.message || "Error al eliminar publicación",
      };
    }
  } catch (error) {
    console.error("Error al eliminar publicación:", error);
    return { status: "error", message: "No se pudo eliminar la publicación" };
  }
};
export const editarPublicacion = async (idPublicacion, data) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no Encontrado");
  try {
    let payload;
    let headers = { Authorization: `Bearer ${token}` };
    // Si hay imagen (File), usar FormData
    if (data.imagen instanceof File) {
      payload = new FormData();
      payload.append("idPublicacion", idPublicacion);
      payload.append("titulo", data.titulo);
      payload.append("descripcion", data.descripcion);
      payload.append("imagen", data.imagen);
      payload.append("fechaPublicacion", data.fechaPublicacion || "");
      payload.append("tipo_contrato", data.tipo_contrato || "");
      payload.append("estado", data.estado || "");
      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = {
        idPublicacion,
        titulo: data.titulo,
        descripcion: data.descripcion,
        imagen: data.imagen || "",
        fechaPublicacion: data.fechaPublicacion || "",
        tipo_contrato: data.tipo_contrato || "",
        estado: data.estado || "",
      };
    }
    const response = await axios.patch(
      `${API_URL}actualizarPublicacion`,
      payload,
      { headers }
    );
    console.log("Respuesta de editarPublicacion:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al editar publicación:", error);
    throw new Error("No se pudo editar la publicación");
  }
};

export const agregarPublicacion = async (formData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no Encontrado");
  try {
    let dataToSend = formData;
    if (!(formData instanceof FormData)) {
      dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value ?? "");
      });
    }
    // Asegura que todos los campos requeridos estén presentes
    if (!dataToSend.has("titulo")) dataToSend.append("titulo", "");
    if (!dataToSend.has("descripcion")) dataToSend.append("descripcion", "");
    if (!dataToSend.has("usuario_num_doc"))
      dataToSend.append("usuario_num_doc", "");
    if (!dataToSend.has("tipo_contrato"))
      dataToSend.append("tipo_contrato", "todos");
    if (!dataToSend.has("estado")) dataToSend.append("estado", "activo");
    // La imagen es opcional

    const response = await axios.post(
      `${API_URL}agregarPublicacion`,
      dataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al agregar publicación:", error);
    throw new Error("No se pudo agregar la publicación");
  }
};
