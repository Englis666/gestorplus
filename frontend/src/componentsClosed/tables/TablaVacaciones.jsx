import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TablaVacaciones = () => {
    const [vacaciones, setVacaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState(null);
    const [form, setForm] = useState({ fechaInicio: "", fechaFin: "" });

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        };

        const token = getCookie("auth_token");
        if (!token) {
            setError("Token no encontrado.");
            setLoading(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken?.exp * 1000 < Date.now()) {
                setError("El token ha expirado");
                setLoading(false);
                return;
            }

            const Rol = decodedToken?.data?.rol;
            setRol(Rol);

            const action = Rol === "1" || Rol === "2" ? "obtenerTodasLasVacaciones" : Rol === "3" ? "obtenerMisVacaciones" : null;
            if (!action) {
                setError("Rol no válido.");
                setLoading(false);
                return;
            }

            axios.get("http://localhost/gestorplus/backend/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { action },
            }).then((response) => {

                const vacacionesData = Array.isArray(response.data) ? response.data : (response.data.Vacaciones || []);

                setVacaciones(vacacionesData);
                setLoading(false);
            }).catch(() => {
                setError("Hubo un problema al cargar las vacaciones.");
                setLoading(false);
            });
        } catch {
            setError("Token inválido o malformado.");
            setLoading(false);
        }
    }, []);



    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        if (!token) {
            setError("Token no encontrado.");
            setLoading(false);
            return;
        }

        axios.post("http://localhost/gestorplus/backend/", {
            action: "solicitarVacaciones",
            fechaInicio: form.fechaInicio,
            fechaFin: form.fechaFin,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            console.log("Respuesta del backend", response);
            alert("Vacaciones solicitadas correctamente.");
        }).catch((err) => {
            console.error("Error al enviar la vacacion", err);
            alert("Error al solicitar vacaciones.");
        });
    };

    if (loading) return <div>Cargando Vacaciones...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Vacaciones</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h4>Solicitar Vacaciones</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Inicio:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fechaInicio"
                                        value={form.fechaInicio}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Finalización:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fechaFin"
                                        value={form.fechaFin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Solicitar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <Calendar
                        localizer={localizer}
                        events={vacaciones.map((v) => ({
                            title: `Vacaciones de ${v.nombres}`,
                            start: new Date(v.fechaInicio),
                            end: new Date(v.fechaFin),
                        }))}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </div>
            </div>
            <div className="table-responsive mt-4">
                <table className="table table-hover">
                    <thead className="text-center">
                        <tr>
                            <th>Fecha Inicio</th>
                            <th>Fecha Finalización</th>
                            <th>Aprobado por</th>
                            <th>Estado</th>
                            {/* Solo mostrar "Nombre completo" y las acciones si no es rol 3 */}
                            {rol !== "3" && <th>Nombre completo del usuario</th>}
                            {rol !== "3" && <th>Acción</th>}
                            {rol !== "3" && <th>Acción</th>}
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {vacaciones.length > 0 ? (
                            vacaciones.map((vacacion, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-4">{vacacion.fechaInicio || "N/A"}</td>
                                    <td className="py-3 px-4">{vacacion.fechaFin || "N/A"}</td>
                                    <td className="py-3 px-4">{vacacion.aprobadoPor || "Pendiente"}</td>
                                    <td className="py-3 px-4">{vacacion.estadoVacacion || "Desconocido"}</td>
                                    {/* Solo mostrar "Nombre completo" si el rol no es 3 */}
                                    {rol !== "3" && (
                                        <td className="py-3 px-4">
                                            {vacacion.nombres ? `${vacacion.nombres} ${vacacion.apellidos}` : "N/A"}
                                        </td>
                                    )}
                                    {/* Solo mostrar los botones si el rol no es 3 */}
                                    {rol !== "3" && (
                                        <>
                                            <td className="py-3 px-4">
                                                <button className="btn btn-primary">Aceptar Vacacion</button>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button className="btn btn-danger">Rechazar Vacacion</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={rol === "3" ? 5 : 7}>No hay vacaciones registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default TablaVacaciones;
