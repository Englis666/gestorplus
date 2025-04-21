import React, { useState, useEffect } from "react";
import axios from "axios";
import FormularioCargo from "../form/FormularioAgregarCargo";

const API_URL = "http://localhost/gestorplus/backend/";

const TablaCargos = () => {
  const [cargos, setCargos] = useState([]);

  // Carga inicial de cargos
  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { action: "obtenerCargos" },
      });
      const lista = response.data?.cargos;
      setCargos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("[fetchCargos] Error al obtener los cargos:", err);
      setCargos([]);
    }
  };

  const desactivarCargo = async (idCargo) => {
    try {
      const response = await axios.patch(
        API_URL + "?action=desactivarCargo",
        { idCargo },
      );
      await fetchCargos();
    } catch (err) {
      const mensaje = err?.response?.data?.error ??
        "No se pudo desactivar el cargo. Inténtalo de nuevo.";
      alert(mensaje);
    }
  };
  
  
  
  const activarCargo = async (idCargo) => {
    console.log("[activarCargo] llamado con idCargo =", idCargo);
    try {
      const response = await axios.patch(
        API_URL + "?action=activarCargo",
        { idCargo },
      );
      console.log("[activarCargo] respuesta completa:", response);
      console.log("[activarCargo] response.data:", response.data);
      await fetchCargos();
      console.log("[activarCargo] lista de cargos actualizada");
    } catch (err) {
      console.error("[activarCargo] error al activar el cargo:", err);
    }
  };  
  const agregarCargo = (nuevoCargo) => {
    setCargos((prev) => [...prev, nuevoCargo]);
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Cargos del sistema</h1>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <p>Cargos que están cargados en el sistema</p>
              <div className="table-responsive">
                <table className="table table-hover text-center">
                  <thead>
                    <tr>
                      <th>Nombre del cargo</th>
                      <th>Estado del cargo</th>
                      <th>Desactivar</th>
                      <th>Activar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargos.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-3">
                          <span className="text-dark">
                            No existen cargos en la base de datos
                          </span>
                        </td>
                      </tr>
                    ) : (
                      cargos.map((cargo, idx) => {
                        const id = cargo.idCargo ?? cargo.idcargo ?? cargo.id;
                        return (
                          <tr key={idx}>
                            <td>{cargo.nombreCargo}</td>
                            <td>{cargo.estadoCargo}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => desactivarCargo(id)}
                                disabled={cargo.estadoCargo !== "Activo"}
                              >
                                Desactivar
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => activarCargo(id)}
                                disabled={cargo.estadoCargo === "Activo"}
                              >
                                Activar
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0 mb-5">
            <div className="card-body">
              <FormularioCargo onCargoAgregado={agregarCargo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaCargos;
