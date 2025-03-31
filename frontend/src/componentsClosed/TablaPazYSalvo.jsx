import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const TablaPazYSalvo = () => {
    const [Salvos, setSalvos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState(null);
    const [empleados, setEmpleados] = useState([]);
    const [form, setForm] = useState({
        motivo: "",
        fechaEmision: "",
        estado: "",
        empleado: ""
    });

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        };

        const token = getCookie("auth_token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
                if (isTokenExpired) {
                    console.error("El token ha expirado");
                    setError("El token ha expirado");
                    setLoading(false);
                    return;
                }

                const Rol = decodedToken?.data?.rol;
                setRol(Rol);

                const action = (() => {
                    switch (Rol) {
                        case '1':
                        case '2':
                            return "obtenerPazYSalvos";
                        case '3':
                            return "obtenerMiPazySalvo";
                        default:
                            console.error("Rol no valido");
                            setError("Rol no reconocido");
                            setLoading(false);
                            return null;
                    }
                })();

                if (!action) return;

                axios
                    .get("http://localhost/gestorplus/backend/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { action },
                    })
                    .then((response) => {
                        const Salvos = response.data?.Salvos;
                        if (Array.isArray(Salvos)) {
                            setSalvos(Salvos);
                        } else {
                            console.error("Los paz y salvo no están en un arreglo");
                            setSalvos([]);
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error("Error al obtener los paz y salvo", err);
                        setError("Hubo un problema al cargar los paz y salvo");
                        setLoading(false);
                    });

                // Obtener la lista de empleados
                axios
                    .get("http://localhost/gestorplus/backend/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { action: "obtenerEmpleados" },
                    })
                    .then((response) => {
                        const empleados = response.data?.empleados;
                        if (Array.isArray(empleados)) {
                            setEmpleados(empleados);
                        } else {
                            console.error("Los empleados no están en un arreglo");
                            setEmpleados([]);
                        }
                    })
                    .catch((err) => {
                        console.error("Error al obtener los empleados", err);
                        setError("Hubo un problema al cargar los empleados");
                    });
            } catch (error) {
                console.error("Error al decode el token", error);
                setError("Token invalido o malformado");
                setLoading(false);
            }
        } else {
            console.error("No se encontro el token en las cookies");
            setError("Token no encontrado");
            setLoading(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        };

        const token = getCookie("auth_token");

        axios
            .post("http://localhost/gestorplus/backend/", {
                action: "generarPazYSalvo",
                ...form
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.success) {
                    alert("Paz y salvo generado con éxito");
                    setSalvos([...Salvos, form]);
                } else {
                    alert("No se pudo generar el paz y salvo");
                }
            })
            .catch((err) => {
                console.error("Error al generar el paz y salvo", err);
                alert("Error al generar el paz y salvo");
            });
    };

    if (loading) {
        return <div>Cargando paz y salvo...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center text-dark font-weight-bold mt-4">Paz y Salvo</h1>
            <div className="row g-4">
                <div className="col-12 col-md-12">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <p>Paz y salvo de los empleados</p>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="text-center">
                                        <tr>
                                            <th className="py-3 px-4">Motivo</th>
                                            <th className="py-3 px-4">Fecha Emisión</th>
                                            <th className="py-3 px-4">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {Salvos.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="py-3 px-4">
                                                    <span className="text-dark">No existen Paz y Salvos en la base de datos</span>
                                                </td>
                                            </tr>
                                        ) : (
                                            Salvos.map((salvo, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 px-4">
                                                        <span className="text-dark">{salvo.motivo}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-dark">{salvo.fechaEmision}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-dark">{salvo.estado}</span>
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
            </div>
            {(rol === '1' || rol === '2') && (
                <div className="row mt-4 container mt-5 card shadow-sm border-0 mb-5">
                    <div className="col-12">
                        <h4 className="p-2">Generar paz y salvo</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="motivo" className="form-label">Motivo de el paz y salvo</label>
                                <input
                                    type="text"
                                    id="motivo"
                                    name="motivo"
                                    className="form-control"
                                    value={form.motivo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fechaEmision" className="form-label">Fecha de emisión de paz y salvo</label>
                                <input
                                    type="date"
                                    id="fechaEmision"
                                    name="fechaEmision"
                                    className="form-control"
                                    value={form.fechaEmision}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="estado" className="form-label">Estado de el paz y salvo</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    className="form-control"
                                    value={form.estado}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="empleado" className="form-label">Asignar al empleado</label>
                                <select
                                    id="empleado"
                                    name="empleado"
                                    className="form-control"
                                    value={form.empleado}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione un empleado</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.num_doc} value={empleado.num_doc}>
                                            {empleado.nombres}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <button className="btn btn-primary" type="submit">
                                    Generar Paz y salvo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TablaPazYSalvo;