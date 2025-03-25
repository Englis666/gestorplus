import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaVacantes = () => {
    const [Convocatorias, setConvocatorias] = useState([]);
    const [Cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregar, setAgregar] = useState({
        nombreConvocatoria: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        cantidadConvocatoria: "",
    });

    loadingCargos(() => {
        axios.get("http://localhost/gestorplus/backend/", {
            params: { action: "obtenerCargosParaConvocatorias" },
        })
            .then((response) => {
                console.log("respuesta", response.data);
                const Cargos = response.data?.Cargos;
                if (Array.isArray(Cargos)) {
                    setCargos(Cargos);
                } else {
                    setCargos([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener el cargo", err);
                setError('Hubo un problema al cargar los cargos para la convocatoria');
                setLoading(false);
            });
    }, []);

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
    }, []);

    const handleAgregar = (e) => {
        e.preventDefault();
        console.log("Datos enviados al backend", agregar);
        axios
            .post("http://localhost/gestorplus/backend/", {
                action: "agregarConvocatoria",
                ...agregar,
            })
            .then((response) => {
                console.log(response.data);
                const convocatorias = response.data?.convocatorias;
                if (Array.isArray(convocatorias)) {
                    setConvocatorias(convocatorias);
                } else {
                    setConvocatorias([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al agregar las convocatorias", err);
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
                                            <th>Acción</th>
                                            <th>Acción</th>
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
                                                    <td>
                                                        <button className="btn btn-success btn-sm me-2">
                                                            Activar Convocatoria
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger btn-sm">
                                                            Desactivar Convocatoria
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">No hay Convocatorias disponibles.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4 container mt-5 card shadow-sm border- mb-5">
                <form onSubmit={handleAgregar}>
                    <h2 className="mt-2">Formulario para agregar convocatorias</h2>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Nombre de la convocatoria</label>
                        <input
                            type="text"
                            value={agregar.nombreConvocatoria}
                            onChange={(e) => setAgregar({ ...agregar, nombreConvocatoria: e.target.value })}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Descripción</label>
                        <input
                            type="text"
                            value={agregar.descripcion}
                            onChange={(e) => setAgregar({ ...agregar, descripcion: e.target.value })}
                            name="descripcion" className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Cargo de la convocatoria</label>
                        <select
                            value={agregar.nombreCargo}
                            id=""
                            onChange={(e) => setAgregar({ ...agregar, nombreCargo: e.target.value })}
                            name="nombreCargo"
                            className="form-control"
                        >

                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="">Requisitos</label>
                        <input
                            type="text"
                            value={agregar.requisitos}
                            onChange={(e) => setAgregar({ ...agregar, requisitos: e.target.value })}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Salario</label>
                        <input
                            type="number"
                            value={agregar.salario}
                            onChange={(e) => setAgregar({ ...agregar, salario: e.target.value })}
                            name="salario"
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="">Total de cupos para la convocatoria</label>
                        <input
                            type="number"
                            value={agregar.cantidadConvocatoria}
                            onChange={(e) => setAgregar({ ...agregar, cantidadConvocatoria: e.target.value })}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mb-2">Agregar Vacante</button>
                </form>
            </div>
        </div>
    );
};

export default TablaVacantes;
