import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";

const Navbar = () => {
    const { logout, user } = useUser();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const token = getCookie("auth_token");

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: { action: "obtenerNotificacionesAspirante" },
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Estructura de respuesta:", response.data);

            setNotifications(response.data.Notificaciones || []);
        } catch (error) {
            console.error("Error al obtener las notificaciones:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const handleLogout = () => {
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        logout();
        navigate("/");
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand text-primary">Gestor Plus</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="nav-link btn btn-primary" onClick={() => navigate("/")}>Inicio</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-primary" onClick={() => navigate("/aspirante/trabajo")}>
                                    Todos los trabajos
                                </button>
                            </li>

                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-primary" onClick={() => navigate("/aspirante/MisPostulaciones")}>
                                            Mis Postulaciones
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-primary" onClick={handleLogout}>
                                            Cerrar sesión
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-primary">{user.num_doc}</button>
                                    </li>
                                    <li className="nav-item position-relative">
                                        <button className="nav-link btn btn-light position-relative" onClick={toggleNotifications}>
                                            <i className="material-icons">notifications</i>
                                            {notifications.length > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>
                                        {showNotifications && (
                                            <div className="dropdown-content position-absolute bg-white shadow-lg rounded p-3 mt-2"
                                                style={{ width: "250px", right: "0", zIndex: "1000", border: "1px solid #ddd" }}>
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <div key={index} className="notification-item mb-2">
                                                            <p><strong>{notification.descripcionNotificacion}</strong></p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No tienes notificaciones nuevas.</p>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <button className="nav-link btn btn-primary" onClick={() => navigate("/login")}>
                                        Iniciar Sesión
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
