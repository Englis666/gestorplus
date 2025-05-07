import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import FormularioAusencia from "../form/FormularioSolicitudAusencia";

const TablaAusencias = () => {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [solicitud, setSolicitud] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoAusencia: "",
    descripcion: "",
  });
  const [filtroEstado, setFiltroEstado] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
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

        const rol = decodedToken?.data?.rol;
        setRol(rol);

        const action = rol === "1" || rol === "2" ? "obtenerTodasLasAusencias" : "obtenerAusencias";

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action },
          })
          .then((response) => {
            const ausencias = response.data?.Ausencias;
            if (Array.isArray(ausencias)) {
              setAusencias(ausencias);
            } else {
              setAusencias([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            setError("Hubo un problema al cargar las Ausencias.");
            setLoading(false);
          });
      } catch (error) {
        setError("Token inválido o malformado.");
        setLoading(false);
      }
    } else {
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  const handleAceptar = (idausencia) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "ausenciaAceptada",
        idausencia: idausencia,  
        })
      .then((response) => {
        alert("Ausencia aceptada con éxito.");
        setAusencias((prevAusencias) =>
          prevAusencias.map((ausencia) =>
            ausencia.idausencia === idausencia
              ? { ...ausencia, justificada: true }
              : ausencia
          )
        );
      })
      .catch((err) => {
        alert("Hubo un problema al aceptar la ausencia.");
      });
  };

  const handleRechazar = (idausencia) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "ausenciaRechazada",
        idausencia: idausencia,  
      })
      .then((response) => {
        console.log(response);
        alert("Ausencia rechazada con éxito.");
        setAusencias((prevAusencias) =>
          prevAusencias.map((ausencia) =>
            ausencia.idausencia === idausencia
              ? { ...ausencia, justificada: false }
              : ausencia
          )
        );
      })
      .catch((err) => {
        alert("Hubo un problema al rechazar la notificación.");
      });
  };

  const handleSolicitarAusencia = (e) => {
    e.preventDefault();

    const token = getCookie("auth_token");
    if (!token) {
      alert("Token no encontrado. Inicia sesión nuevamente.");
      return;
    }

    if (new Date(solicitud.fechaInicio) > new Date(solicitud.fechaFin)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

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
        alert("Solicitud de ausencia enviada con éxito.");
        setSolicitud({
          fechaInicio: "",
          fechaFin: "",
          tipoAusencia: "",
          descripcion: "",
        });
      })
      .catch((err) => {
        alert("Hubo un problema al enviar la solicitud de ausencia.");
      });
  };

  const handleFiltroEstadoChange = (e) => {
    setFiltroEstado(e.target.value);
  };

  if (loading) return <div>Cargando Ausencias...</div>;
  if (error) return <div>{error}</div>;

  const ausenciasFiltradas = filtroEstado
    ? ausencias.filter((ausencia) => ausencia.justificada === (filtroEstado === "aceptada"))
    : ausencias;

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
                        <select
                          className="form-select form-select-sm"
                          value={filtroEstado}
                          onChange={handleFiltroEstadoChange}
                        >
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
                    {ausenciasFiltradas.length > 0 ? (
                      ausenciasFiltradas.map((ausencia) => (
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
