import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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

  const fetchHorasExtra = async () => {
    const token = getCookie("auth_token");

    if (!token) {
      setError("Token no disponible.");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();

      if (isTokenExpired) {
        setError("El token ha expirado.");
        setLoading(false);
        return;
      }

      setMensajeEstado("Consultando horas extra...");

      const response = await axios.get("http://localhost/gestorplus/backend/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          action: "calcularHorasExtra",
        },
      });

      if (response.data?.calculo?.length > 0) {
        const datos = response.data.calculo.map((item, index) => ({
          id: index,
          fecha: new Date().toLocaleDateString(),
          horasExtra: item.horasExtra,
          numDoc: item.num_doc,
          nombres: item.nombres,
          rol: item.nombreRol,
        }));
        setHorasExtra(datos);
      } else {
        setHorasExtra([]);
      }

      setLoading(false);
      setMensajeEstado("Horas extra actualizadas.");
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorasExtra();
    const interval = setInterval(fetchHorasExtra, 5000);
    return () => clearInterval(interval);
  }, []);

  // Definición de columnas para DataTable
  const columnas = [
    {
      name: "Fecha",
      selector: row => row.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Horas Extra",
      selector: row => row.horasExtra,
      sortable: true,
      center: true,
    },
    {
      name: "Documento",
      selector: row => row.numDoc,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre",
      selector: row => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Rol",
      selector: row => row.rol,
      sortable: true,
      center: true,
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">Horas Extra</h2>
      <p className="text-dark mb-3">
        Aquí podrás analizar tus horas extra. Si tienes alguna duda, contacta
        con Recursos Humanos en la sección "Quejas".
      </p>

      <DataTable
        columns={columnas}
        data={horasExtra}
        progressPending={loading}
        noDataComponent="No hay horas extra registradas para esta semana."
        highlightOnHover
        striped
        responsive
        pagination
        persistTableHead
      />
    </div>
  );
};

export default TablaHorasExtra;
