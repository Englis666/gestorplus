import React, { useEffect, useState } from "react";
import axios from "axios";
import FormularioPublicacion from "./form/FormularioAgregarPublicaciones";
import "./css/Publicaciones.css";
import { jwtDecode } from "jwt-decode";
import ModalEditarPublicacion from "./modals/ModalEditarPublicacion";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const PublicacionesComp = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [rol, setRol] = useState(null);

  const token = getCookie("auth_token");

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

    if (isTokenExpired) {
      console.log("Token expirado");
      return;
    }

    const Rol = Number(decodedToken?.data?.rol); // 👈 Conversión a número
    setRol(Rol);
    console.log("ROL:", Rol);

    const fetchPublicaciones = async () => {
      try {
        const response = await axios.get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerPublicacionPorTipoDeContrato" },
        });

        const publicacionesObtenidas = response.data.Publicaciones;
        if (Array.isArray(publicacionesObtenidas)) {
          setPublicaciones(publicacionesObtenidas);
        } else {
          console.warn("Publicaciones no es un array:", publicacionesObtenidas);
        }
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    fetchPublicaciones();
  }, [token]);

  const eliminarPublicacion = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta publicación?");
    if (confirmDelete) {
      try {
        const response = await axios.delete("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          data: { action: "eliminarPublicacion", idPublicacion: id },
        });
        if (response.status === 200) {
          setPublicaciones(publicaciones.filter((p) => p.idPublicacion !== id));
          alert("Publicación eliminada exitosamente");
        } else {
          alert("Hubo un error al eliminar la publicación.");
        }
      } catch (error) {
        console.error("Error al eliminar publicación:", error);
        alert("Hubo un error al eliminar la publicación.");
      }
    }
  };

  const guardarCambiosPublicacion = (publicacionEditada) => {
    const nuevasPublicaciones = publicaciones.map((p) =>
      p.idPublicacion === publicacionEditada.idPublicacion ? publicacionEditada : p
    );
    setPublicaciones(nuevasPublicaciones);
    setModalEditarAbierto(false);
  };

  return (
    <main className="publicaciones-wrapper">
      <header className="blog-header text-center py-5 animate__animated animate__fadeInDown">
        <h1 className="display-4 fw-bold text-black">Publicaciones La Fayette</h1>
        <p className="lead text-white-50">Descubre las últimas novedades y actualizaciones en nuestro sistema.</p>
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
                  <h5 className="card-title fw-semibold text-primary">{publicacion.titulo}</h5>
                  <p className="card-text text-secondary">{publicacion.descripcion}</p>
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
                        onClick={() => eliminarPublicacion(publicacion.idPublicacion)}
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

      {/* Botón flotante */}
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

      {/* Modal Agregar (solo para roles 1 y 2) */}
      {(rol === 1 || rol === 2) && (
        <div className="modal fade" id="modalPublicacion" tabIndex="-1" aria-labelledby="modalPublicacionLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold" id="modalPublicacionLabel">Agregar nueva publicación</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div className="modal-body">
                <FormularioPublicacion />
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
