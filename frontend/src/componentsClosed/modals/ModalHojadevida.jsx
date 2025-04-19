import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-design-icons/iconfont/material-icons.css";
import "animate.css";

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
      if (!token) return alert("No se encontró el token de autenticación.");

      const { data } = await axios.get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "datosPerfil", num_doc },
      });

      setFormData({
        fechaNacimiento: data.fechaNacimiento ?? "",
        direccion: data.direccion ?? "",
        ciudad: data.ciudad ?? "",
        ciudadNacimiento: data.ciudadNacimiento ?? "",
        telefono: data.telefono ?? "",
        telefonoFijo: data.telefonoFijo ?? "",
        estadohojadevida: "Activa",
      });
    } catch (error) {
      console.error("Error al obtener hoja de vida:", error);
      alert("Error al cargar los datos.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ["fechaNacimiento", "direccion", "ciudad", "ciudadNacimiento", "telefono"];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
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

    const formDataToSend = {
      ...formData,
      telefonoFijo: formData.telefonoFijo === "" ? null : formData.telefonoFijo,
    };

    try {
      const token = getCookie("auth_token");
      if (!token) return alert("No se encontró el token de autenticación.");

      const response = await axios.patch(
        "http://localhost/gestorplus/backend/",
        { ...formDataToSend, action: "actualizacionHojaDevida", num_doc },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Hoja de vida actualizada") {
        alert("Hoja de vida actualizada correctamente");
        toggleModalHojaDeVida(); // Cerrar el modal después de la actualización exitosa
      } else {
        alert("Error al actualizar la hoja de vida.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error.message);
      alert("Error del servidor: " + (error.response?.data?.message || "Inténtalo nuevamente."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal fade ${modalHojaDeVida ? "show d-block animate__animated animate__fadeInDown" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalHojaDeVidaLabel"
      aria-hidden={!modalHojaDeVida}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="material-icons">badge</span> Hoja de Vida
              </h5>
              <button type="button" className="btn-close" onClick={toggleModalHojaDeVida} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {[
                  { label: "Fecha de nacimiento", name: "fechaNacimiento", type: "date" },
                  { label: "Dirección", name: "direccion" },
                  { label: "Ciudad de residencia", name: "ciudad" },
                  { label: "Ciudad de nacimiento", name: "ciudadNacimiento" },
                  { label: "Teléfono móvil", name: "telefono" },
                  { label: "Teléfono fijo", name: "telefonoFijo" },
                ].map(({ label, name, type = "text" }) => (
                  <div className="col-md-6" key={name}>
                    <label htmlFor={name} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type={type}
                      className="form-control"
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required={name !== "telefonoFijo"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={toggleModalHojaDeVida} disabled={isSubmitting}>
                Cerrar
              </button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" /> Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-icons me-1">save</span> Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalHojaDeVida;