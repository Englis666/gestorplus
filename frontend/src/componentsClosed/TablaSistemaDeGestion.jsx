// import React from "react";

const TablaSistemaDeGestion = () => {
  return (
    <div className="container-fluid">
      <h1 className="mb-4">Sistema de Gestion</h1>

      <div className="row">
        <div className="card shadow-sm border- mb-4">
          <div className="card-body">
            <p>Sistema de Gestion por aspirante y empleado</p>
            <table className="">
              <div className="table table-hover">
                <thead className="text-center">
                  <tr>
                    <th>Numero de documento del Aspirante</th>
                    <th>Nombre del Aspirante</th>
                    <th>Estado de salud del Aspirante</th>
                    <th>Evaluacion de Riesgos</th>
                    <th>Recomendaciones</th>
                    <th>Aptitud laboral del Aspirante</th>
                    <th>Comentarios</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button className="btn btn-danger">
                        Asignarle contrato
                      </button>
                    </td>
                  </tr>
                </tbody>
              </div>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaSistemaDeGestion;

