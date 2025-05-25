/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";

const FormularioVinculacion = ({ formData, handleChange, handleSubmit }) => {
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});

  const campos = [
    {
      label: "Número de Documento",
      name: "num_doc",
      type: "number",
      icon: "badge",
    },
    { label: "Nombre", name: "nombres", type: "text", icon: "person" },
    {
      label: "Fecha de inicio",
      name: "fechaInicio",
      type: "date",
      icon: "calendar_month",
    },
    {
      label: "Fecha de fin",
      name: "fechaFin",
      type: "date",
      icon: "event_busy",
    },
    {
      label: "Tipo de contrato",
      name: "tipoContrato",
      type: "select",
      icon: "description",
      options: ["Prestación de servicios", "Obra labor", "Fijo", "Indefinido"],
    },
    { label: "Salario", name: "salario", type: "number", icon: "attach_money" },
    { label: "Estado", name: "estadoContrato", type: "text", icon: "flag" },
    {
      label: "Fecha de firma",
      name: "fechaFirma",
      type: "date",
      icon: "edit_calendar",
    },
  ];

  const validar = (campo = null, valor = null) => {
    let nuevosErrores = { ...errores };
    const f = { ...formData, [campo]: valor ?? formData?.[campo] };

    if (!f.num_doc || f.num_doc <= 0)
      nuevosErrores.num_doc = "Documento inválido.";
    else delete nuevosErrores.num_doc;

    if (!f.nombres || f.nombres.trim().length < 3)
      nuevosErrores.nombres = "Nombre demasiado corto.";
    else delete nuevosErrores.nombres;

    if (!f.fechaInicio)
      nuevosErrores.fechaInicio = "La fecha de inicio es requerida.";
    else delete nuevosErrores.fechaInicio;

    if (!f.fechaFin) nuevosErrores.fechaFin = "La fecha de fin es requerida.";
    else if (f.fechaInicio && f.fechaFin < f.fechaInicio)
      nuevosErrores.fechaFin =
        "La fecha de fin no puede ser anterior a la de inicio.";
    else delete nuevosErrores.fechaFin;

    if (!f.tipoContrato || f.tipoContrato.trim().length < 3)
      nuevosErrores.tipoContrato = "Tipo de contrato inválido.";
    else delete nuevosErrores.tipoContrato;

    if (!f.salario || parseFloat(f.salario) <= 0)
      nuevosErrores.salario = "El salario debe ser mayor a 0.";
    else delete nuevosErrores.salario;

    if (!f.estadoContrato || f.estadoContrato.trim().length < 3)
      nuevosErrores.estadoContrato = "Estado inválido.";
    else delete nuevosErrores.estadoContrato;

    if (!f.fechaFirma) nuevosErrores.fechaFirma = "Fecha de firma requerida.";
    else delete nuevosErrores.fechaFirma;

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (e) => {
    handleChange(e);
    validar(e.target.name, e.target.value);
  };

  const handleBlur = (e) => {
    setTocado({ ...tocado, [e.target.name]: true });
    validar(e.target.name, e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const camposTocados = {};
    campos.forEach((c) => (camposTocados[c.name] = true));
    setTocado(camposTocados);

    if (validar()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-5 animate__animated animate__fadeIn">
      <div className="card-header bg-white border-0 py-3 px-4">
        <h5 className="mb-0 fw-bold text-primary d-flex align-items-center animate__animated">
          <span className="material-icons me-2 text-primary">
            assignment_ind
          </span>
          Asignación de Vinculaciones
        </h5>
        <p
          className="text-muted mb-0 animate__animated animate__delay-1s"
          style={{ fontSize: "0.9rem" }}
        >
          Completa el siguiente formulario para asignar una vinculación al
          postulante.
        </p>
      </div>
      <div className="card-body px-4 animate__animated  animate__faster">
        <form
          onSubmit={onSubmit}
          className="animate__animated  animate__faster"
        >
          <div className="mb-3">
            <input
              type="hidden"
              name="idevaluacion"
              value={
                formData?.idevaluacion !== undefined &&
                formData?.idevaluacion !== null
                  ? formData.idevaluacion
                  : ""
              }
              readOnly
              className="form-control"
            />
          </div>

          <div className="row">
            {campos.map(({ label, name, type, icon, options = [] }, index) => (
              <div
                className={`col-md-6 mb-4 animate__animated animate__delay-${
                  index % 5
                }s`}
                key={name}
              >
                <label className="form-label fw-semibold">
                  <span
                    className="material-icons me-1 text-secondary"
                    style={{ fontSize: "1.2rem", verticalAlign: "middle" }}
                  >
                    {icon}
                  </span>
                  {label}
                </label>

                {type === "select" ? (
                  <select
                    name={name}
                    className={`form-select ${
                      errores[name] && tocado[name] ? "is-invalid" : ""
                    }`}
                    value={formData?.[name] || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Seleccione un tipo</option>
                    {options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    className={`form-control ${
                      errores[name] && tocado[name] ? "is-invalid" : ""
                    }`}
                    value={formData?.[name] || ""}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                )}

                {errores[name] && tocado[name] && (
                  <div className="invalid-feedback">{errores[name]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-4 shadow-sm animate__animated animate__fadeInRight animate__delay-1s"
            >
              <span className="material-icons align-middle me-2">
                check_circle
              </span>
              Asignar vinculación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVinculacion;
