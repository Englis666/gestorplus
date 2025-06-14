/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useEffect, useState } from "react";
import FormularioPublicacion from "./form/FormularioAgregarPublicaciones";
import "./css/Publicaciones.css";

import ModalEditarPublicacion from "./modals/ModalEditarPublicacion";
import {
  obtenerPublicaciones,
  eliminarPublicacion,
} from "../services/Publicaciones";
import { jwtDecode } from "jwt-decode";
import {
  confirmarAccion,
  notificarError,
  notificarExito,
} from "../utils/notificaciones";

const PublicacionesComp = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const rolDecoded = Number(decoded?.data?.rol);
        setRol(rolDecoded);
      } catch (e) {
        setRol(null);
      }
    } else {
      setRol(null);
    }
  }, []);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const publicacionesObtenidas = await obtenerPublicaciones();
        if (Array.isArray(publicacionesObtenidas)) {
          setPublicaciones(publicacionesObtenidas);
        } else {
          console.warn("publicaciones no es un array:", publicacionesObtenidas);
        }
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    fetchPublicaciones();
  }, []);

  const eliminarPublicacionHandler = async (id) => {
    const confirmDelete = confirmarAccion(
      "¿Estás seguro de que quieres eliminar esta publicación?"
    );
    if (confirmDelete) {
      try {
        const response = await eliminarPublicacion(id);
        if (response.status === "success") {
          setPublicaciones(publicaciones.filter((p) => p.idPublicacion !== id));
          notificarExito("Publicación eliminada correctamente");
        } else {
          notificarError(
            response.message || "Hubo un error al eliminar la publicación."
          );
        }
      } catch (error) {
        console.error("Error al eliminar publicación:", error);
        notificarError("Hubo un error al eliminar la publicación.");
      }
    }
  };

  const guardarCambiosPublicacion = (publicacionEditada) => {
    const nuevasPublicaciones = publicaciones.map((p) =>
      p.idPublicacion === publicacionEditada.idPublicacion
        ? {
            ...publicacionEditada,
            imagen: publicacionEditada.imagen || p.imagen,
          }
        : p
    );
    setPublicaciones(nuevasPublicaciones);
    setModalEditarAbierto(false);
  };

  // Cuando se agregue una publicación, recarga la lista para mostrar la imagen
  const handlePublicacionAgregada = async () => {
    const publicacionesObtenidas = await obtenerPublicaciones();
    setPublicaciones(
      Array.isArray(publicacionesObtenidas) ? publicacionesObtenidas : []
    );
  };

  return (
    <main className="publicaciones-wrapper">
      <header className="blog-header text-center py-5 animate__animated animate__fadeInDown">
        <h1 className="display-4 fw-bold text-black">
          Publicaciones La Fayette
        </h1>
        <p className="lead text-black-50">
          Descubre las últimas novedades y actualizaciones en nuestro sistema.
        </p>
      </header>

      <div className="container my-5">
        <div className="row g-4 animate__animated animate__fadeIn">
          {publicaciones.map((publicacion) => (
            <div key={publicacion.idPublicacion} className="col-lg-4 col-md-6">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <img
                  src={publicacion.imagen}
                  className="card-img-top"
                  alt={publicacion.titulo}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold text-primary">
                    {publicacion.titulo}
                  </h5>
                  <p className="card-text text-secondary">
                    {publicacion.descripcion}
                  </p>
                  {rol === 1 || rol === 2 ? (
                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-outline-primary d-flex align-items-center"
                        onClick={() => {
                          setPublicacionSeleccionada(publicacion);
                          setModalEditarAbierto(true);
                        }}
                      >
                        <i className="material-icons me-2">edit</i> Editar
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center"
                        onClick={() =>
                          eliminarPublicacionHandler(publicacion.idPublicacion)
                        }
                      >
                        <i className="material-icons me-2">delete</i> Eliminar
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {publicaciones.length === 0 && (
            <div className="col-12 text-center text-muted mt-5">
              No hay publicaciones disponibles.
            </div>
          )}
        </div>
      </div>

      {(rol === 1 || rol === 2) && (
        <div className="fab-container">
          <button
            type="button"
            className="btn btn-success fab shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#modalPublicacion"
          >
            <i className="material-icons">add</i>
          </button>
        </div>
      )}

      {(rol === 1 || rol === 2) && (
        <div
          className="modal fade"
          id="modalPublicacion"
          tabIndex="-1"
          aria-labelledby="modalPublicacionLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="modalPublicacionLabel">
                  Agregar nueva publicación
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                <FormularioPublicacion
                  onPublicacionAgregada={handlePublicacionAgregada}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalEditarPublicacion
        modalEditarAbierto={modalEditarAbierto}
        setModalEditarAbierto={setModalEditarAbierto}
        publicacionSeleccionada={publicacionSeleccionada}
        guardarCambiosPublicacion={guardarCambiosPublicacion}
      />
    </main>
  );
};

export default PublicacionesComp;
