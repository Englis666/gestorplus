import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const TablaSistemaDeGestion = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sistemaDeGestion, setSistemaDeGestion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop().split(";").shift() : null;
    };

    const token = getCookie("auth_token");

    if (!token) {
      setError("El token no fue encontrado");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.exp * 1000 < Date.now()) {
        setError("El token ha expirado");
        setLoading(false);
        return;
      }

      axios
        .get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerSistemaDeGestion" },
        })
        .then((response) => {
          console.log(response);
          const data = response.data?.sistemaDeGestion;
          setSistemaDeGestion(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError("Hubo un problema al cargar el sistema de gestión");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Error al decodificar el token", err);
      setError("Token inválido o malformado");
      setLoading(false);
    }
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Sistema de Gestión</h1>

      <div className="row">
        <div className="card shadow-sm border- mb-4">
          <div className="card-body">
            <p>Sistema de Gestión por aspirante y empleado</p>

            {loading ? (
              <p>Cargando...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : sistemaDeGestion.length === 0 ? (
              <p>No hay datos disponibles</p>
            ) : (
              <table className="table table-hover">
                <thead className="text-center">
                  <tr>
                    <th>Documento</th>
                    <th>Nombre</th>
                    <th>Estado de salud</th>
                    <th>Evaluación de riesgos</th>
                    <th>Recomendaciones</th>
                    <th>Aptitud laboral</th>
                    <th>Comentarios</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {sistemaDeGestion.map((item) => (
                    <tr key={item.id}>
                      <td>{item.usuario_num_doc}</td>
                      <td>{item.nombres}</td>
                      <td>{item.estado_salud}</td>
                      <td>{item.evaluacionRiesgos}</td>
                      <td>{item.recomendaciones}</td>
                      <td>{item.aptitudLaboral}</td>
                      <td>{item.comentarios}</td>
                      <td>
                        <button
                            className="btn btn-danger"
                            onClick={() =>
                              navigate("/Contratos", {
                                state: {
                                  num_doc: item.usuario_num_doc,
                                  nombres: item.nombres,
                                  identrevista: item.identrevista,
                                  idpostulacion: item.idpostulacion,
                                },
                              })
                            }
                          >
                            Asignarle Vinculacion
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaSistemaDeGestion;
