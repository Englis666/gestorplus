/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import API_URL from "../../config";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const Experiencia = ({
  modalExperiencia,
  toggleModalExperiencia,
  onAgregarExperiencia,
}) => {
  const token = getCookie("auth_token");

  const formik = useFormik({
    initialValues: {
      profesion: "",
      descripcionPerfil: "",
      fechaInicioExp: "",
      fechaFinExp: "",
      cargo: "",
      empresa: "",
      ubicacionEmpresa: "",
      tipoContrato: "",
      salario: "",
      logros: "",
      referenciasLaborales: "",
    },
    validationSchema: Yup.object({
      profesion: Yup.string().required("Requerido"),
      descripcionPerfil: Yup.string().required("Requerido"),
      fechaInicioExp: Yup.date().required("Requerido"),
      fechaFinExp: Yup.date()
        .min(
          Yup.ref("fechaInicioExp"),
          "Debe ser posterior a la fecha de inicio"
        )
        .required("Requerido"),
      cargo: Yup.string().required("Requerido"),
      empresa: Yup.string().required("Requerido"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!token) {
        toast.error("❌ No se encontró el token de autenticación.");
        return;
      }
      try {
        const payload = { action: "agregarExp", ...values };
        const res = await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const nuevaExp = res.data?.data || values;
        onAgregarExperiencia(nuevaExp);
        resetForm();
        toggleModalExperiencia();
        toast.success("✅ Experiencia agregada correctamente.");
      } catch (error) {
        console.error(error);
        const msg =
          error.response?.data?.message || "Error al guardar la experiencia.";
        toast.error(`❌ ${msg}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fields = [
    {
      name: "profesion",
      label: "Profesión",
      type: "text",
      col: "col-12 col-md-6",
    },
    {
      name: "descripcionPerfil",
      label: "Perfil profesional",
      type: "text",
      col: "col-12 col-md-6",
    },
    {
      name: "fechaInicioExp",
      label: "Inicio cargo",
      type: "date",
      col: "col-6 col-md-3",
    },
    {
      name: "fechaFinExp",
      label: "Fin cargo",
      type: "date",
      col: "col-6 col-md-3",
    },
    { name: "cargo", label: "Cargo", type: "text", col: "col-12 col-md-6" },
    { name: "empresa", label: "Empresa", type: "text", col: "col-12 col-md-6" },
    {
      name: "ubicacionEmpresa",
      label: "Ubicación",
      type: "text",
      col: "col-12 col-md-6",
    },
    {
      name: "tipoContrato",
      label: "Tipo contrato",
      type: "text",
      col: "col-6 col-md-3",
    },
    {
      name: "salario",
      label: "Salario",
      type: "number",
      col: "col-6 col-md-3",
    },
    { name: "logros", label: "Logros", type: "text", col: "col-12 col-md-6" },
    {
      name: "referenciasLaborales",
      label: "Referencias",
      type: "text",
      col: "col-12 col-md-6",
    },
  ];

  return (
    <>
      <ToastContainer />
      <div
        className={`modal fade ${
          modalExperiencia ? "show animate__animated animate__fadeInDown" : ""
        }`}
        style={{
          display: modalExperiencia ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        tabIndex="-1"
        aria-labelledby="modalExperienciaLabel"
        aria-hidden={!modalExperiencia}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow-lg rounded-4">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="material-icons">work</span> Agregar Experiencia
                Laboral
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleModalExperiencia}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={formik.handleSubmit} className="modal-body">
              <div className="row g-3">
                {fields.map(({ name, label, type, col }) => (
                  <div className={col} key={name}>
                    <div className="form-floating">
                      <input
                        {...formik.getFieldProps(name)}
                        type={type}
                        className={`form-control ${
                          formik.touched[name] && formik.errors[name]
                            ? "is-invalid"
                            : ""
                        }`}
                        id={name}
                        placeholder={label}
                      />
                      <label htmlFor={name}>
                        {label}{" "}
                        {formik.validationSchema?.fields[name] ? (
                          <span className="text-danger">*</span>
                        ) : null}
                      </label>
                      {formik.touched[name] && formik.errors[name] && (
                        <div className="invalid-feedback">
                          {formik.errors[name]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={toggleModalExperiencia}
                disabled={formik.isSubmitting}
              >
                <span className="material-icons">close</span> Cerrar
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={formik.handleReset}
                disabled={formik.isSubmitting}
              >
                <span className="material-icons">restart_alt</span> Limpiar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                <span className="material-icons align-middle">save</span>{" "}
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Experiencia;
