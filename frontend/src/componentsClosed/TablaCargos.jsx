import React, { useState, useEffect } from "react";
import axios from "axios";
import FormularioCargo from "./form/FormularioAgregarCargo";

const TablaCargos = () => {
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost/gestorplus/backend/", {
                params: { action: "obtenerCargos" },
            })
            .then((response) => {
                const cargos = response.data?.cargos;
                if (Array.isArray(cargos)) {
                    setCargos(cargos);
                } else {
                    console.error("Los cargos no están en un arreglo");
                    setCargos([]);
                }
            })
            .catch((err) => {
                console.error("Error al obtener los cargos", err);
            });
    }, []);

    const agregarCargo = (nuevoCargo) => {
        setCargos([...cargos, nuevoCargo]);
    };

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Cargos del sistema</h1>

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <p>Cargos que están cargados en el sistema</p>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="text-center">
                                        <tr>
                                            <th className="py-3 px-4">Nombre del cargo</th>
                                            <th>Estado del cargo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {cargos.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-3 px-4">
                                                    <span className="text-dark">
                                                        No existen cargos en la base de datos
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : (
                                            cargos.map((cargo, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 px-4">
                                                        <span className="text-dark">{cargo.nombreCargo}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-dark">{cargo.estadoCargo}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 container card shadow-sm border-0 mb-5">
                    <FormularioCargo onCargoAgregado={agregarCargo} />
                </div>
            </div>
        </div>
    );
};

export default TablaCargos;
