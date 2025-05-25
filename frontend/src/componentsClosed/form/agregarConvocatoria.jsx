// src/components/FormularioAgregarConvocatoria.js
import React from "react";

const FormularioAgregarConvocatoria = ({
  agregar,
  setAgregar,
  handleAgregar,
  cargos,
}) => {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 animate__animated animate__fadeIn">
        <div className="card-body p-4">
          <h3 className="text-center mb-4 text-primary">
            Agregar Convocatoria
          </h3>
          <form onSubmit={handleAgregar}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nombre de la convocatoria
                </label>
                <input
                  type="text"
                  value={agregar.nombreConvocatoria}
                  onChange={(e) =>
                    setAgregar({
                      ...agregar,
                      nombreConvocatoria: e.target.value,
                    })
                  }
                  className="form-control form-control-lg"
                  placeholder="Ej. Convocatoria de diseñadores"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Descripción</label>
                <input
                  type="text"
                  value={agregar.descripcion}
                  onChange={(e) =>
                    setAgregar({ ...agregar, descripcion: e.target.value })
                  }
                  className="form-control form-control-lg"
                  placeholder="Descripción breve"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Cargo</label>
                <select
                  value={agregar.idcargo}
                  onChange={(e) =>
                    setAgregar({ ...agregar, idcargo: e.target.value })
                  }
                  className="form-select form-select-lg"
                  required
                >
                  <option value="">Seleccione un cargo</option>
                  {cargos.length > 0 ? (
                    cargos.map((cargo) => (
                      <option key={cargo.idcargo} value={cargo.idcargo}>
                        {cargo.nombreCargo}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando cargos...</option>
                  )}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Requisitos</label>
                <input
                  type="text"
                  value={agregar.requisitos}
                  onChange={(e) =>
                    setAgregar({ ...agregar, requisitos: e.target.value })
                  }
                  className="form-control form-control-lg"
                  placeholder="Ej. Mínimo 2 años de experiencia"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Salario</label>
                <input
                  type="number"
                  value={agregar.salario}
                  onChange={(e) =>
                    setAgregar({ ...agregar, salario: e.target.value })
                  }
                  className="form-control form-control-lg"
                  placeholder="Ej. 1800000"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Total de cupos</label>
                <input
                  type="number"
                  value={agregar.cantidadConvocatoria}
                  onChange={(e) =>
                    setAgregar({
                      ...agregar,
                      cantidadConvocatoria: e.target.value,
                    })
                  }
                  className="form-control form-control-lg"
                  placeholder="Ej. 5"
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-4 shadow-sm"
              >
                <i className="fas fa-plus me-2"></i>Agregar Vacante
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioAgregarConvocatoria;
