import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

const TablaAusencias = () => {
  const [Ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        axios.get("http://localhost/gestorplus/backend/", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { action: "obtenerAusencias" },
          })
          .then((response) => {
            const Ausencias = response.data.Ausencias;
            if (Array.isArray(Ausencias)) {
              setAusencias(Ausencias);
            } else {
              console.error("Las Ausencias no son un array");
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
        setError("Hubo un problema con el token.");
        setLoading(false);
      }
    }
  }, []); 

  if (loading) {
    return <div>Cargando Ausencias...</div>;
  }

  // Si hay un error
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
              <p>Control de Entradas de Trabajo</p>
              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Fecha de inicio</th>
                      <th>Fecha de Fin</th>
                      <th>Tipo de Ausencia</th>
                      <th>Descripcion</th>
                      <th>Justificacion</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {Ausencias.length > 0 ? (
                      Ausencias.map((ausencia) => (
                        <tr key={ausencia.idausencia}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.fechaInicio}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.fechaFin}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.tipoAusencia}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.descripcion}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.justificada}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{ausencia.fechaRegistro}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              className="btn btn-primary btn-sm"
                              style={{
                                borderRadius: "20px",
                                transition: "all 0.3s ease",
                              }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                            >
                              Ver
                            </button>
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
