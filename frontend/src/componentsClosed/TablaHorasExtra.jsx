import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaHorasExtra = () => {
    const [horasExtra, setHorasExtra] = useState([]);
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
      
            axios
              .get("http://localhost/gestorplus/backend/", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params: { action: "obtenerTodasLasHorasExtra" },
              })
              .then((response) => {
                const horasExtra = response.data?.horasExtra;
                if (Array.isArray(horasExtra)) {
                  setHorasExtra(horasExtra);
                } else {
                  console.error("Las horas extra no son un array.", response.data);
                  setHorasExtra([]);
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
            setError("Token inválido o malformado.");
            setLoading(false);
          }
        } else {
          console.error("No se encontró el token en las cookies.");
          setError("Token no encontrado.");
          setLoading(false);
        }
      }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark font-weight-bold">Horas Extra</h2>
            <div className="table-responsive">
              <p className="text-dark">Aqui podras analizar tus horas extras, si tienes alguna duda contacta con Recursos Humanos en la seccion "Quejas" para poder atender tu caso lo mas pronto posible</p>
                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                    
                    <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                        <tr>
                            <th>Fecha</th>
                            <th>Horas Extra</th>
                            <th>Usuario</th>
                            {["1", "2"].includes(rol) && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {horasExtra.length > 0 ? (
                            horasExtra.map(hora => (
                                <tr key={hora.idHoraextra}>
                                    <td className="py-3 px-4">{hora.fecha}</td>
                                    <td className="py-3 px-4">{hora.horasExtra}</td>
                                    <td className="py-3 px-4">{hora.usuario_num_doc}</td>
                                    {["1", "2"].includes(rol) && (
                                        <td className="py-3 px-4">
                                            <button className="btn btn-success btn-sm me-2">Aprobar</button>
                                            <button className="btn btn-danger btn-sm">Rechazar</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-3 px-4 text-center">No hay horas extra registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaHorasExtra;
