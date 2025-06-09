/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import DataTable from "react-data-table-component";
import GenerarPazYSalvo from "../form/GenerarPazYSalvo";
import {
  obtenerPazYSalvos,
  generarPazYSalvo,
} from "../../services/PazySalvoService";
import { obtenerEmpleados } from "../../services/EmpleadosService";
import { notificarError, notificarExito } from "../../utils/notificaciones";

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
    empleado: "",
  });

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("auth_token");
    if (!token) {
      setError("Token no encontrado");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
      if (isTokenExpired) {
        setError("El token ha expirado");
        setLoading(false);
        return;
      }
      const Rol = decodedToken?.data?.rol;
      setRol(Rol);

      Promise.all([obtenerPazYSalvos(Rol), obtenerEmpleados()])
        .then(([salvos, empleados]) => {
          setSalvos(salvos);
          setEmpleados(empleados);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error al cargar datos: " + err.message);
          setLoading(false);
        });
    } catch {
      setError("Token invalido o malformado");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await generarPazYSalvo(form);
      if (res.success) {
        notificarExito("Paz y salvo generado con éxito");
        setSalvos([...Salvos, form]);
      } else {
        notificarError("No se pudo generar el paz y salvo");
      }
    } catch {
      notificarError("Error al generar el paz y salvo");
    }
  };

  const columns = [
    {
      name: "Empleado",
      selector: (row) => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Motivo",
      selector: (row) => row.motivo,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha Emisión",
      selector: (row) => row.fechaEmision,
      sortable: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      center: true,
    },
  ];

  if (loading) return <div>Cargando paz y salvo...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-dark font-weight-bold mt-4">
        Paz y Salvo
      </h1>
      <div className="row g-4">
        <div className="col-12 col-md-8">
          <DataTable
            columns={columns}
            data={Salvos}
            pagination
            highlightOnHover
            pointerOnHover
            noDataComponent={
              <div className="text-center p-3">No existen Paz y Salvos</div>
            }
            responsive
            striped
          />
        </div>

        {(rol === "1" || rol === "2") && (
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
