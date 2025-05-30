import DataTable from "react-data-table-component";

const SeccionNotificaciones = ({ titulo, datos }) => {
  const columnas = [
    {
      name: "Actividad",
      selector: (row) => row.descripcionNotificacion,
      sortable: true,
      wrap: true,
      style: {
        maxWidth: "350px",
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
  ];

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <h3 className="mb-4 text-center text-dark fw-bold">{titulo}</h3>

      <div className="card shadow-sm rounded-4 h-80">
        <div
          className="card-body p-4"
          style={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <div className="text-center mb-3">
            <i
              className="bi bi-bell-fill text-primary"
              style={{ fontSize: "2.5rem" }}
            ></i>
          </div>
          <p className="text-muted text-center mb-4 px-2">
            Aquí encontrarás las notificaciones relacionadas con{" "}
            <strong>{titulo.toLowerCase()}</strong>.
          </p>
          <DataTable
            columns={columnas}
            data={datos}
            noDataComponent="No hay notificaciones registradas."
            pagination
            dense={false}
            highlightOnHover
            striped={false}
            fixedHeader
            fixedHeaderScrollHeight="320px"
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionNotificaciones;
