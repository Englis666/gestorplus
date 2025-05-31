// src/components/GraficaJornadas.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const JornadaChart = ({ jornadas }) => {
  const dataPorFecha = jornadas.reduce((acc, jornada) => {
    const fecha = jornada.fecha || "Sin Fecha";
    const item = acc.find((i) => i.fecha === fecha);
    if (item) {
      item.cantidad += 1;
    } else {
      acc.push({ fecha, cantidad: 1 });
    }
    return acc;
  }, []);

  // Ordenar por fecha ascendente (opcional)
  dataPorFecha.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={dataPorFecha}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cantidad"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JornadaChart;
