import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaContratos = () => {
  const [vinculaciones, setVinculaciones] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost/gestorplus/backend/", {
        params: { action: "obtenerVinculaciones" },
      })
      .then((response) => {
        console.log("res", response.data.Vinculaciones);
        if (Array.isArray(response.data.Vinculaciones)) {
          setVinculaciones(response.data.Vinculaciones);
        } else {
          console.error(
            "No hay vinculaciones en el sistema o no están dentro de un array",
          );
          setVinculaciones([]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener las vinculaciones", err);
      });
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Vinculaciones</h1>

      <div className="row">
        <div className="card shadow-sm border- mb-4">
          <div className="card-body">
            <p>Vinculaciones de la empresa</p>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="text-center">
                  <tr>
                    <th>Numero de documento</th>
                    <th>Nombre y Apellido del usuario</th>
                    <th>Fecha de inicio de vinculacion</th>
                    <th>Fecha Fin de la vinculacion</th>
                    <th>Tipo de contrato</th>
                    <th>Salario</th>
                    <th>Estado del contrato</th>
                    <th>Fecha De firma</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {vinculaciones.length > 0 ? (
                    vinculaciones.map((vinculacion, index) => (
                      <tr key={index}>
                        <td>{vinculacion.usuario_num_doc}</td>
                        <td>{vinculacion.nombres}</td>
                        <td>{vinculacion.fechaInicio}</td>
                        <td>{vinculacion.fechaFin}</td>
                        <td>{vinculacion.tipoContrato}</td>
                        <td>{vinculacion.salario}</td>
                        <td>{vinculacion.estadoContrato}</td>
                        <td>{vinculacion.fechaFirma}</td>
                        <td>
                          <button className="btn btn-danger">
                            Desactivación de contrato y realización de paz y
                            salvo
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No hay vinculaciones disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaContratos;
