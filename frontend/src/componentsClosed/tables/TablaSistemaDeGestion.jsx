import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import API_URL from "../../config";

const TablaSistemaDeGestion = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sistemaDeGestion, setSistemaDeGestion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop().split(";").shift() : null;
    };

    const token = getCookie("auth_token");

    if (!token) {
      setError("El token no fue encontrado");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.exp * 1000 < Date.now()) {
        setError("El token ha expirado");
        setLoading(false);
        return;
      }

      axios
        .get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerSistemaDeGestion" },
        })
        .then((response) => {
          const data = response.data?.sistemaDeGestion;
          setSistemaDeGestion(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          setError("Hubo un problema al cargar el sistema de gestión");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Error al decodificar el token", err);
      setError("Token inválido o malformado");
      setLoading(false);
    }
  }, []);

  // Definir columnas para DataTable
  const columns = [
    {
      name: "Documento",
      selector: (row) => row.usuario_num_doc,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Estado de salud",
      selector: (row) => row.estado_salud,
      center: true,
    },
    {
      name: "Evaluación de riesgos",
      selector: (row) => row.evaluacionRiesgos,
      center: true,
    },
    {
      name: "Recomendaciones",
      selector: (row) => row.recomendaciones,
      center: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Aptitud laboral",
      selector: (row) => row.aptitudLaboral,
      center: true,
    },
    {
      name: "Comentarios",
      selector: (row) => row.comentarios,
      center: true,
      wrap: true,
      maxWidth: "200px",
    },
    {
      name: "Acción",
      cell: (row) => (
        <button
          className="btn btn-danger btn-sm"
          onClick={() =>
            navigate("/Contratos", {
              state: {
                num_doc: row.usuario_num_doc,
                nombres: row.nombres,
                identrevista: row.identrevista,
                idpostulacion: row.idpostulacion,
              },
            })
          }
        >
          Asignarle Vinculación
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
    },
  ];

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Sistema de Gestión</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : sistemaDeGestion.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        <DataTable
          columns={columns}
          data={sistemaDeGestion}
          pagination
          highlightOnHover
          responsive
          defaultSortField="usuario_num_doc"
          striped
          noHeader
        />
      )}
    </div>
  );
};

export default TablaSistemaDeGestion;
