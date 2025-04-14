import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'animate.css';

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

  const validar = () => {
    const newErrors = {};

    if (!form.titulo.trim()) newErrors.titulo = "El título es obligatorio.";
    if (!form.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    if (!form.usuario_num_doc) newErrors.usuario_num_doc = "El documento del usuario es obligatorio.";

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validar();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setEnviado(false);
      return;
    }

    setErrors({});
    setEnviado(true);

    // Aquí se enviaría el formulario con fetch/axios
    console.log("Formulario enviado:", form);
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card shadow rounded-4 p-4">
        <h2 className="text-center mb-4 fw-bold text-primary">Nueva Publicación</h2>
        
        {enviado && (
          <div className="alert alert-success animate__animated animate__fadeInDown">
            Publicación agregada correctamente.
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
            {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Descripción *</label>
            <textarea
              name="descripcion"
              className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
              rows="4"
              value={form.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">URL de la Imagen (opcional)</label>
            <input
              type="file"
              name="imagen"
              className="form-control"
              value={form.imagen}
              onChange={handleChange}
              placeholder="Sube tu imagen"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Documento del Usuario *</label>
            <input
              type="number"
              name="usuario_num_doc"
              className={`form-control ${errors.usuario_num_doc ? "is-invalid" : ""}`}
              value={form.usuario_num_doc}
              onChange={handleChange}
            />
            {errors.usuario_num_doc && <div className="invalid-feedback">{errors.usuario_num_doc}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tipo de Contrato</label>
            <select
              name="tipo_contrato"
              className="form-select"
              value={form.tipo_contrato}
              onChange={handleChange}
            >
              <option value="todos">Todos</option>
              <option value="Prestación de servicios">Prestación de servicios</option>
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
