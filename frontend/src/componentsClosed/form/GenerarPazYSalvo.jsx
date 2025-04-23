import React, { useState } from "react";


const GenerarPazYSalvo = ({ form, empleados, onChange, onSubmit }) => {
    const [enviando, setEnviando] = useState(false);
    const [errores, setErrores] = useState({});
    const [tocado, setTocado] = useState({});
    const [success, setSuccess] = useState(false);

    const validar = (campo = null, valor = null) => {
        let nuevosErrores = { ...errores };

        const f = { ...form, [campo]: valor ?? form[campo] };

        // Validaciones
        if (!f.motivo || f.motivo.trim().length < 5)
            nuevosErrores.motivo = "El motivo debe tener al menos 5 caracteres.";
        else
            delete nuevosErrores.motivo;

        if (!f.fechaEmision)
            nuevosErrores.fechaEmision = "Debes seleccionar una fecha.";
        else
            delete nuevosErrores.fechaEmision;

        if (!f.estado || f.estado.trim().length < 3)
            nuevosErrores.estado = "El estado debe tener al menos 3 caracteres.";
        else
            delete nuevosErrores.estado;

        if (!f.empleado)
            nuevosErrores.empleado = "Selecciona un empleado.";
        else
            delete nuevosErrores.empleado;

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleBlur = (e) => {
        setTocado({ ...tocado, [e.target.name]: true });
        validar(e.target.name, e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTocado({
            motivo: true,
            fechaEmision: true,
            estado: true,
            empleado: true,
        });

        if (!validar()) return;

        setEnviando(true);
        setSuccess(false);
        try {
            await onSubmit(e);
            setSuccess(true);
            setErrores({});
        } catch (err) {
            console.error("Error al generar paz y salvo:", err);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow border-0 animate__animated animate__fadeIn" style={{ borderRadius: "14px", maxWidth: "650px", margin: "auto" }}>
                <div className="card-body p-4">
                    <h4 className="mb-4 text-primary fw-bold d-flex align-items-center">
                        <span className="material-icons me-2">verified</span>
                        Generar Paz y Salvo
                    </h4>

                    {success && (
                        <div className="alert alert-success animate__animated animate__fadeInDown">
                            <i className="material-icons me-2">check_circle</i>
                            Paz y salvo generado correctamente.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="motivo" className="form-label">Motivo del paz y salvo</label>

                            <div className="mb-4">
                                <label htmlFor="empleado" className="form-label">Asignar al empleado</label>
                                <select
                                    id="empleado"
                                    name="empleado"
                                    className={`form-select ${errores.empleado && tocado.empleado ? "is-invalid" : ""}`}
                                    value={form.empleado}
                                    onChange={(e) => {
                                        onChange(e);
                                        validar("empleado", e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Seleccione un empleado</option>
                                    {empleados.map((empleado) => (
                                        <option key={empleado.num_doc} value={empleado.num_doc}>
                                            {empleado.nombres}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">{errores.empleado}</div>
                            </div>
                                <label htmlFor="motivo" className="form-label">Motivo</label>
                            <input
                                type="text"
                                id="motivo"
                                name="motivo"
                                className={`form-control ${errores.motivo && tocado.motivo ? "is-invalid" : ""}`}
                                value={form.motivo}
                                onChange={(e) => {
                                    onChange(e);
                                    validar("motivo", e.target.value);
                                }}
                                onBlur={handleBlur}
                            />
                            <div className="invalid-feedback">{errores.motivo}</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="fechaEmision" className="form-label">Fecha de emisión</label>
                            <input
                                type="date"
                                id="fechaEmision"
                                name="fechaEmision"
                                className={`form-control ${errores.fechaEmision && tocado.fechaEmision ? "is-invalid" : ""}`}
                                value={form.fechaEmision}
                                onChange={(e) => {
                                    onChange(e);
                                    validar("fechaEmision", e.target.value);
                                }}
                                onBlur={handleBlur}
                            />
                            <div className="invalid-feedback">{errores.fechaEmision}</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="estado" className="form-label">Estado del paz y salvo</label>
                            <input
                                type="text"
                                id="estado"
                                name="estado"
                                className={`form-control ${errores.estado && tocado.estado ? "is-invalid" : ""}`}
                                value={form.estado}
                                onChange={(e) => {
                                    onChange(e);
                                    validar("estado", e.target.value);
                                }}
                                onBlur={handleBlur}
                            />
                            <div className="invalid-feedback">{errores.estado}</div>
                        </div>



                        <button
                            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Generando...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons me-2">print</span>
                                    Generar Paz y Salvo
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GenerarPazYSalvo;
