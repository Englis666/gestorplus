import React, { useState } from "react";
import imagen from '../assets/1.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/userContext";

const Login = () => {
    const [formData, setFormData] = useState({
        num_doc: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validar que num_doc solo contenga números
        if (name === 'num_doc' && !/^\d*$/.test(value)) {
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!formData.num_doc || !formData.password) {
            alert("Por favor complete todos los campos.");
            return;
        }
    
        const data = {
            action: 'login',
            num_doc: formData.num_doc,
            password: formData.password,
        };
    
        setIsSubmitting(true);
    
        axios
            .post("http://localhost/gestorplus/backend/", data, { withCredentials: true }) 
            .then((response) => {
                const serverMessage = response.data;
                console.log('Respuesta del servidor:', serverMessage);
    
                if (serverMessage?.status === 'success') {
                    const sessionData = serverMessage.session;
                    console.log("Datos de la sesión:", sessionData);  

                    if (!sessionData || !sessionData.num_doc || !sessionData.nombres) {
                        alert("Error: Datos de sesión no encontrados.");
                        setIsSubmitting(false);
                        return;
                    }
                    login(sessionData);

                    const userRole = Number(sessionData.rol);
                    console.log("Rol del usuario:", userRole);
                    console.log("Token almacenado en cookies:", document.cookie);

                        switch (userRole) {
                            case 1:
                                window.location.href = 'http://localhost/Adso/administrador/inicio.php'; // Página externa
                                break;
                            case 2:
                                window.location.href = 'http://localhost/Adso/recursos%20humanos/inicio.php'; // Página externa
                                break;
                            case 3:
                                window.location.href = 'http://localhost/Adso/empleados/inicio.php'; // Página externa
                                break;
                            case 4:
                                window.location.href = 'http://localhost/Adso/aspirantes/index.php'; // Página externa
                                break;
                            default:
                                document.cookie = "auth_token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT";  // Destruir la cookie
                                console.error("Rol desconocido:", userRole);
                                window.location.href = 'http://localhost/Adso/sin_usuario/index.php'; 
                                alert("Rol desconocido");
                        }
                        
                } else {
                    alert(serverMessage?.message || "Error en el inicio de sesión");
                    setIsSubmitting(false);
                }
            })
            .catch((error) => {
                console.error("Error al iniciar sesión:", error);
                alert("Error en el inicio de sesión. Intenta de nuevo.");
                setIsSubmitting(false);
            });
    };
    
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div 
                className="row border rounded-4 p-3 bg-white shadow box-area"
                style={{ width: '930px', boxShadow: '0 6px 25px 10px rgba(0, 0, 0, 0.7)' }}
            >
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column"
                    style={{ background: '#103cbe' }}
                >
                    <div className="featured-image">
                        <img 
                            src={imagen} 
                            alt="Imagen contenedor"
                            className="img-fluid"
                            style={{ width: '250px' }}            
                        />
                        <p className="text-white fs-4">
                            Bienvenidos al software GestorPlus para la frayette
                        </p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <p>Bienvenido otra vez</p>
                            <p>Estamos felices de volver a ver</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Número de documento"
                                    name="num_doc"
                                    value={formData.num_doc}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Contraseña"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <button 
                                    className="btn btn-lg btn-primary w-100 fs-6"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Iniciando Sesión..." : "Iniciar sesión"}                       
                                </button>
                                <button 
                                    className="btn btn-lg btn-primary w-100 fs-6 mt-4"
                                    type="button"
                                    onClick={() => navigate('/Registro')}
                                >
                                    No tengo cuenta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
