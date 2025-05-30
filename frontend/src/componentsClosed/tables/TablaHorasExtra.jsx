import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { calcularHorasExtra } from "../../services/HoraExtraService";

const TablaHorasExtra = () => {
  const [horasExtra, setHorasExtra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchHorasExtra = async () => {
    try {
      const data = await calcularHorasExtra();
      if (data?.calculo?.length > 0) {
        const datos = data.calculo.map((item, index) => ({
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
      setError(null);
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
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-dark font-weight-bold">
        Horas Extra
      </h2>
      <p className="text-dark mb-3">
        Aquí podrás analizar tus horas extra. Si tienes alguna duda, contacta
        con Recursos Humanos en la sección "Quejas".
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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
