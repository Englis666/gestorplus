import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { obtenerEstadisticas } from "../services/EstadisticasService";
import { decodedTokenWithRol } from "../utils/Auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Grafica = () => {
  const [totalJornadas, setTotalJornadas] = useState(0);
  const [totalActualizaciones, setTotalActualizaciones] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const rolObtenido = decodedTokenWithRol();
        setRol(rolObtenido);
        const data = await obtenerEstadisticas();
        setTotalJornadas(data.totalJornadas);
        setTotalActualizaciones(data.totalActualizaciones);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <div>Cargando gráfico...</div>;
  if (error) return <div>{error}</div>;

  const data = {
    labels: ["Estadísticas"],
    datasets: [
      {
        label: "Jornadas",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: [totalJornadas],
      },
      {
        label: "Actualizaciones",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [totalActualizaciones],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Estadísticas Globales",
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
          stepSize: 1,
          max: Math.max(totalJornadas, totalActualizaciones) + 1,
        },
      },
    },
  };

  return (
    <div className="container">
      <div
        className="card shadow-lg border-0 mb-5"
        style={{
          borderRadius: "15px",
          width: "500px",
          height: "400px",
          overflow: "hidden",
        }}
      >
        <div className="card-body p-4">
          <h5
            className="text-center mb-4"
            style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#333" }}
          >
            Gráfica de Estadísticas Globales
          </h5>
          <div
            className="chart-container"
            style={{ position: "relative", height: "400px" }}
          >
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafica;
