import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { obtenerEstadisticas } from "../../services/EstadisticasService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Estadisticas = () => {
  const [data, setData] = useState([
    { name: "Actualizaciones", value: 0 },
    { name: "Entradas", value: 0 },
    { name: "Notificaciones", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const { totalJornadas, totalActualizaciones, totalGenerales } =
          await obtenerEstadisticas();

        const totalJornadasNumber = Number(totalJornadas);
        const totalActualizacionesNumber = Number(totalActualizaciones);
        const totalGeneralesNumber = Number(totalGenerales);

        if (
          isNaN(totalJornadasNumber) ||
          isNaN(totalActualizacionesNumber) ||
          isNaN(totalGeneralesNumber)
        ) {
          setError("Datos no válidos en la respuesta.");
        } else {
          setData([
            { name: "Actualizaciones", value: totalActualizacionesNumber },
            { name: "Entradas", value: totalJornadasNumber },
            { name: "Notificaciones", value: totalGeneralesNumber },
          ]);
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center mt-5"
        style={{ height: "300px" }}
        role="status"
        aria-live="polite"
      >
        <div
          className="spinner-border text-primary"
          aria-label="Cargando estadísticas"
        />
      </div>
    );

  if (error)
    return (
      <div
        className="alert alert-danger mt-5 text-center"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </div>
    );

  return (
    <div className="row g-4">
      <div className="col-lg-12 col-md-12">
        <div className="card shadow-sm rounded-3 p-3 h-100">
          <h5 className="card-title mb-3 text-center text-success fw-semibold">
            Distribución en Pie Chart
          </h5>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#82ca9d"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, "Cantidad"]}
                contentStyle={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "14px",
                  color: "#555",
                  flexWrap: "wrap",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
