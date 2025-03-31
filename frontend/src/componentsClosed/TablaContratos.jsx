import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaContratos = ({ num_doc = "", nombres = "" }) => {
  const [vinculaciones, setVinculaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    num_doc,
    nombres,
    fechaInicio: "",
    fechaFin: "",
    tipoContrato: "",
    salario: "",
    estadoContrato: "",
    fechaFirma: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost/gestorplus/backend/", {
        params: { action: "obtenerVinculaciones" },
      })
      .then((response) => {
        if (Array.isArray(response.data.Vinculaciones)) {
          setVinculaciones(response.data.Vinculaciones);
        } else {
          setError("No hay vinculaciones disponibles");
          setVinculaciones([]);
        }
      })
      .catch((err) => {
        setError(`Error al obtener vinculaciones: ${err.message}`);
        console.error("Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/gestorplus/backend/", {
        action: "asignarVinculacion",
        ...formData,
      });

      if (response.data.success) {
        alert("Vinculación asignada con éxito");
        setFormData({
          num_doc: "",
          nombres: "",
          fechaInicio: "",
          fechaFin: "",
          tipoContrato: "",
          salario: "",
          estadoContrato: "",
          fechaFirma: "",
        });
      } else {
        alert("Error al asignar la vinculación");
      }
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      alert("Hubo un problema al asignar la vinculación.");
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Vinculaciones</h1>

      <div className="row">
        <div className="card shadow-sm border- mb-4">
          <div className="card-body">
            <p>Vinculaciones de la empresa</p>
            {loading ? (
              <p>Cargando...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="text-center">
                    <tr>
                      <th>Número de documento</th>
                      <th>Nombre y Apellido</th>
                      <th>Fecha de inicio</th>
                      <th>Fecha de fin</th>
                      <th>Tipo de contrato</th>
                      <th>Salario</th>
                      <th>Estado</th>
                      <th>Fecha de firma</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {vinculaciones.length > 0 ? (
                      vinculaciones.map((vinculacion) => (
                        <tr key={vinculacion.usuario_num_doc}>
                          <td>{vinculacion.usuario_num_doc}</td>
                          <td>{vinculacion.nombres}</td>
                          <td>{new Date(vinculacion.fechaInicio).toLocaleDateString("es-ES")}</td>
                          <td>{new Date(vinculacion.fechaFin).toLocaleDateString("es-ES")}</td>
                          <td>{vinculacion.tipoContrato}</td>
                          <td>${vinculacion.salario.toLocaleString()}</td>
                          <td>{vinculacion.estadoContrato}</td>
                          <td>{new Date(vinculacion.fechaFirma).toLocaleDateString("es-ES")}</td>
                          <td>
                            <button className="btn btn-danger">
                              Desactivar contrato y generar paz y salvo
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9">No hay vinculaciones disponibles</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="row mt-4 container-fluid mt-5 card shadow-sm border-0 mb-5">
        <div className="col-12">
          <h4 className="p-2">Asignación de vinculaciones</h4>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Número de Documento del Aspirante", name: "num_doc", type: "number" },
              { label: "Nombre del Aspirante a contratación", name: "nombres", type: "text" },
              { label: "Fecha de inicio", name: "fechaInicio", type: "date" },
              { label: "Fecha de fin", name: "fechaFin", type: "date" },
              { label: "Tipo de contrato", name: "tipoContrato", type: "text" },
              { label: "Salario", name: "salario", type: "number" },
              { label: "Estado", name: "estadoContrato", type: "text" },
              { label: "Fecha de firma", name: "fechaFirma", type: "date" },
            ].map(({ label, name, type }) => (
              <div key={name} className="mb-3">
                <label htmlFor={name} className="form-label">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  className="form-control"
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary mb-2">
              Asignar vinculación al postulante
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TablaContratos;
