import React, { useEffect, useState } from "react";
import {
  obtenerDetalleConvocatoria,
  verificarPostulacion,
  aplicarAConvocatoria,
} from "../services/ConvocatoriasService";
import { notificarExito, notificarError } from "../utils/notificaciones";

const DetallesTrabajo = ({ idconvocatoria }) => {
  const [detalleConvocatoria, setDetalleConvocatoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [estadoAplicacion, setEstadoAplicacion] = useState("puedeAplicar"); // nuevo estado

  useEffect(() => {
    const fetchConvocatoriaDetails = async () => {
      try {
        const data = await obtenerDetalleConvocatoria(idconvocatoria);
        setDetalleConvocatoria(data);
        setError(null);
      } catch (err) {
        setDetalleConvocatoria(null);
        setError("No se encontró la convocatoria seleccionada.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfApplied = async () => {
      try {
        const response = await verificarPostulacion(idconvocatoria);
        console.log("Respuesta de verificarPostulacion:", response);
        if (response?.status === "SinHojaDeVida") {
          notificarError(
            "Debes registrar tu hoja de vida antes de postularte."
          );
          setEstadoAplicacion("sinHojaDeVida");
          return;
        }
        if (response?.status === "PostulacionVerificada" && response.data) {
          // Aquí deberías tener una bandera para saber si YA aplicó
          if (response.data.yaAplicado) {
            setEstadoAplicacion("yaAplicado");
          } else {
            setEstadoAplicacion("puedeAplicar");
          }
          const { tieneEstudio, tieneExperiencia } = response.data;
          if (!tieneEstudio && !tieneExperiencia) {
            notificarError(
              "No tienes estudios ni experiencia registrados. Completa tu perfil para tener mas posibilidades de ser seleccionado."
            );
          } else if (!tieneEstudio) {
            notificarError(
              "No tienes estudios registrados. Completa tu perfil para tener mas posibilidades de ser seleccionado."
            );
          } else if (!tieneExperiencia) {
            notificarError(
              "No tienes experiencia registrada. Completa tu perfil para tener mas posibilidades de ser seleccionado."
            );
          }
        } else {
          setEstadoAplicacion("puedeAplicar");
        }
      } catch (err) {
        setEstadoAplicacion("puedeAplicar");
      }
    };

    fetchConvocatoriaDetails();
    checkIfApplied(); // <-- Esto debe ejecutarse
  }, [idconvocatoria]);

  const handleApply = async () => {
    setEstadoAplicacion("yaAplicado");
    try {
      const response = await aplicarAConvocatoria(idconvocatoria);
      if (response && response.status === "SinHojaDeVida") {
        notificarError("Debes registrar tu hoja de vida antes de postularte.");
        setEstadoAplicacion("sinHojaDeVida");
        return;
      }
      console.log("Response from applying:", response);

      if (response && response.message === "success") {
        notificarExito("Has aplicado a la convocatoria");
        setSuccessMessage(response.message);
      } else if (response && response.error) {
        setError(response.error);
        setEstadoAplicacion("puedeAplicar");
      } else {
        setError("Error al aplicar a la convocatoria.");
        setEstadoAplicacion("puedeAplicar");
      }
    } catch (err) {
      setError("Error al enviar la aplicación.");
      setEstadoAplicacion("puedeAplicar");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div
      id="vacante"
      className="d-flex flex-column min-vh-100"
      style={{
        background: "linear-gradient(to bottom, #E3F2FD, #ECF0F1)",
      }}
    >
      <section className="job-details py-5 flex-grow-1">
        <div className="container">
          <h1 className="heading text-center mt-4 text-primary">
            Detalles del trabajo
          </h1>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div
                className="card shadow-lg rounded-4 border-0"
                style={{
                  transition: "transform 0.3s ease-in-out",
                  background: "white",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="card-body p-5">
                  <h3 className="card-title text-primary text-center">
                    {detalleConvocatoria
                      ? detalleConvocatoria.nombreConvocatoria
                      : "Detalles no disponibles"}
                  </h3>

                  <hr className="mb-4" />

                  <div className="mb-3">
                    <h5 className="text-secondary">Salario</h5>
                    <p className="fw-bold text-dark">
                      {detalleConvocatoria?.salario || "No disponible"}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-secondary">Requerimientos</h5>
                    <p className="text-dark">
                      {detalleConvocatoria?.requisitos || "No disponible"}
                    </p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-secondary">Descripción del trabajo</h5>
                    <p className="text-dark">
                      {detalleConvocatoria?.descripcion || "No disponible"}
                    </p>
                  </div>

                  {successMessage && (
                    <div className="alert alert-success text-center">
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger text-center">
                      {error}
                    </div>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-5 py-2 fw-bold"
                      style={{
                        transition: "all 0.3s ease-in-out",
                      }}
                      onClick={handleApply}
                      disabled={estadoAplicacion !== "puedeAplicar"}
                    >
                      {estadoAplicacion === "sinHojaDeVida"
                        ? "Registrar Hoja de vida"
                        : estadoAplicacion === "yaAplicado"
                        ? "Ya aplicado"
                        : "Aplicar ahora"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer bg-dark text-white py-3 mt-auto">
        <div className="container text-center">
          <div className="credit">
            &copy; 2024 <span>Desarrolladores de Gestor Plus</span> | Todos los
            derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DetallesTrabajo;
