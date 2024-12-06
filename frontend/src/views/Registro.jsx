import React, { useState } from "react";
import imagen from '../assets/1.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Registro = () => {

    const [formData, setFormData] = useState({
        num_doc: '',
        nombres: '',
        apellidos: '',
        email: '',
        tipodDoc: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "num_doc" && !/^\d*$/.test(value)) return; 
        
        if (["nombres", "apellidos", "tipodDoc"].includes(name) && /[^a-zA-Z\s]/.test(value)) return;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.num_doc || !formData.nombres || !formData.apellidos || !formData.email || !formData.password) {
            alert("Por favor complete todos los campos.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            alert("Por favor ingrese un correo electrónico válido.");
            return;
        }

        const data = {
            action: 'registrarse',
            num_doc: formData.num_doc,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            tipodDoc: formData.tipodDoc,
            password: formData.password,
            estado: 1,
            rol_idrol: '4',
        };

        setIsSubmitting(true);

        axios
            .post("http://localhost/gestorplus/backend/", data)
            .then((response) => {
                let serverMessage = response.data.message;

                try {
                    serverMessage = JSON.parse(serverMessage);
                } catch (error) {
                    console.log("No es un JSON válido:", error);
                }

                if (serverMessage?.message === 'Usuario registrado') {
                    setIsSubmitting(false);
                    alert("Usuario Registrado Correctamente");
                    navigate("/Login");
                } else {
                    alert("Hubo un error al registrar");
                }
            })
            .catch((error) => {
                console.log("Error al registrar el usuario", error);
                alert("Error en el registro, por favor intenta de nuevo");
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">

            {/* Login de container */}
            <div className="row border rounded-4 p-3 bg-white shadow box-area" style={{ width: '930px' }}>

                {/* Izquierda de login */}
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column"
                    style={{ background: '#103cbe' }}>

                    <div className="featured-image">
                        <img src={imagen} alt="Imagen contenedor" className="img-fluid" style={{ width: '250px' }} />
                        <p className="text-white fs-4">
                            Bienvenidos al software GestorPlus para la frayette</p>
                    </div>

                </div>

                {/* Derecha login */}
                <div className="col-md-6">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <p>Bienvenido</p>
                            <p>Estamos de que te integres a nosotros</p>
                        </div>
                        <form onSubmit={handleSubmit}>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="num_doc"
                                    value={formData.num_doc}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Numero de documento"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Ingrese sus nombres"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Ingrese sus apellidos"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Ingrese su correo"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="tipodDoc"
                                    value={formData.tipodDoc}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Ingrese su tipo de documento (CEDULA,CEDULA EXTRANJERA, VISA)"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Contraseña"
                                />
                            </div>

                            <div className="input-group mb-3">
                                <button
                                    className="btn btn-lg btn-primary w-100 fs-6"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "Registrando..." : "Registrar"}
                                </button>
                                <button
                                    className="btn btn-lg btn-primary w-100 fs-6 mt-3"
                                    type="button"
                                    onClick={() => navigate('/Login')}
                                >
                                    Ya tengo cuenta
                                </button>
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Registro;
