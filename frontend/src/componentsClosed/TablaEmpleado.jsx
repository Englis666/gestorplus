import React, { useState, useEffect } from "react";
import axios from "axios";
import Estadisticas from "./Estadisticas";
import Grafica from "./Grafica";
import { jwtDecode } from 'jwt-decode';

const TablaEmpleado = () => {
  const [notificaciones, setNotificaciones] = useState([]);
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
          console.error("El token ha expirado.");
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }
  
        axios.get('http://localhost/gestorplus/backend/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { action: 'obtenerNotificaciones' }
        })
        .then(response => {
          console.log('Respuesta completa:', response.data);

          const notificaciones = response.data?.Notificaciones;

          if (Array.isArray(notificaciones)) {
            setNotificaciones(notificaciones);
          } else {
            console.error('Las notificaciones no son un array');
            setNotificaciones([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener las notificaciones:', err);
          setError('Hubo un problema al cargar las notificaciones.');
          setLoading(false);
        });
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setError('Token inválido o malformado.');
        setLoading(false);
      }
    } else {
      console.error('No se encontró el token en las cookies o localStorage.');
      setError('Token no encontrado.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const jornadaNotificaciones = notificaciones.filter(n => n.tipo === 'Jornada');
  const actualizacionNotificaciones = notificaciones.filter(n => n.tipo === 'Actualizacion');
  const generalNotificaciones = notificaciones.filter(n => n.tipo === 'General');

  const handleVerClick = (notificacion) => {
    console.log('Ver detalles de notificación', notificacion);
  };

  return (
    <div className="container mt-5">
      {/* Componente de estadísticas */}
      <Estadisticas />

      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Notificaciones</h2>
      <div className="row g-4">
        {/* Primera tabla: Notificaciones generales */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
            <div className="card-body">
              <p>Notificaciones de quejas o generales</p>
              <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th className="py-3 px-4">Actividad</th>
                      <th className="py-3 px-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {generalNotificaciones.length > 0 ? (
                      generalNotificaciones.map((notificacion) => (
                        <tr key={notificacion.idnotificacion}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{notificacion.descripcionNotificacion}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ borderRadius: "20px", transition: "all 0.3s ease" }}
                              onClick={() => handleVerClick(notificacion)}
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
                        <td colSpan="2">No hay notificaciones generales.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda tabla: Notificaciones de actualizacion */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
            <div className="card-body">
              <p>Notificaciones de actualizaciones</p>
              <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th className="py-3 px-4">Actualización</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {actualizacionNotificaciones.length > 0 ? (
                      actualizacionNotificaciones.map((notificacion) => (
                        <tr key={notificacion.idnotificacion}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{notificacion.descripcionNotificacion}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No hay notificaciones de actualización.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Tercera tabla: Notificaciones de Sesión */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
            <p>Control de entradas de trabajo</p>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th className="py-3 px-4">Control de entrada de trabajo</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {jornadaNotificaciones.length > 0 ? (
                      jornadaNotificaciones.map((notificacion) => (
                        <tr key={notificacion.idnotificacion}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{notificacion.descripcionNotificacion}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No hay notificaciones de jornada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Componente de gráfico */}
        <div className="col-12 col-md-6">
          <Grafica />
        </div>
      </div>
    </div>
  );
};

export default TablaEmpleado;
