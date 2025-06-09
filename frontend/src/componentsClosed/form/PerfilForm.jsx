import React from "react";

const PerfilForm = ({ formData, handleChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label htmlFor="num_doc" className="form-label">
        Número de documento
      </label>
      <input
        type="number"
        className="form-control"
        name="num_doc"
        id="num_doc"
        value={formData.num_doc}
        readOnly
      />
    </div>
    <div className="mb-3">
      <label htmlFor="nombres" className="form-label">
        Nombres
      </label>
      <input
        type="text"
        className="form-control"
        name="nombres"
        id="nombres"
        value={formData.nombres}
        readOnly
      />
    </div>
    <div className="mb-3">
      <label htmlFor="apellidos" className="form-label">
        Apellidos
      </label>
      <input
        type="text"
        className="form-control"
        name="apellidos"
        id="apellidos"
        value={formData.apellidos}
        readOnly
      />
    </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">
        Correo electrónico
      </label>
      <input
        type="email"
        className="form-control"
        name="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
      />
    </div>
    <div className="mb-3">
      <label htmlFor="tipodDoc" className="form-label">
        Tipo de documento
      </label>
      <select
        name="tipodDoc"
        id="tipodDoc"
        className="form-select"
        value={formData.tipodDoc}
        onChange={handleChange}
      >
        <option value="cedula de ciudadania">Cédula de ciudadanía</option>
        <option value="tarjeta de identidad">Tarjeta de identidad</option>
        <option value="cedula de extranjeria">Cédula de extranjería</option>
        <option value="pasaporte">Pasaporte</option>
      </select>
    </div>
    <button type="submit" className="btn btn-primary w-100 mb-3 shadow-sm">
      Actualizar datos
    </button>
  </form>
);

export default PerfilForm;
