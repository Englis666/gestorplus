import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaJornadas = () => {
  const [Jornadas, setJornadas] = useState([]);
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

        const roleActions = {
          "1": "obtenerTodasLasJornadas",
          "2": "obtenerTodasLasJornadas",
          "3": "obtenerJornadas",
        };

        const action = roleActions[Rol];
        if (!action) {
          console.error("Rol no válido");
          setError("Rol no reconocido");
          setLoading(false);
          return;
        }

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action },
          })
          .then((response) => {
            const Jornadas = response.data?.Jornadas;
            if (Array.isArray(Jornadas)) {
              setJornadas(Jornadas);
            } else {
              console.error("Las Jornadas no son un array");
              setJornadas([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener las Jornadas:", err);
            setError("Hubo un problema al cargar las Jornadas.");
            setLoading(false);
          });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Token inválido o malformado.");
        setLoading(false);
      }
    } else {
      console.error("No se encontró el token en las cookies o localStorage.");
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  const handleCorroborar = (idjornada) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "corroborarJornada",
        $data: { idjornada },
      })
      .then(() => {
        alert("La jornada ha sido corroborada correctamente.");
      })
      .catch((err) => {
        console.error("Error al corroborar la jornada:", err);
        alert("Hubo un problema al corroborar la jornada.");
      });
  };

  const handleNoCorroborar = (idjornada) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "noCorroborarJornada",
        $data: { idjornada },
      })
      .then(() => {
        alert("La jornada ha sido marcada como no corroborada.");
      })
      .catch((err) => {
        console.error("Error al marcar la jornada como no corroborada:", err);
        alert("Hubo un problema al procesar la solicitud.");
      });
  };

  if (loading) {
    return <div>Cargando jornadas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Jornadas (Control de Entrada de Trabajo)</h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
          >
            <div className="card-body">
              <p>Control de Entradas de Trabajo</p>
              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora de Entrada</th>
                      <th>Hora de Salida</th>
                      <th>Nombre del Empleado</th>
                      <th>Estado de Jornada</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {Jornadas.length > 0 ? (
                      Jornadas.map((jornada) => (
                        <tr key={jornada.idjornada}>
                          <td className="py-3 px-4">{jornada.fecha}</td>
                          <td className="py-3 px-4">{jornada.horaEntrada}</td>
                          <td className="py-3 px-4">{jornada.horaSalida}</td>
                          <td className="py-3 px-4">{jornada.nombres}</td>
                          <td className="py-3 px-4">{jornada.estado}</td>
                          <td className="py-3 px-4">
                            {rol === "1" || rol === "2" ? (
                              <>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => handleCorroborar(jornada.idjornada)}
                                >
                                  Corroborar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleNoCorroborar(jornada.idjornada)}
                                >
                                  No corroborar
                                </button>
                              </>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No hay jornadas disponibles.</td>
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

export default TablaJornadas;
