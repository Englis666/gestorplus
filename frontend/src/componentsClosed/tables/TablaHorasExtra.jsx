import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useWebSocket from "../../hook/useWebSocket";

const TablaHorasExtra = () => {
  const [horasExtra, setHorasExtra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeEstado, setMensajeEstado] = useState("Esperando ejecución...");
  const [error, setError] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const {
    mensajeEstado: socketMensajeEstado,
    sendMessage,
    ultimoMensaje,
  } = useWebSocket("ws://localhost:8082");

  useEffect(() => {
    const token = getCookie("auth_token");

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

      const timer = setTimeout(() => {
        sendMessage({
          action: "calcularHorasExtra",
          method: "GET",
          token: token,
        });
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      setError("Token inválido o malformado.");
      setLoading(false);
    }
  }, [sendMessage]);

  useEffect(() => {
    if (ultimoMensaje?.calculo) {

      const datos = ultimoMensaje.calculo.map((item, index) => ({
        idHoraextra: index,
        fecha: new Date().toLocaleDateString(), // Ajusta si hay fecha real
        horasExtra: item.horasExtra,
        usuario_num_doc: item.num_doc,
        nombres: item.nombres,
        rol: item.nombreRol,
      }));

      setHorasExtra(datos);
      setLoading(false); 
    }
  }, [ultimoMensaje]);

  return (
    <div className="container mt-5">
      <div className="alert alert-info text-center">
        <span className="spinner-border spinner-border-sm me-2"></span>
        {error || socketMensajeEstado || setMensajeEstado}
      </div>

      <h2 className="mb-4 text-center text-dark font-weight-bold">Horas Extra</h2>
      <div className="table-responsive">
        <p className="text-dark">
          Aquí podrás analizar tus horas extra. Si tienes alguna duda, contacta
          con Recursos Humanos en la sección "Quejas".
        </p>

        <table
          className="table table-hover"
          style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
        >
          <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
            <tr>
              <th>Fecha</th>
              <th>Horas Extra</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {horasExtra.length > 0 ? (
              horasExtra.map((hora) => (
                <tr key={hora.idHoraextra}>
                  <td className="py-3 px-4">{hora.fecha}</td>
                  <td className="py-3 px-4">{hora.horasExtra}</td>
                  <td className="py-3 px-4">{hora.usuario_num_doc}</td>
                  <td className="py-3 px-4">{hora.nombres}</td>
                  <td className="py-3 px-4">{hora.rol}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">
                  {loading ? "Cargando horas extra..." : "No hay horas extra registradas para esta semana."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaHorasExtra;
