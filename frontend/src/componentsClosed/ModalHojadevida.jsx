import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalHojaDeVida = ({ modalHojaDeVida, toggleModalHojaDeVida, num_doc }) => {
  const [formData, setFormData] = useState({
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
    ciudadNacimiento: "",
    telefono: "",
    telefonoFijo: "",
    estadohojadevida: "Activa",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalHojaDeVida) {
      fetchHojaDeVida();
    }
  }, [modalHojaDeVida]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const fetchHojaDeVida = async () => {
    try {
      const token = getCookie("auth_token");
      if (!token) {
        alert("No se encontró el token de autenticación.");
        return;
      }

      const response = await axios.get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "datosPerfil", num_doc },
      });

      console.log("Datos recibidos:", response.data);

      setFormData({
        fechaNacimiento: response.data.fechaNacimiento ?? "",
        direccion: response.data.direccion ?? "",
        ciudad: response.data.ciudad ?? "",
        ciudadNacimiento: response.data.ciudadNacimiento ?? "",
        telefono: response.data.telefono ?? "",
        telefonoFijo: response.data.telefonoFijo ?? "",

      });
    } catch (error) {
      console.error("Error al obtener la hoja de vida:", error);
      alert("Ocurrió un error al cargar los datos.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ["fechaNacimiento", "direccion", "ciudad", "ciudadNacimiento", "telefono"];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert(`El campo ${field} es obligatorio.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const token = getCookie("auth_token");
      if (!token) {
        alert("No se encontró el token de autenticación.");
        setIsSubmitting(false);
        return;
      }

      console.log("Datos enviados:", formData);

      const response = await axios.patch(
        "http://localhost/gestorplus/backend/",
        { ...formData, action: "actualizacionHojaDevida", num_doc },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      if (response.data.message === "Hoja de vida actualizada") {
        alert("Hoja de vida actualizada correctamente");
      } else {
        alert("Hubo un error al actualizar la hoja de vida.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error.message);
      alert("Error del servidor: " + (error.response?.data?.message || "Inténtalo nuevamente."));
    } finally {
      setIsSubmitting(false);
      toggleModalHojaDeVida();
    }
  };

  return (
    <div className={`modal fade ${modalHojaDeVida ? "show" : ""}`} style={{ display: modalHojaDeVida ? "block" : "none" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Actualizar Hoja de Vida</h5>
              <button type="button" className="btn-close" onClick={toggleModalHojaDeVida}></button>
            </div>
            <div className="modal-body">
              {Object.keys(formData).map((field, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={field} className="form-label">
                    {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </label>
                  <input
                    type={field === "fechaNacimiento" ? "date" : "text"}
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={field !== "telefonoFijo"}
                  />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={toggleModalHojaDeVida} disabled={isSubmitting}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalHojaDeVida;
