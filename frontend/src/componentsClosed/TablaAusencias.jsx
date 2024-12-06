import React, { useState, useEffect } from "react";
import axios from "axios";


const TablaAusencias = () => {
  const [Ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost/gestorplus/backend/', {
      params: { action: 'obtenerAusencias', },
      timeout: 10000,
    })
    .then(response => {
      console.log('Respuesta completa:', response);
      const Ausencias = response.data.Ausencias;
      if (Array.isArray(Ausencias)) {
        setAusencias(Ausencias); 
      } else {
        console.error('Las Ausencias no son un array');
        setAusencias([]); 
      }
      setLoading(false); 
    })
    .catch(err => {
      console.error('Error al obtener las Ausencias:', err);
      setError('Hubo un problema al cargar las Ausencias.');  
      setLoading(false); 
    });
  }, []);

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">Ausencias</h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
            <div className="card-body">
              <p>Control de Entradas de Trabajo</p>
              <div className="table-responsive">
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
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
                      Ausencias.map((Ausencias) => (
                        <tr key={Ausencias.idausencia}>
                          <td className="py-3 px-4">
                            <span className="text-dark">{Ausencias.fechaInicio}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Ausencias.fechaFin}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Ausencias.tipoAusencia}</span>
                          </td>
                          <td className="py-3 px-4">
                              <span className="text-dark">{Ausencias.descripcion}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dark">{Ausencias.justificada}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-dar">{Ausencias.fechaRegistro}</span>
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
                        <td colSpan="6">No hay notificaciones generales.</td>
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
