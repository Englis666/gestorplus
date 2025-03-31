import { useState, useEffect } from "react"; // Asegúrate de importar bien los hooks
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthToken = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("auth_token");
        if (!storedToken) {
          setError("Token no encontrado en almacenamiento.");
        } else {
          setToken(storedToken);
        }
      } catch (err) {
        setError("Error al obtener el token.");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, loading, error };
};

export default useAuthToken;
