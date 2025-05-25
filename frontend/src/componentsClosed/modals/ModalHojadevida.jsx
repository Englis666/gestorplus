/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";

const ModalHojaDeVida = ({
  modalHojaDeVida,
  toggleModalHojaDeVida,
  num_doc,
}) => {
  const [formData, setFormData] = useState({
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
    ciudadNacimiento: "",
    telefono: "",
    telefonoFijo: "",
    estadohojadevida: "Activa",
    estadoCivil: "",
    genero: "",
    habilidades: "",
    portafolio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalHojaDeVida) {
      setFormData({
        fechaNacimiento: "",
        direccion: "",
        ciudad: "",
        ciudadNacimiento: "",
        telefono: "",
        telefonoFijo: "",
        estadohojadevida: "Activa",
        estadoCivil: "",
        genero: "",
        habilidades: "",
        portafolio: "",
      });
      fetchHojaDeVida();
    }
  }, [modalHojaDeVida]);

  // Obtener el token de la cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Cargar los datos de la hoja de vida
  const fetchHojaDeVida = async () => {
    try {
      const token = getCookie("auth_token");
      if (!token) return alert("No se encontró el token de autenticación.");

      const { data } = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "datosPerfil", num_doc },
      });

      if (data.status === "success" && data.data) {
        setFormData({
          fechaNacimiento: data.data.fechaNacimiento ?? "",
          direccion: data.data.direccion ?? "",
          ciudad: data.data.ciudad ?? "",
          ciudadNacimiento: data.data.ciudadNacimiento ?? "",
          telefono: data.data.telefono ?? "",
          telefonoFijo: data.data.telefonoFijo ?? "",
          estadohojadevida: "Activa",
          estadoCivil: data.data.estadoCivil ?? "",
          genero: data.data.genero ?? "",
          habilidades: data.data.habilidades ?? "",
          portafolio: data.data.portafolio ?? "",
        });
      } else {
        alert("No se encontraron datos.");
      }
    } catch (error) {
      console.error("Error al obtener hoja de vida:", error);
      alert("Error al cargar los datos.");
    }
  };

  // Manejo de los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validar el formulario
  const validateForm = () => {
    const requiredFields = [
      "fechaNacimiento",
      "direccion",
      "ciudad",
      "ciudadNacimiento",
      "telefono",
    ];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        alert(`El campo ${field} es obligatorio.`);
        return false;
      }
    }
    return true;
  };

  // Enviar el formulario
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
      console.log(response);
      if (response.data.status === "success") {
        alert("Hoja de vida actualizada correctamente");
        toggleModalHojaDeVida();
      } else {
        alert("Error al actualizar la hoja de vida.");
      }
    } catch (error) {
      console.error(
        "Error al actualizar:",
        error.response?.data || error.message
      );
      alert(
        "Error del servidor: " +
          (error.response?.data?.message || "Inténtalo nuevamente.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`modal fade ${
        modalHojaDeVida
          ? "show d-block animate__animated animate__fadeInDown"
          : ""
      }`}
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
              <button
                type="button"
                className="btn-close"
                onClick={toggleModalHojaDeVida}
              />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {[
                  {
                    label: "Fecha de nacimiento",
                    name: "fechaNacimiento",
                    type: "date",
                  },
                  { label: "Dirección", name: "direccion" },
                  { label: "Ciudad de residencia", name: "ciudad" },
                  { label: "Ciudad de nacimiento", name: "ciudadNacimiento" },
                  { label: "Teléfono móvil", name: "telefono" },
                  { label: "Teléfono fijo", name: "telefonoFijo" },
                  { label: "Estado civil", name: "estadoCivil" },
                  { label: "Género", name: "genero" },
                  { label: "Habilidades", name: "habilidades" },
                  { label: "Portafolio", name: "portafolio" },
                ].map(({ label, name, type = "text" }) => (
                  <div className="col-md-6" key={name}>
                    <label htmlFor={name} className="form-label fw-semibold">
                      {label}
                    </label>
                    <input
                      type={type}
                      className="form-control form-control-sm"
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
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleModalHojaDeVida}
                disabled={isSubmitting}
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />{" "}
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-icons me-1">save</span> Guardar
                    cambios
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
