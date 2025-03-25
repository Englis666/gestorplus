import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaVacantes = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregar, setAgregar] = useState({
        nombreConvocatoria: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        cantidadConvocatoria: "",
        nombreCargo: "",
    });

    // Cargar Cargos
    useEffect(() => {
        axios.get("http://localhost/gestorplus/backend/", {
            params: { action: "obtenerCargos" },
        })
            .then((response) => {
                console.log("Cargos obtenidos:", response.data);
                const cargosData = response.data?.cargos; // Asegurar que se obtiene correctamente
                if (Array.isArray(cargosData)) {
                    setCargos(cargosData);
                } else {
                    setCargos([]);
                }
            })
            .catch((err) => {
                console.error("Error al obtener los cargos:", err);
                setError("Hubo un problema al cargar los cargos para la convocatoria");
            })
            .finally(() => setLoading(false));
    }, []);

    // Cargar Convocatorias
    useEffect(() => {
        axios.get("http://localhost/gestorplus/backend/", {
            params: { action: "obtenerConvocatorias" },
        })
            .then((response) => {
                console.log("Convocatorias obtenidas:", response.data);
                const convocatoriasData = response.data?.convocatorias;
                setConvocatorias(Array.isArray(convocatoriasData) ? convocatoriasData : []);
            })
            .catch((err) => {
                console.error("Error al obtener convocatorias:", err);
                setError("Hubo un problema al cargar las Convocatorias");
            })
            .finally(() => setLoading(false));
    }, []);

    // Agregar nueva convocatoria
    const handleAgregar = (e) => {
        e.preventDefault();
        console.log("Datos enviados al backend:", agregar);

        axios.post("http://localhost/gestorplus/backend/", {
            action: "agregarConvocatoria",
            ...agregar,
        })
            .then((response) => {
                console.log(response.data);
                const convocatoriasData = response.data?.convocatorias;
                setConvocatorias(Array.isArray(convocatoriasData) ? convocatoriasData : []);
            })
            .catch((err) => {
                console.error("Error al agregar convocatoria:", err);
                setError("Hubo un problema al agregar la convocatoria");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
                Gestión y Control de Convocatorias
            </h2>
            {error && <p className="alert alert-danger">{error}</p>}
            {loading && <p className="text-center">Cargando datos...</p>}

            {/* Tabla de Convocatorias */}
            <div className="row g-4">
                <div className="col-12 col-md-12">
                    <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
                        <div className="card-body">
                            <b>Lista de Convocatorias</b>
                            <div className="table-responsive">
                                <table className="table table-hover" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                                    <thead className="text-center" style={{ backgroundColor: "#e9ecef" }}>
                                        <tr>
                                            <th>Convocatoria</th>
                                            <th>Descripción</th>
                                            <th>Requisitos</th>
                                            <th>Salario</th>
                                            <th>Cupos</th>
                                            <th>Cargo</th>
                                            <th>Acción</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {convocatorias.length > 0 ? (
                                            convocatorias.map((convocatoria) => (
                                                <tr key={convocatoria.idconvocatoria}>
                                                    <td>{convocatoria.nombreConvocatoria}</td>
                                                    <td>{convocatoria.descripcion}</td>
                                                    <td>{convocatoria.requisitos}</td>
                                                    <td>{convocatoria.salario}</td>
                                                    <td>{convocatoria.cantidadConvocatoria}</td>
                                                    <td>{convocatoria.nombreCargo}</td>
                                                    <td>
                                                        <button className="btn btn-success btn-sm me-2">
                                                            Activar
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger btn-sm">
                                                            Desactivar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8">No hay Convocatorias disponibles.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario para agregar convocatoria */}
            <div className="row mt-4 container mt-5 card shadow-sm border-0 mb-5">
                <form onSubmit={handleAgregar}>
                    <h2 className="mt-2">Agregar Convocatoria</h2>

                    <div className="mb-3">
                        <label className="form-label">Nombre de la convocatoria</label>
                        <input
                            type="text"
                            value={agregar.nombreConvocatoria}
                            onChange={(e) => setAgregar({ ...agregar, nombreConvocatoria: e.target.value })}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Descripción</label>
                        <input
                            type="text"
                            value={agregar.descripcion}
                            onChange={(e) => setAgregar({ ...agregar, descripcion: e.target.value })}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Cargo de la convocatoria</label>
                        <select
                            value={agregar.nombreCargo}
                            onChange={(e) => setAgregar({ ...agregar, nombreCargo: e.target.value })}
                            className="form-control"
                        >
                            <option value="">Seleccione un cargo</option>
                            {cargos.length > 0 ? (
                                cargos.map((cargo) => (
                                    <option key={cargo.idcargo} value={cargo.nombreCargo}>
                                        {cargo.nombreCargo}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Cargando cargos...</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>Requisitos</label>
                        <input
                            type="text"
                            value={agregar.requisitos}
                            onChange={(e) => setAgregar({ ...agregar, requisitos: e.target.value })}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Salario</label>
                        <input
                            type="number"
                            value={agregar.salario}
                            onChange={(e) => setAgregar({ ...agregar, salario: e.target.value })}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label>Total de cupos</label>
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
