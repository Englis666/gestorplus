import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 6,
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          fontSize: 14,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          Fecha: {new Date(label).toLocaleDateString()}
        </p>
        {payload.map((item) => (
          <p key={item.dataKey} style={{ color: item.color, margin: "4px 0" }}>
            {item.dataKey}: {item.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const AusenciasChart = ({ ausencias }) => {
  const agrupadoPorFecha = {};

  ausencias.forEach(({ fechaInicio, justificada }) => {
    if (!agrupadoPorFecha[fechaInicio]) {
      agrupadoPorFecha[fechaInicio] = {
        fecha: fechaInicio,
        Justificada: 0,
        Rechazada: 0,
        "En Proceso": 0,
      };
    }

    if (justificada === true || justificada === "Justificada") {
      agrupadoPorFecha[fechaInicio].Justificada++;
    } else if (justificada === false || justificada === "Rechazada") {
      agrupadoPorFecha[fechaInicio].Rechazada++;
    } else {
      agrupadoPorFecha[fechaInicio]["En Proceso"]++;
    }
  });

  const data = Object.values(agrupadoPorFecha).sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  return (
    <div
      style={{
        width: "100%",
        height: 420,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: 20,
          fontWeight: "700",
          color: "#333",
          textAlign: "center",
          fontSize: 24,
        }}
      >
        Estado de Ausencias por Fecha
      </h2>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 40, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
          <XAxis
            dataKey="fecha"
            tickFormatter={(tick) =>
              new Date(tick).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fill: "#666", fontWeight: "600", fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
            angle={-40}
            textAnchor="end"
            height={60}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#666", fontWeight: "600", fontSize: 12 }}
            width={40}
            domain={[0, "dataMax + 2"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 14, fontWeight: "600" }}
          />
          <Line
            type="monotone"
            dataKey="Justificada"
            stroke="#28a745"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="Rechazada"
            stroke="#dc3545"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="En Proceso"
            stroke="#ffc107"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AusenciasChart;
