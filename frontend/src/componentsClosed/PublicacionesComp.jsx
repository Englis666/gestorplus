import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'animate.css';
import FormularioPublicacion from "./form/FormularioAgregarPublicaciones";
import "./css/Publicaciones.css";

const Publicaciones = () => {
  const publicacionesDemo = [
    {
      id: 1,
      titulo: "Publicación destacada",
      descripcion: "Esta publicación sirve como ejemplo visual para el sistema GestorPlus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imagen: "https://via.placeholder.com/600x300?text=Publicacion+Destacada",
    },
    {
      id: 2,
      titulo: "Novedades",
      descripcion: "Aquí podrías mostrar noticias, informes o eventos importantes. Nulla vitae nunc consequat, suscipit lectus non, volutpat sem.",
      imagen: "https://via.placeholder.com/600x300?text=Novedades",
    },
    {
      id: 3,
      titulo: "Actualizaciones",
      descripcion: "Sección útil para comunicar cambios o mejoras en el sistema. Cras vel elit placerat, ullamcorper ligula eget, sagittis dolor.",
      imagen: "https://via.placeholder.com/600x300?text=Actualizaciones",
    },
  ];

  return (
    <main className="publicaciones-wrapper">
      {/* Cabecera estilo blog */}
      <header className="blog-header text-center py-5 animate__animated animate__fadeInDown">
        <h1 className="display-4 fw-bold text-black">Feed</h1>
        <p className="lead text-white-50">Descubre las últimas novedades y actualizaciones en nuestro sistema.</p>
      </header>

      {/* Contenido principal */}
      <div className="container my-5">
        <div className="row g-4 animate__animated animate__fadeIn">
          {publicacionesDemo.map((publicacion) => (
            <div key={publicacion.id} className="col-lg-4 col-md-6">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <img 
                  src={publicacion.imagen} 
                  className="card-img-top" 
                  alt={publicacion.titulo} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold text-primary">{publicacion.titulo}</h5>
                  <p className="card-text text-secondary">{publicacion.descripcion}</p>
                  <div className="mt-auto d-flex justify-content-between">
                    <a href={`/editar-publicacion/${publicacion.id}`} className="btn btn-outline-primary d-flex align-items-center">
                      <i className="material-icons me-2">edit</i> Editar
                    </a>
                    <button className="btn btn-outline-danger d-flex align-items-center">
                      <i className="material-icons me-2">delete</i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {publicacionesDemo.length === 0 && (
            <div className="col-12 text-center text-muted mt-5">
              No hay publicaciones disponibles.
            </div>
          )}
        </div>
      </div>

      {/* Botón de acción flotante para nueva publicación */}
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

      {/* Modal para agregar publicación */}
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
    </main>
  );
};

export default Publicaciones;
