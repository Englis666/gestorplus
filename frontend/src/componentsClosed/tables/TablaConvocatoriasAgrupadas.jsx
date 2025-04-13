import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaConvocatoriasAgrupadas = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        axios.get("http://localhost/gestorplus/backend/", {
            params: { action: "calcularPostulacionesEnConvocatorias" },
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
    

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark font-weight-bold mt-4">
                Convocatorias Agrupadas Por Postulaciones
            </h2>
            {error && <p className="alert alert-danger">{error}</p>}
            {loading && <p className="text-center">Cargando datos...</p>}

            {/* Tabla de Convocatorias Agrupadas y conteo de postulaciones */}
            <div className="row g-4">
                <div className="col-12 col-md-12">
                    <div className="card shadow-sm border-0 mb-5" style={{ maxHeight: "450px", overflowY: "auto", borderRadius: "10px" }}>
                        <div className="card-body">
                            <b>Lista de Convocatorias Con Aplicaciones de Aspirantes</b>
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Cantidad De Aspirantes Aplicados</th>
                                        <th scope="col">Salario</th>
                                        <th scope="col">Cargo</th>
                                        <th>Agrupacion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {convocatorias.map((convocatoria) => (
                                        <tr key={convocatoria.idconvocatoria}>
                                            <td>{convocatoria.nombreConvocatoria}</td>
                                            <td>{convocatoria.descripcion}</td>
                                            <td>{convocatoria.cantidad_postulaciones}</td> 
                                            <td>{convocatoria.salario}</td>
                                            <td>{convocatoria.nombreCargo}</td>
                                            <button class="btn btn-primary btn-block">Postulantes</button>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaConvocatoriasAgrupadas;
