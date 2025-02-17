import React, { useState, useEffect } from "react";
import axios from "axios";

const ModalHojaDeVida = ({ modalHojaDeVida, toggleModalHojaDeVida }) => {
  const [formData, setFormData] = useState({
    fechaNacimiento: "",
    direccion: "",
    ciudad: "",
    ciudadNacimiento: "",
    telefono: "",
    telefonoFijo: "",
    estadohojadevida: 1,
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { action: "datosPerfil" },
      });

      console.log("Datos recibidos:", response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error al obtener la hoja de vida:", error);
      alert("Ocurrió un error al cargar los datos.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "fechaNacimiento",
      "direccion",
      "ciudad",
      "ciudadNacimiento",
      "telefono",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`El campo ${field} es obligatorio.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const token = getCookie("auth_token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      setIsSubmitting(false);
      return;
    }

    axios
      .patch("http://localhost/gestorplus/backend/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { action: "actualizacionHojaDevida" },
      })
      .then((response) => {
        const serverMessage = response.data.message;
        if (serverMessage === "Hoja de vida actualizada") {
          alert("Hoja de vida actualizada correctamente");
        } else {
          alert("Hubo un error al actualizar la hoja de vida.");
        }
      })
      .catch((error) => {
        console.error("Error al registrar la hoja de vida:", error);
        alert("Ocurrió un error al actualizar. Por favor, inténtalo nuevamente.");
      })
      .finally(() => {
        setIsSubmitting(false);
        toggleModalHojaDeVida();
      });
  };

  return (
    <div
      className={`modal fade ${modalHojaDeVida ? "show" : ""}`}
      style={{ display: modalHojaDeVida ? "block" : "none" }}
      tabIndex="-1"
      aria-labelledby="modalHojaDeVidaLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalHojaDeVidaLabel">
                Actualizar Hoja de Vida
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModalHojaDeVida}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ciudad" className="form-label">
                  Ciudad
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ciudadNacimiento" className="form-label">
                  Ciudad de Nacimiento
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="ciudadNacimiento"
                  value={formData.ciudadNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Celular
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telefonoFijo" className="form-label">
                  Teléfono Fijo
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="telefonoFijo"
                  value={formData.telefonoFijo}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={toggleModalHojaDeVida}
                disabled={isSubmitting}
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
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
