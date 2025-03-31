import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { jwtDecode } from "jwt-decode";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Grafica = () => {
  const [totalEntradas, setTotalEntradas] = useState(0); 
  const [totalAusencias, setTotalAusencias] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };
    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();  
        if (isTokenExpired) {
          console.error("El token ha expirado.");
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }
        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const action = (() => {
          switch (Rol){
            case "1":
              return "obtenerTodasLasEstadisticas";
            case "2":
              return "obtenerTodasLasEstadisticas";
            case "3": 
            return "obtenerTotalEstadisticas";
            default:
              console.error("El rol no es valido");
              setError("Rol no reconocido");
              setLoading(false);
              return null;
            }
        })();

        if (!action) return;


        axios.get('http://localhost/gestorplus/backend/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { action},
        })
        .then(response => {
          const { totalEntradas, totalAusencias } = response.data; 
          setTotalEntradas(totalEntradas);
          setTotalAusencias(totalAusencias);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener las estadísticas:', err);
          setError('Hubo un problema al cargar las estadísticas.');
          setLoading(false);
        });
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setError('Token inválido o malformado.');
        setLoading(false);
      }
    } else {
      setError("No se encontró el token.");
      setLoading(false);
    }

  }, []);  

  if (loading) {
    return <div>Cargando gráfico...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Datos para la gráfica
  const data = {
    labels: ["Estadísticas"], 
    datasets: [
      {
        label: "Ausencias",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        yAxisID: "y",
        data: [totalAusencias], 
      },
      {
        label: "Entradas de trabajo",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y1",
        data: [totalEntradas], 
      },
    ],
  };

  // Opciones para la gráfica
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Control de Ausencias y Entradas de trabajo",
      },
      tooltip: {  
        callbacks: {
          label: (tooltipItem) => `Cantidad: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          max: Math.max(totalAusencias, totalEntradas),
          stepSize: 1,
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        ticks: {
          max: Math.max(totalAusencias, totalEntradas),
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="card shadow-lg border-0 mb-5" style={{ borderRadius: "15px", width: "500px", height: "400px", overflow: "hidden" }}>
        <div className="card-body p-4">
          <h5 className="text-center mb-4" style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#333" }}>
            Gráfica de Ausencias y Control de Entradas al Trabajo
          </h5>
          <div className="chart-container" style={{ position: "relative", height: "400px"}}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafica;
