import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import logo from "../assets/Gestorplus.png"; 
import "./css/Navbar.css"

const Navbar = () => {
    const { logout, user } = useUser();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerNotificacionesAspirante" },
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(response.data.data || []);
            } catch (error) {
                console.error("Error al obtener las notificaciones:", error);
            }
        };

        if (user) fetchNotifications();
    }, [user]);

    const handleLogout = () => {
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        logout();
        navigate("/");
    };

    return (
        <header className="navbar-modern position-fixed top-0 w-100 d-flex align-items-center justify-content-between px-4 py-2">
            <div
                className="d-flex align-items-center gap-2 cursor-pointer animate__animated animate__fadeInLeft"
                onClick={() => navigate("/")}
                style={{ textDecoration: "none" }}
                >
                <img
                    src={logo}
                    alt="Gestorplus Logo"
                    style={{ width: "75px", height: "75px", borderRadius: "3px" }}
                />
                <span
                    className="fw-bold text-dark"
                    style={{ fontSize: "1.5rem", fontFamily: "Poppins, sans-serif" }}
                >
                    Gestorplus
                </span>
                </div>
            <div className="d-flex align-items-center gap-3">
                <button className="btn-modern btn-primary" onClick={() => navigate("/")}>Inicio</button>
                <button className="btn-modern" onClick={() => navigate("/aspirante/trabajo")}>Trabajos</button>

                {user && (
                    <>
                        <button className="btn-modern" onClick={() => navigate("/aspirante/MisPostulaciones")}>Postulaciones</button>
                        <button className="btn-modern" onClick={() => navigate("/Perfil")}>Perfil</button>

                        <div className="position-relative">
                            <button
                                className="btn btn-light rounded-circle p-2"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="material-icons text-primary">notifications</i>
                                {notifications.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="notification-box position-absolute end-0 mt-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((n, i) => (
                                            <div key={i} className="notification-item">
                                                {n.descripcionNotificacion}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="notification-item text-muted">No hay notificaciones nuevas.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                            {user.num_doc}
                        </span>
                        <button className="btn-modern bg-danger" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </>
                )}

                {!user && (
                    <button className="btn-modern" onClick={() => navigate("/login")}>
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
