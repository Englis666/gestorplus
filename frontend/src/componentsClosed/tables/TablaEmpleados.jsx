import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import DataTable from "react-data-table-component";

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
            const empleados = response.data?.empleados;
            if (Array.isArray(empleados)) {
              setEmpleados(empleados);
            } else {
              setEmpleados([]);
            }
            setLoading(false);
          })
          .catch(() => {
            setError("Hubo un problema al cargar los empleados.");
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

  const columns = [
    {
      name: "Nombre y Apellido",
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Rol en la empresa",
      selector: (row) => row.nombreCargo,
      sortable: true,
    },
    {
      name: "Tipo de documento",
      selector: (row) => row.tipodDoc,
      sortable: true,
    },
    {
      name: "Número de documento",
      selector: (row) => row.num_doc,
      sortable: true,
    },
    {
      name: "Inicio de contrato",
      selector: (row) => row.fechaInicio,
      sortable: true,
    },
    {
      name: "Fin de contrato",
      selector: (row) => row.fechaFin,
      sortable: true,
    },
  ];

  if (loading) return <div>Cargando empleados...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
        Empleados (Control de Información)
      </h2>
      <DataTable
        columns={columns}
        data={empleados}
        pagination
        highlightOnHover
        responsive
        striped
        noHeader
        persistTableHead
        defaultSortField="nombres"
      />
    </div>
  );
};

export default TablaEmpleados;
