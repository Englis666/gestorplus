/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

// ModalEditarPublicacion.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const ModalEditarPublicacion = ({
  modalEditarAbierto,
  setModalEditarAbierto,
  publicacionSeleccionada,
  guardarCambiosPublicacion,
  idPublicacion,
}) => {
  const [publicacionEditada, setPublicacionEditada] = useState(null);
  const token = getCookie("auth_token");

  useEffect(() => {
    if (publicacionSeleccionada) {
      setPublicacionEditada({ ...publicacionSeleccionada });
    }
  }, [publicacionSeleccionada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublicacionEditada((prevPublicacion) => ({
      ...prevPublicacion,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        API_URL,
        {
          action: "actualizarPublicacion",
          ...publicacionEditada,
          data: { idPublicacion: publicacionEditada.idPublicacion },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        alert("Se actualizo la publicacion correctamnete");
        guardarCambiosPublicacion(publicacionEditada);
      } else {
        alert("Hubo un error al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Hubo un error al guardar los cambios.");
    }
  };

  if (!modalEditarAbierto || !publicacionEditada) {
    return null; // No renderizar el modal si no está abierto o si no hay publicación seleccionada
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      aria-labelledby="modalEditarPublicacionLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header">
            <h5
              className="modal-title fw-bold"
              id="modalEditarPublicacionLabel"
            >
              Editar publicación
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setModalEditarAbierto(false)}
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="titulo" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  name="titulo"
                  value={publicacionEditada.titulo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={publicacionEditada.descripcion || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imagen" className="form-label">
                  Subir imagen para la publicacion
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imagen"
                  name="imagen"
                  value={publicacionEditada.imagen || ""}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarPublicacion;
