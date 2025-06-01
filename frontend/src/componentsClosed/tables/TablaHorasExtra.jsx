import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { obtenerHorasExtra } from "../../services/HoraExtraService";
import HoraExtraChart from "../Graphics/HoraExtraChart";
import { decodedTokenWithRol } from "../../utils/Auth";

const TablaHorasExtra = () => {
  const [horasExtra, setHorasExtra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHorasExtra = async () => {
    try {
      const obtenerRol = decodedTokenWithRol();
      const data = await obtenerHorasExtra(obtenerRol);
      const datos = (data?.calculo || []).map((item) => ({
        ...item,
        numDoc: item.num_doc,
        nombres: item.nombres,
        rol: item.nombreRol || "",
      }));
      setHorasExtra(datos);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos.");
      setHorasExtra([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorasExtra();
    const interval = setInterval(fetchHorasExtra, 10000);
    return () => clearInterval(interval);
  }, []);

  const columnas = [
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Horas Extra",
      selector: (row) => row.horasExtra,
      sortable: true,
      center: true,
    },
    {
      name: "Documento",
      selector: (row) => row.numDoc,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombres,
      sortable: true,
      center: true,
    },
    { name: "Rol", selector: (row) => row.rol, sortable: true, center: true },
  ];

  return (
    <div className="mt-4 animate__animated animate__fadeIn animate__faster">
      <div className="mb-5">
        <HoraExtraChart datos={horasExtra} />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="text-center mb-4">
        <h2 className="text-center mb-4 text-dark fw-bold">
          <i className="material-icons align-middle me-2 text-center">
            access_time
          </i>
          Horas Extra Registradas
        </h2>
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
    </div>
  );
};

export default TablaHorasExtra;
