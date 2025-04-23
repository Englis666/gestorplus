import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
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

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action: "obtenerEmpleados" },
          })
          .then((response) => {
            console.log("Respuesta completa:", response.data);
            const empleados = response.data?.empleados;
            if (Array.isArray(empleados)) {
              setEmpleados(empleados);
            } else {
              console.error("Los empleados no son un array");
              setEmpleados([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error al obtener los empleados:", err);
            setError("Hubo un problema al cargar los empleados.");
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

  if (loading) {
    return <div>Cargando empleados...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
        Empleados (Control de Información)
      </h2>
      <div className="row g-4">
        <div className="col-12 col-md-12">
          <div
            className="card shadow-sm border-0 mb-5"
            style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}
          >
            <div className="card-body">
              <b>Lista de empleados</b>
              <div className="table-responsive">
                <table
                  className="table table-hover"
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                >
                  <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                    <tr>
                      <th>Nombre y apellido del usuario</th>
                      <th>Email</th>
                      <th>Rol en la empresa</th>
                      <th>Tipo de documento</th>
                      <th>Numero de documento</th>
                      <th>Inicio de contrato</th>
                      <th>Fin de contrato</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {empleados.length > 0 ? (
                      empleados.map((empleado) => (
                        <tr key={empleado.num_doc}>
                          <td className="py-3 px-4">{empleado.nombres}</td>
                          <td className="py-3 px-4">{empleado.email}</td>
                          <td className="py-3 px-4">{empleado.nombreCargo}</td>
                          <td className="py-3 px-4">{empleado.tipodDoc}</td>
                          <td className="py px-4">{empleado.num_doc}</td>
                          <td className="py-3 px-4">{empleado.fechaInicio}</td>
                          <td className="py-3 px-4">{empleado.fechaFin}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No hay empleados disponibles.</td>
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

export default TablaEmpleados;
