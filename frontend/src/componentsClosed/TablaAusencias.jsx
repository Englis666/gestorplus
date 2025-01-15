import React, { useState, useEffect } from "react";
import { jwtDecode }  from "jwt-decode";
import axios from "axios";

const TablaAusencias = () => {
  const [Ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

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
            setError("Hubo un problema al cargar las Ausencias.");
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
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "notificacionAceptada",
        data: {idausencia},
      })
      .then(() => {
        alert("Notificación aceptada con éxito.");
      })
      .catch((err) => {
        console.error("Error al aceptar la notificación:", err);
        alert("Hubo un problema al aceptar la notificación.");
      });
  };

  const handleRechazar = (idausencia) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "notificacionRechazada",
        data: {idausencia},
      })
      .then(() => {
        alert("Notificación rechazada con éxito.");
      })
      .catch((err) => {
        console.error("Error al rechazar la notificación:", err);
        alert("Hubo un problema al rechazar la notificación.");
      });
  };

  const handleSolicitarJustificacion = (idausencia) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "solicitarJustificacion",
        data: {idausencia},
      })
      .then(() => {
        alert("Se ha solicitado una justificación. Espere la respuesta.");
      })
      .catch((err) => {
        console.error("Error al solicitar la justificación:", err);
        alert("Hubo un problema al solicitar la justificación.");
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
                      <th>Justificación</th>
                      <th>Acción</th>
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
                          <td>{ausencia.justificada ? "Sí" : "No"}</td>
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
                            ) : rol === "3" ? (
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleSolicitarJustificacion(ausencia.idausencia)}
                              >
                                Solicitar Justificación
                              </button>
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
    </div>
  );
};

export default TablaAusencias;
