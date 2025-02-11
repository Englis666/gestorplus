import React, { useState, useEffect } from "react";
import axios from "axios";

const TablaCargos = () => {
    const [cargos, setCargos] = useState([]);
    const [nombreCargo, setNombreCargo] = useState("");

    useEffect(() => {
        // Obtener los cargos
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

    const handleInputChange = (e) => {
        setNombreCargo(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar el nombre del cargo
        axios
            .post("http://localhost/gestorplus/backend/", {
                action: "agregarCargo",
                nombreCargo: nombreCargo,
            })
            .then((response) => {
                if (response.data.success) {
                    alert("Cargo agregado con éxito");
                    setCargos([...cargos, { nombre: nombreCargo, estado: "Activo" }]);
                    setNombreCargo("");
                } else {
                    alert("No se pudo agregar el cargo");
                }
            })
            .catch((err) => {
                console.error("Error al agregar el cargo", err);
                alert("Error al agregar el cargo");
            });
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
                                                    <span className="text-dark">No existen cargos en la base de datos</span>
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
                    <form onSubmit={handleSubmit}>
                        <h2>Formulario para agregar más cargos al sistema</h2>
                        <p>Recuerda que cuando agregas un cargo es para una convocatoria, entonces eso significa que ese cargo se habilitará para una selección de convocatoria. Realmente es sencillo, solo debes colocar el nombre que usarás del cargo para poder usarlo en las siguientes postulaciones o convocatorias que crearás.</p>
                        <div className="mb-3">
                            <label htmlFor="nombreCargo" className="form-label text-dark">Nombre del cargo</label>
                            <input
                                type="text"
                                id="nombreCargo"
                                name="nombreCargo"
                                className="form-control"
                                value={nombreCargo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-primary" type="submit">
                                Agregar Cargo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TablaCargos;
