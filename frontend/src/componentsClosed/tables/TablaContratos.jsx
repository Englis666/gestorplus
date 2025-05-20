import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalSubirContratoPdf from "../modals/ModalSubirContratoPdf";
import ModalVerContratoPdf from "../modals/ModalVerContrato";

import FormularioVinculacion from "../form/FormularioAsignacionVinculacion";

const TablaContratos = ({ num_doc, nombres, identrevista, idpostulacion }) => {
  const [vinculaciones, setVinculaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalContratoAbierto, setModalContratoAbierto] = useState(false);
  const [modalVerContratoAbierto, setModalVerContratoAbierto] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [selectedVinculacion, setSelectedVinculacion] = useState(null); // Estado para la vinculacion seleccionada

  const isFormDataAvailable = num_doc && nombres && identrevista && idpostulacion;


  const [formData, setFormData] = useState({
    num_doc,
    nombres,
    idevaluacion: "",
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
        console.log(response);
        if (Array.isArray(response.data.Vinculaciones)) {
          setVinculaciones(response.data.Vinculaciones);
        } else {
          setError("No hay vinculaciones disponibles");
          setVinculaciones([]);
        }
      })
      .catch((err) => {
        setError(`Error al obtener vinculaciones: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!identrevista && !idpostulacion) return;

    axios
      .get("http://localhost/gestorplus/backend/", {
        params: {
          action: "buscarIdEvaluacion",
          identrevista: identrevista || null,
          idpostulacion: idpostulacion || null,
        },
      })
      .then((response) => {
        if (response.data.idevaluacion) {
          setFormData((prevData) => ({
            ...prevData,
            idevaluacion: response.data.idevaluacion,
          }));
        } else {
          console.warn("No se encontró el ID de evaluación.");
        }
      })
      .catch((err) => {
        console.error("Error al buscar ID de evaluación:", err);
      });
  }, [identrevista, idpostulacion]);

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

      if (response.data.Vinculacion) {
        alert("Vinculación asignada con éxito");
        setFormData({
          num_doc,
          nombres,
          idevaluacion: "",
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


  const handleSearch = async (e, num_doc) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost/gestorplus/backend/", {
        params: { action: "obtenerContrato", num_doc },
        responseType: "blob",
      });
  
      const contentType = response.headers["content-type"];
  
      if (contentType !== "application/pdf") {
        const text = await response.data.text();
        const jsonError = JSON.parse(text);
        throw new Error(jsonError.error || "Error inesperado del servidor");
      }
  
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
      setModalVerContratoAbierto(true);
    } catch (err) {
      console.error("Error al obtener contrato:", err.message);
      setErrorMessage(err.message || "Hubo un error al obtener el contrato.");
    }
  };
  

  const closeModal = () => {
    setModalContratoAbierto(false);
    setModalVerContratoAbierto(false); // Cierra el modal
    setPdfUrl(""); // Limpiar URL del PDF
  };

  const openModal = (vinculacion) => {
    setSelectedVinculacion(vinculacion);
    setModalContratoAbierto(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Vinculaciones</h1>

      <div className="row">
        <div className="card shadow-sm border-0 mb-4">
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
                            <button
                              className="btn btn-primary"
                              onClick={() => openModal(vinculacion)} // Abre el modal de subida de contrato
                            >
                              Subir contrato físico
                            </button>
                          </td>
                          {/* <td>
                            <button className="btn btn-danger">
                              Desactivar contrato y generar paz y salvo
                            </button>
                          </td> */}
                          <td>
                            <button className="btn btn-primary" onClick={(e) => handleSearch(e, vinculacion.usuario_num_doc)}>
                              Revisar Contrato
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10">No hay vinculaciones disponibles</td>
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
      {isFormDataAvailable && (
        <div className="row mt-4 container-fluid mt-5 card shadow-sm border-0 mb-5">
          <FormularioVinculacion
              num_doc={num_doc}
              nombres={nombres}
              identrevista={identrevista}
              idpostulacion={idpostulacion}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      )}


      {/* Modal para subir contrato PDF */}
      {modalContratoAbierto && selectedVinculacion && (
        <ModalSubirContratoPdf
          isOpen={modalContratoAbierto}
          onClose={closeModal}
          num_doc={selectedVinculacion.usuario_num_doc}
          nombres={selectedVinculacion.nombres}
          idvinculacion={selectedVinculacion.idvinculacion} // O el id correspondiente de la vinculacion
        />
      )}
      {modalVerContratoAbierto && (
        <ModalVerContratoPdf pdfUrl={pdfUrl} closeModal={closeModal} />
      )}


      {/* Mostrar mensaje de error */}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
};

export default TablaContratos;
