import React from "react";

const PerfilTabs = ({
  seleccionado,
  setSeleccionado,
  estudios,
  experiencia,
  editarEstudioHandler,
  eliminarEstudioHandler,
  editarExperienciaHandler,
  eliminarExperienciaHandler,
}) => (
  <div className="card shadow animated fadeIn">
    <div className="card-body">
      <div className="nav nav-tabs">
        <select
          value={seleccionado}
          onChange={(e) => setSeleccionado(e.target.value)}
          className="form-select animated fadeInUp"
        >
          <option value="Estudios">Estudios</option>
          <option value="Experiencias">Experiencia Laboral</option>
        </select>
      </div>
      <div className="mt-4">
        {seleccionado === "Estudios" ? (
          estudios.length > 0 ? (
            estudios.map((estudio, index) => (
              <div key={index} className="card mb-3 animated fadeInUp">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    {estudio.tituloEstudio}
                  </h5>
                  <p className="card-text">
                    <strong>Institución:</strong> {estudio.institucionEstudio}{" "}
                    <br />
                    <strong>Nivel:</strong> {estudio.nivelEstudio} <br />
                    <strong>Área:</strong> {estudio.areaEstudio} <br />
                    <strong>Estado:</strong> {estudio.estadoEstudio} <br />
                    <strong>Fecha de inicio:</strong>{" "}
                    {estudio.fechaInicioEstudio} <br />
                    <strong>Fecha de fin:</strong> {estudio.fechaFinEstudio}{" "}
                    <br />
                    <strong>Ubicación:</strong> {estudio.ubicacionEstudio}
                  </p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => editarEstudioHandler(estudio)}
                    >
                      <i className="material-icons">edit</i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarEstudioHandler(estudio.idestudio)}
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay estudios disponibles.</p>
          )
        ) : experiencia.length > 0 ? (
          experiencia.map((exp, index) => (
            <div key={index} className="card mb-3 animated fadeInUp">
              <div className="card-body">
                <h5 className="card-title text-primary">{exp.profesion}</h5>
                <p className="card-text">
                  <strong>Descripción del perfil:</strong>{" "}
                  {exp.descripcionPerfil} <br />
                  <strong>Fecha de inicio:</strong> {exp.fechaInicioExp} <br />
                  <strong>Fecha de fin:</strong> {exp.fechaFinExp}
                </p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => editarExperienciaHandler(exp)}
                  >
                    <i className="material-icons">edit</i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      eliminarExperienciaHandler(exp.idexperienciaLaboral)
                    }
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay experiencia laboral disponible.</p>
        )}
      </div>
    </div>
  </div>
);

export default PerfilTabs;
