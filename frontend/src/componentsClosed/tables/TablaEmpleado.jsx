import React, { useState, useEffect } from "react";
import axios from "axios";
import Estadisticas from "../Estadisticas";
import Grafica from "../Grafica";
import { jwtDecode } from "jwt-decode";
import DataTable from "react-data-table-component";

const TablaEmpleado = () => {
  const [notificaciones, setNotificaciones] = useState([]);
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

    if (!token) {
      setError("No hay token disponible.");
      setLoading(false);
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      setError("Token inválido.");
      setLoading(false);
      return;
    }

    if (!decodedToken?.data?.rol) {
      setError("Token inválido o sin rol definido.");
      setLoading(false);
      return;
    }

    const Rol = decodedToken.data.rol;
    setRol(Rol);

    const isTokenExpired = decodedToken.exp * 1000 < Date.now();
    if (isTokenExpired) {
      console.error("El token ha expirado.");
      setError("El token ha expirado.");
      setLoading(false);
      return;
    }

    const actionMap = {
      1: "obtenerTodasLasNotificaciones",
      2: "obtenerTodasLasNotificaciones",
      3: "obtenerNotificaciones",
    };

    const actionToSend = actionMap[Rol];

    const fetchNotificaciones = async () => {
      try {
        const response = await axios.get(
          "http://localhost/gestorplus/backend/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action: actionToSend },
          }
        );

        let notificaciones = [];
        if (response.data?.Notificaciones) {
          notificaciones = response.data.Notificaciones;
        } else if (
          response.data?.status === "Notificaciones" &&
          Array.isArray(response.data?.message)
        ) {
          notificaciones = response.data.message;
        } else {
          console.error("Formato de notificaciones no reconocido");
        }

        if (Array.isArray(notificaciones)) {
          setNotificaciones(notificaciones);
        } else {
          setNotificaciones([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las notificaciones:", err);
        setError("Hubo un problema al cargar las notificaciones.");
        setLoading(false);
      }
    };

    fetchNotificaciones();

    const intervalId = setInterval(fetchNotificaciones, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Cargando notificaciones...</div>;
  if (error) return <div>{error}</div>;

  // Filtrar notificaciones por tipo
  const jornadaNotificaciones = notificaciones.filter(
    (n) => n.tipo === "Jornada"
  );
  const actualizacionNotificaciones = notificaciones.filter((n) => {
    if (rol === "3") return n.tipo === "PostulacionAspirantes";
    if (rol === "1" || rol === "2") return n.tipo === "Postulacion";
    return false;
  });
  const generalNotificaciones = notificaciones.filter(
    (n) => n.tipo === "General"
  );

  // Definir columnas para DataTable
  const columns = [
    {
      name: "Actividad",
      selector: (row) => row.descripcionNotificacion,
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div className="container mt-5">
      <Estadisticas />
      <h2 className="mb-4 text-center text-dark fw-bold mt-4">
        Notificaciones
      </h2>
      <div className="row g-4">
        {/* Notificaciones Generales */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              borderRadius: "10px",
            }}
          >
            <div className="card-body">
              <p>Notificaciones generales</p>
              <DataTable
                columns={columns}
                data={generalNotificaciones}
                noDataComponent="No hay notificaciones generales."
                pagination
                dense
                highlightOnHover
              />
            </div>
          </div>
        </div>

        {/* Notificaciones de Actualización */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              borderRadius: "10px",
            }}
          >
            <div className="card-body">
              <p>Notificaciones de actualizaciones</p>
              <DataTable
                columns={columns}
                data={actualizacionNotificaciones}
                noDataComponent="No hay notificaciones de actualización."
                pagination
                dense
                highlightOnHover
              />
            </div>
          </div>
        </div>

        {/* Notificaciones de Jornada */}
        <div className="col-12 col-md-6">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              borderRadius: "10px",
            }}
          >
            <div className="card-body">
              <p>Control de entradas de trabajo</p>
              <DataTable
                columns={columns}
                data={jornadaNotificaciones}
                noDataComponent="No hay notificaciones de jornada."
                pagination
                dense
                highlightOnHover
              />
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="col-12 col-md-6">
          <Grafica />
        </div>
      </div>
    </div>
  );
};

export default TablaEmpleado;
