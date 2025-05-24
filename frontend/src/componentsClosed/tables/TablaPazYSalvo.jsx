import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";  
import axios from "axios";
import DataTable from "react-data-table-component";
import GenerarPazYSalvo from "../form/GenerarPazYSalvo";

const TablaPazYSalvo = () => {
  const [Salvos, setSalvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    motivo: "",
    fechaEmision: "",
    estado: "",
    empleado: ""
  });

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
          setError("El token ha expirado");
          setLoading(false);
          return;
        }

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = (() => {
          switch (Rol) {
            case '1':
            case '2':
              return "obtenerPazYSalvos";
            case '3':
              return "obtenerMiPazySalvo";
            default:
              console.error("Rol no valido");
              setError("Rol no reconocido");
              setLoading(false);
              return null;
          }
        })();

        if (!action) return;

        // Obtener Paz y Salvos
        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { action },
          })
          .then((response) => {
            const Salvos = response.data.Salvos;
            if (Array.isArray(Salvos)) {
              setSalvos(Salvos);
            } else {
              setSalvos([]);
            }
            setLoading(false);
          })
          .catch(() => {
            setError("Hubo un problema al cargar los paz y salvo");
            setLoading(false);
          });

        // Obtener Empleados
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
          })
          .catch(() => {
            setError("Hubo un problema al cargar los empleados");
          });
      } catch {
        setError("Token invalido o malformado");
        setLoading(false);
      }
    } else {
      setError("Token no encontrado");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");

    axios
      .post("http://localhost/gestorplus/backend/", {
        action: "generarPazYSalvo",
        ...form
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          alert("Paz y salvo generado con éxito");
          setSalvos([...Salvos, form]);
        } else {
          alert("No se pudo generar el paz y salvo");
        }
      })
      .catch(() => {
        alert("Error al generar el paz y salvo");
      });
  };

  // Columnas para DataTable
  const columns = [
    {
      name: "Motivo",
      selector: row => row.motivo,
      sortable: true,
      center: true
    },
    {
      name: "Fecha Emisión",
      selector: row => row.fechaEmision,
      sortable: true,
      center: true
    },
    {
      name: "Estado",
      selector: row => row.estado,
      sortable: true,
      center: true
    }
  ];

  if (loading) {
    return <div>Cargando paz y salvo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-dark font-weight-bold mt-4">Paz y Salvo</h1>
      <div className="row g-4">
        <div className="col-12 col-md-8">
          <DataTable
            columns={columns}
            data={Salvos}
            pagination
            highlightOnHover
            pointerOnHover
            noDataComponent={<div className="text-center p-3">No existen Paz y Salvos</div>}
            responsive
            striped
          />
        </div>

        {(rol === '1' || rol === '2') && (
          <div className="col-12 col-md-4">
            <h4 className="text-primary">Generar Paz y Salvo</h4>
            <GenerarPazYSalvo
              form={form}
              empleados={empleados}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TablaPazYSalvo;
