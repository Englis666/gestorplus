import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaJornadas = () => {
  const [Jornadas, setJornadas] = useState([]);
  const [filtrado, setFiltrado] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [minutosTrabajados, setMinutosTrabajados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [filtroNombreTabla, setFiltroNombreTabla] = useState("todos");
  const [filtroFechaTabla, setFiltroFechaTabla] = useState("");

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
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = {
          "1": "obtenerTodasLasJornadas",
          "2": "obtenerTodasLasJornadas",
          "3": "obtenerJornadas",
        }[Rol];

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: { Authorization: `Bearer ${token}` },
            params: { action },
          })
          .then((res) => {
            console.log(res.data);
            const jornadas = res.data?.Jornadas || [];
            setJornadas(jornadas);
            setFiltrado(jornadas);
            const nombres = [...new Set(jornadas.map((j) => j.nombres))];
            setEmpleados(nombres);
            cargarMinutos(jornadas);
            setLoading(false);
          })
          .catch(() => {
            setError("Hubo un problema al cargar las Jornadas.");
            setLoading(false);
          });
      } catch {
        setError("Token inválido o malformado.");
        setLoading(false);
      }
    } else {
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [Jornadas, filtroNombreTabla, filtroFechaTabla]);

  const aplicarFiltros = () => {
    let resultado = [...Jornadas];

    if (filtroNombreTabla !== "todos") {
      resultado = resultado.filter((j) => j.nombres === filtroNombreTabla);
    }

    if (filtroFechaTabla !== "") {
      resultado = resultado.filter((j) => j.fecha === filtroFechaTabla);
    }

    setFiltrado(resultado);
  };

  const cargarMinutos = async (jornadas) => {
    const minutos = {};
    for (const jornada of jornadas) {
      try {
        const { data } = await axios.get("http://localhost/gestorplus/backend/", {
          params: {
            action: "obtenerMinutosTrabajados",
            num_doc: jornada.usuario_num_doc,
            fecha: jornada.fecha,
          },
        });
        minutos[jornada.idJornada] = data;
      } catch {
        minutos[jornada.idJornada] = { minutos_trabajados: "-", minutos_extra: "-" };
      }
    }
    setMinutosTrabajados(minutos);
  };

  const handleCorroborar = (idJornada) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "corroborarJornada",
        idJornada,
      })
      .then(() => {
        alert("Jornada corroborada con éxito.");
        setJornadas((prev) =>
          prev.map((j) =>
            j.idJornada === idJornada
              ? { ...j, estadoJornada: "Jornada corroborada" }
              : j
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al corroborar la jornada.");
      });
  };
  
  const handleNoCorroborar = (idJornada) => {
    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "noCorroborarJornada",
        idJornada,
      })
      .then(() => {
        alert("Jornada rechazada con éxito.");
        setJornadas((prev) =>
          prev.map((j) =>
            j.idJornada === idJornada
              ? { ...j, estadoJornada: "Jornada rechazada" }
              : j
          )
        );
      })
      .catch(() => {
        alert("Hubo un problema al rechazar la jornada.");
      });
  };
  

  const handleFinalizarJornada = async (idJornada, fecha) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token"))
        ?.split("=")[1];

      await axios.post("http://localhost/gestorplus/backend/", null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          action: "finalizarJornada",
          idJornada,
          fecha,
        },
      });

      // Refrescar jornadas después de finalizar
      setJornadas((prev) =>
        prev.map((j) =>
          j.idJornada === idJornada
            ? { ...j, estadoJornada: "Finalizada", horaSalida: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : j
        )
      );
    } catch (error) {
      alert("Error al finalizar la jornada.");
    }
  };

  if (loading) return <div>Cargando jornadas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center text-dark font-weight-bold mb-4">
        Jornadas (Control de Entrada de Trabajo)
      </h2>

      <div className="card shadow-sm border-0" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                <tr>
                  <th>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={filtroFechaTabla}
                      onChange={(e) => setFiltroFechaTabla(e.target.value)}
                    />
                  </th>
                  <th>Hora Entrada</th>
                  <th>Hora Salida</th>
                  <th>
                    <select
                      className="form-select form-select-sm"
                      value={filtroNombreTabla}
                      onChange={(e) => setFiltroNombreTabla(e.target.value)}
                    >
                      <option value="todos">Todos</option>
                      {empleados.map((nombre, idx) => (
                        <option key={idx} value={nombre}>{nombre}</option>
                      ))}
                    </select>
                  </th>
                  <th>Estado</th>
                  {(rol === "1" || rol === "2") && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody className="text-center">
                {filtrado.length > 0 ? (
                  filtrado.map((j) => (
                    <tr key={j.idJornada}>
                      <td>{j.fecha}</td>
                      <td>{j.horaEntrada}</td>
                      <td>{j.horaSalida}</td>
                      <td>{j.nombres}</td>
                      <td>{j.estadoJornada}</td>
                      {(rol === "1" || rol === "2") && (
                        <td className="d-flex flex-column">
                          <button
                            className="btn btn-success btn-sm mb-2"
                            onClick={() => handleCorroborar(j.idJornada)}
                          >
                            Corroborar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleNoCorroborar(j.idJornada)}
                            disabled={j.estadoJornada === "Jornada rechazada"}
                          >
                            No Corroborar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No hay jornadas disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaJornadas;
