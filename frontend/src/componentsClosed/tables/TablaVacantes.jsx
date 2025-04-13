import React, { useState, useEffect } from "react";
import axios from "axios";
import FormularioAgregarConvocatoria from "../form/agregarConvocatoria";

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
        idcargo: "",
    });

    // Cargar Cargos
    useEffect(() => {
        axios.get("http://localhost/gestorplus/backend/", {
            params: { action: "obtenerCargos" },
        })
            .then((response) => {
                console.log("Cargos obtenidos:", response.data);
                const cargosData = response.data?.cargos;
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
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Requisitos</th>
                                        <th scope="col">Salario</th>
                                        <th scope="col">Cantidad de puestos</th>
                                        <th scope="col">Cargo</th>
                                        <th scope="col">Fecha Apertura</th>
                                        <th scope="col">Fecha Limite</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {convocatorias.map((convocatoria) => (
                                        <tr key={convocatoria.idconvocatoria}>
                                            <td>{convocatoria.nombreConvocatoria}</td>
                                            <td>{convocatoria.descripcion}</td>
                                            <td>{convocatoria.requisitos}</td>
                                            <td>{convocatoria.salario}</td>
                                            <td>{convocatoria.cantidadConvocatoria}</td>
                                            <td>{convocatoria.nombreCargo}</td>
                                            <td>{convocatoria.fecha_apertura}</td>
                                            <td>{convocatoria.fecha_limite}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario para agregar convocatoria */}
            <FormularioAgregarConvocatoria
                agregar={agregar}
                setAgregar={setAgregar}
                handleAgregar={handleAgregar}
                cargos={cargos}
            />
        </div>
    );
};

export default TablaVacantes;
