import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import FormularioAusencia from "../form/FormularioSolicitudAusencia";

const TablaAusencias = () => {
  const [Ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [solicitud, setSolicitud] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoAusencia: "",
    descripcion: "",
  });

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
        if (isTokenExpired) {
          console.error("El token ha expirado");
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = (() => {
          switch (Rol) {
            case "1":
              return "obtenerTodasLasAusencias";
            case "2":
              return "obtenerTodasLasAusencias";
            case "3":
              return "obtenerAusencias";
            default:
              console.error("Rol no válido");
              setError("Rol no reconocido.");
              setLoading(false);
              return null;
          }
        })();

        if (!action) return;

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action },
          })
          .then((response) => {
            const Ausencias = response.data?.Ausencias;
            if (Array.isArray(Ausencias)) {
              setAusencias(Ausencias);
            } else {
              console.error("Las Ausencias no son un array.");
              setAusencias([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener las Ausencias:", err);
            setError("Hubo un problema al cargar las Ausencias.", err);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Token inválido o malformado.");
        setLoading(false);
      }
    } else {
      console.error("No se encontró el token en las cookies.");
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  const handleAceptar = (idausencia) => {
    console.log("Datos enviados al backend:", { idausencia });
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "notificacionAceptada",
        data: { idausencia },
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        alert("Notificación aceptada con éxito.");

        setAusencias((prevAusencias) =>
          prevAusencias.map((ausencia) =>
            ausencia.idausencia === idausencia
              ? { ...ausencia, justificada: true }
              : ausencia
          )
        );
      })
      .catch((err) => {
        console.error("Error al corroborar la jornada:", err);
        alert("Hubo un problema al corroborar la jornada.");
      });
  };

  const handleRechazar = (idausencia) => {
    console.log("Rechazando ausencia con id:", idausencia);
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "notificacionRechazada",
        data: { idausencia },
      })
      .then((response) => {
        console.log("Respuesta del servidor al rechazar:", response.data);
        if (response.data.success) {
          alert("Notificación rechazada con éxito.");

          // Actualizar la lista de ausencias
          setAusencias((prevAusencias) =>
            prevAusencias.map((ausencia) =>
              ausencia.idausencia === idausencia
                ? { ...ausencia, justificada: false }
                : ausencia
            )
          );
        } else {
          alert("Hubo un problema al rechazar la notificación.",);
        }
      })
      .catch((err) => {
        console.error("Error al rechazar la notificación:", err);
        alert("Hubo un problema al rechazar la notificación.", err);
      });
  };

  const handleSolicitarAusencia = (e) => {
    e.preventDefault();

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };


    const token = getCookie("auth_token");
    if (!token) {
      alert("Token no encontrado. Inicia sesión nuevamente.");
      return;
    }

    if (new Date(solicitud.fechaInicio) > new Date(solicitud.fechaFin)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    // Realizar la solicitud al backend
    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          action: "solicitarAusencia",
          ...solicitud,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Respuesta al solicitar ausencia:", response);
        alert("Solicitud de ausencia enviada con éxito.");
        setSolicitud({
          fechaInicio: "",
          fechaFin: "",
          tipoAusencia: "",
          descripcion: "",
        });
      })
      .catch((err) => {
        console.error("Error al enviar la solicitud de ausencia:", err);
        alert("Hubo un problema al enviar la solicitud de ausencia.");
      });
  };


  if (loading) {
    return <div>Cargando Ausencias...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Ausencias</h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
          >
            <div className="card-body">
              <p>Control de Ausencias</p>
              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Fecha de inicio</th>
                      <th>Fecha de fin</th>
                      <th>Tipo de Ausencia</th>
                      <th>Descripción</th>
                      <th>
                        <select className="form-select form-select-sm">
                          <option value="">Todos</option>
                          <option value="en proceso">En Proceso</option>
                          <option value="aceptada">Aceptada</option>
                          <option value="rechazada">Rechazada</option>
                        </select>
                      </th>
                      {rol === "1" || rol === "2" ? (
                        <th>Acciones</th> 
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {Ausencias.length > 0 ? (
                      Ausencias.map((ausencia) => (
                        <tr key={ausencia.idausencia}>
                          <td>{ausencia.fechaInicio}</td>
                          <td>{ausencia.fechaFin}</td>
                          <td>{ausencia.tipoAusencia}</td>
                          <td>{ausencia.descripcion}</td>
                          <td>{ausencia.justificada}</td>
                          <td>
                            {rol === "1" || rol === "2" ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => handleAceptar(ausencia.idausencia)}
                                >
                                  Aceptar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRechazar(ausencia.idausencia)}
                                >
                                  Rechazar
                                </button>
                              </>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No hay ausencias registradas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormularioAusencia />
    </div>
  );
};

export default TablaAusencias;
