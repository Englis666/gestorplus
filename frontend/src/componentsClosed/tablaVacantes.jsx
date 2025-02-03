import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaVacantes = () => {
    const [Convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/gestorplus/backend/", {
                params: { action: "obtenerConvocatorias" },
            })
            .then((response) => {
                console.log("respuesta", response.data);
                const convocatorias = response.data?.convocatorias;
                if (Array.isArray(convocatorias)) {
                    setConvocatorias(convocatorias);
                } else {
                    setConvocatorias([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener las convocatorias", err);
                setError("Hubo un problema al cargar las Convocatorias");
                setLoading(false);
            });
    }, []); // Dependencia vacía para que se ejecute solo una vez

    const handleAgregar = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        console.log("Datos enviados al backend", {});
        axios
            .post("http://localhost/gestorplus/backend", {
                params: { action: "agregarConvocatoria" },
            })
            .then((response) => {
                const convocatorias = response.data?.convocatorias;
                if (Array.isArray(convocatorias)) {
                    setConvocatorias(convocatorias);
                } else {
                    console.error("Las convocatorias no están dentro de un arreglo");
                    setConvocatorias([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener las convocatorias", err);
                setError("Hubo un problema al cargar las Convocatorias");
                setLoading(false);
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
                Gestión y Control de Convocatorias
            </h2>
            <div className="row g-4">
                <div className="col-12 col-md-12">
                    <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
                        <div className="card-body">
                            <b>Lista de Convocatorias</b>
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                    <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                                        <tr>
                                            <th>Título de la convocatoria</th>
                                            <th>Descripción de la convocatoria</th>
                                            <th>Requisitos de la convocatoria</th>
                                            <th>Salario de la convocatoria</th>
                                            <th>Cupos de la convocatoria</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {Convocatorias.length > 0 ? (
                                            Convocatorias.map((convocatoria) => (
                                                <tr key={convocatoria.idconvocatoria}>
                                                    <td className="py-3 px-4">{convocatoria.nombreConvocatoria}</td>
                                                    <td className="py-3 px-4">{convocatoria.descripcion}</td>
                                                    <td className="py-3 px-4">{convocatoria.requisitos}</td>
                                                    <td className="py-3 px-4">{convocatoria.salario}</td>
                                                    <td className="py-3 px-4">{convocatoria.cantidadConvocatoria}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">No hay Convocatorias disponibles.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h1>Convocatoria</h1>
            <div className="row mt-4 container mt-5 card shadow-sm border- mb-5">
                <form onSubmit={handleAgregar}>
                    <h2 className="mt-2">Formulario para agregar Vacantes</h2>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Nombre de la convocatoria</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Descripción</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Requisitos</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Salario</label>
                        <input type="number" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Total de cupos para la vacante</label>
                        <input type="number" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary mb-2">Agregar Vacante</button>
                </form>
            </div>
        </div>
    );
};

export default TablaVacantes;