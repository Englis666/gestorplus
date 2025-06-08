/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { agregarPublicacion } from "../../services/Publicaciones";

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const FormularioPublicacion = () => {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    imagen: "",
    usuario_num_doc: "",
    tipo_contrato: "todos",
    estado: "activo",
  });

  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [errorApi, setErrorApi] = useState("");

  useEffect(() => {
    const token = getCookie("auth_token");
    const decoded = token ? parseJwt(token) : null;

    if (decoded && decoded.data && decoded.data.num_doc) {
      setForm((prev) => ({
        ...prev,
        usuario_num_doc: decoded.data.num_doc,
      }));
    }
  }, []);

  const validar = () => {
    const newErrors = {};
    if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio.";
    if (!form.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria.";
    if (!form.usuario_num_doc)
      newErrors.usuario_num_doc = "El documento del usuario es obligatorio.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen" && files && files[0]) {
      setForm({ ...form, imagen: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorApi("");
    const validationErrors = validar();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setEnviado(false);
      return;
    }

    setErrors({});
    setEnviado(false);

    // Preparamos los datos para enviar, usando FormData si hay imagen
    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("descripcion", form.descripcion);
    formData.append("usuario_num_doc", form.usuario_num_doc);
    formData.append("tipo_contrato", form.tipo_contrato);
    formData.append("estado", form.estado);
    if (form.imagen) {
      formData.append("imagen", form.imagen);
    }

    try {
      const response = await agregarPublicacion(formData);
      if (response?.status === "success") {
        setEnviado(true);
        setForm({
          titulo: "",
          descripcion: "",
          imagen: "",
          usuario_num_doc: form.usuario_num_doc,
          tipo_contrato: "todos",
          estado: "activo",
        });
      } else {
        setErrorApi(response?.message || "Error al agregar publicación.");
      }
    } catch (error) {
      setErrorApi("Error al conectar con la API.");
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card shadow rounded-4 p-4">
        <h2 className="text-center mb-4 fw-bold text-primary">
          Nueva Publicación
        </h2>

        {enviado && (
          <div className="alert alert-success animate__animated animate__fadeInDown">
            Publicación agregada correctamente.
          </div>
        )}
        {errorApi && (
          <div className="alert alert-danger animate__animated animate__fadeInDown">
            {errorApi}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Título *</label>
            <input
              type="text"
              name="titulo"
              className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
              value={form.titulo}
              onChange={handleChange}
            />
            {errors.titulo && (
              <div className="invalid-feedback">{errors.titulo}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Descripción *</label>
            <textarea
              name="descripcion"
              className={`form-control ${
                errors.descripcion ? "is-invalid" : ""
              }`}
              rows="4"
              value={form.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && (
              <div className="invalid-feedback">{errors.descripcion}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Imagen (opcional)</label>
            <input
              type="file"
              className="form-control"
              id="imagen"
              name="imagen"
              onChange={handleChange}
              accept="image/*"
            />
          </div>

          <input
            type="hidden"
            name="usuario_num_doc"
            value={form.usuario_num_doc}
          />

          <div className="mb-3">
            <label className="form-label fw-semibold">Tipo de Contrato</label>
            <select
              name="tipo_contrato"
              className="form-select"
              value={form.tipo_contrato}
              onChange={handleChange}
            >
              <option value="todos">Todos</option>
              <option value="Prestación de servicios">
                Prestación de servicios
              </option>
              <option value="Obra laboral">Obra laboral</option>
              <option value="Fijo">Fijo</option>
              <option value="Indefinido">Indefinido</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Estado</label>
            <select
              name="estado"
              className="form-select"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary shadow-sm px-4">
              <i className="material-icons me-2">save</i>Guardar publicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPublicacion;
