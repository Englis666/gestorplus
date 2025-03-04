import React, { useEffect } from "react";
import axios from "axios";

const TablaEntrevistas = () => {

    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get("http://192.168.115.207/gestorplus/backend/", {
                    params: { action: "obtenerEntrevistas" },
                });
                const data = response.data.Entrevista;
                setEntrevistas(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Hubo un problema al cargar las entrevistas");
            } finally {
                setLoading(false);
            }
        };
        fetchEntrevistas();
    }, []);

    const enviarAsistencia = async (asistencia, identrevista) => {
        try {
            await axios.post("htpp://192.168.115.207/gestorplus/backend/", {
                action: asistencia ? "asistenciaConfirmada" : "asistenciaNoconfirmada",
                data: { identrevista }
            });
        } catch (err) {
            console.error("Error al actualizar la asistencia", err);
            setError("Hubo un problema al corroborar la asistencia");
        }
    };

    return (
        <View>

        </View>
    )

}
