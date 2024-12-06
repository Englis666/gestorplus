import React from "react";
import {useNavigate} from 'react-router-dom';
import { useUser } from "../context/userContext";

const Navbar = () => {
    const { user , logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    console.log(user);  

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                    <a className="navbar-brand blue" >Gestor Plus</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link">Inicio</a>
                            </li>
                            <li className="nav-item">
                                <a 
                                className="nav-link btn btn-primary" 
                                onClick={() => navigate("/aspirante/trabajo")}
                                >
                                        Todos los trabajos
                                </a>
                            </li>
                                            
                            {user ? (
                                <>
                                    <li>
                                        <button className="nav-link btn btn-primary" onClick={handleLogout}>
                                            Cerrar sesión
                                        </button>
                                    </li>
                                    <li>
                                        <button className="nav-link btn btn-primary" style={{ cursor: 'pointer' }}>
                                            {user.nombres} 
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Iniciar Sesión</a>
                                </li>
                            )}
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}


export default Navbar;
