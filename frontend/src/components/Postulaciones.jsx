import React, { useEffect, useState } from "react";
import axios from "axios";
import PostulacionIndividual from "./PostulacionIndividual";

const Postulaciones = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const token = getCookie("auth_token");
                if (!token) {
                    setError("No se encontró el token de autenticación.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost/gestorplus/backend/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        action: 'obtenerPostulacionesAspirante',
                    }
                });

                console.log("Respuesta de la API:", response.data);
                
                if (Array.isArray(response.data.data)) {
                    setPostulaciones(response.data.data);
                } else {
                    setPostulaciones([]);
                }
                setLoading(false);
            } catch (error) {
                setError('Error al cargar las postulaciones');
                setLoading(false);
            }
        };

        fetchPostulaciones();
    }, []);

    if (loading) return <div className="text-center mt-5 text-primary fw-bold">Cargando postulaciones...</div>;
    if (error) return <div className="text-center text-danger mt-5">{error}</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center text-primary fw-bold">Mis Postulaciones</h1>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {postulaciones.length > 0 ? (
                    postulaciones.map(postulacion => (
                        <PostulacionIndividual key={postulacion.idpostulacion} postulacion={postulacion} />
                    ))
                ) : (
                    <div className="text-center text-muted">No se encontraron postulaciones.</div>
                )}
            </div>
        </div>
    );
};

export default Postulaciones;