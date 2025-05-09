import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SolicitudPermiso from "../form/FormularioSolicitudPermisos";

const TablaPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [solicitud, setSolicitud] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipoPermiso: "",
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
            case "2":
              return "obtenerTodosLosPermisos";
            case "3":
              return "obtenerPermisos";
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
            const permisos = response.data?.permisos;
            if (Array.isArray(permisos)) {
              setPermisos(permisos);
            } else {
              console.error("Los permisos no son un array.");
              setPermisos([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener los permisos:", err);
            setError("Hubo un problema al cargar los permisos.");
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

  const handleAceptar = (idPermisos) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "permisoAceptado",
        idPermisos,
      })
      .then((response) => {
        console.log(idPermisos);
        console.log(response);
        alert("Permiso aceptado con éxito.");
        setPermisos((prev) =>
          prev.map((permiso) =>
            permiso.idpermiso === idPermisos
              ? { ...permiso, aprobado: true }
              : permiso
          )
        );
      })
      .catch((err) => {
        console.error("Error al aceptar el permiso:", err);
        alert("Hubo un problema al aceptar el permiso.");
      });
  };

  const handleRechazar = (idPermisos) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "permisoRechazado",
        idPermisos,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          alert("Permiso rechazado con éxito.");
          setPermisos((prev) =>
            prev.map((permiso) =>
              permiso.idPermisos === idPermisos
                ? { ...permiso, aprobado: false }
                : permiso
            )
          );
        } else {
          alert("Hubo un problema al rechazar el permiso.");
        }
      })
      .catch((err) => {
        console.error("Error al rechazar el permiso:", err);
        alert("Hubo un problema al rechazar el permiso.");
      });
  };

  const handleSolicitarPermiso = (e) => {
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

    axios
      .post(
        "http://localhost/gestorplus/backend/",
        {
          action: "solicitarPermiso",
          ...solicitud,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("Solicitud de permiso enviada con éxito.");
        setSolicitud({
          fechaInicio: "",
          fechaFin: "",
          tipoPermiso: "",
          descripcion: "",
        });
      })
      .catch((err) => {
        console.error("Error al enviar la solicitud de permiso:", err);
        alert("Hubo un problema al enviar la solicitud de permiso.");
      });
  };

  if (loading) return <div>Cargando permisos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Permisos</h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
          >
            <div className="card-body">
              <p>Control de Permisos</p>
              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Nombre Empleado</th>
                      <th>Fecha de inicio</th>
                      <th>Fecha de fin</th>
                      <th>Tipo de Permiso</th>
                      <th>Estado</th>
                      {(rol === "1" || rol === "2") && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {permisos.length > 0 ? (
                      permisos.map((permiso) => (
                        <tr key={permiso.idPermisos}>
                          <td>{permiso.nombres}, {permiso.apellidos}</td>
                          <td>{permiso.fechaInicio}</td>
                          <td>{permiso.fechaFin}</td>
                          <td>{permiso.tipo}</td>
                          <td>{permiso.estadoPermiso}</td>
                          {(rol === "1" || rol === "2") && (
                            <td>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleAceptar(permiso.idPermisos)}
                              >
                                Aceptar
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRechazar(permiso.idPermisos)}
                              >
                                Rechazar
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No hay permisos registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SolicitudPermiso/>
    </div>
  );
};

export default TablaPermisos;
