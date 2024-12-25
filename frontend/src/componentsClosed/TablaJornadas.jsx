import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const TablaJornadas = () => {
  const [Jornadas, setJornadas] = useState([]);
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

        axios.get('http://localhost/gestorplus/backend/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { action: 'obtenerJornadas' },
        })
        .then(response => {
          console.log('Respuesta completa:', response.data);
          const Jornadas = response.data?.Jornadas;  
          if (Array.isArray(Jornadas)) {
            setJornadas(Jornadas); 
          } else {
            console.error('Las Jornadas no son un array');
            setJornadas([]); 
          }
          setLoading(false); 
        })
        .catch(err => {
          console.error('Error al obtener las Jornadas:', err);
          setError('Hubo un problema al cargar las Jornadas.');  
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Jornadas (Control de Entrada de Trabajo)</h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
            <div className="card-body">
              <p>Control de Entradas de Trabajo</p>
              <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora de Entrada</th>
                      <th>Hora de Salida</th>
                      <th>Nombre del Empleado</th>
                      <th>Estado de Jornada</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {Jornadas.length > 0 ? (
                      Jornadas.map((Jornadas) => (
                        <tr key={Jornadas.idjornada}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{Jornadas.fecha}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Jornadas.horaEntrada}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Jornadas.horaSalida}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Jornadas.nombres}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{Jornadas.estado}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="btn btn-primary btn-sm" style={{ borderRadius: "20px", transition: "all 0.3s ease" }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}>
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
      </div>
    </div>
  );
};

export default TablaJornadas;
