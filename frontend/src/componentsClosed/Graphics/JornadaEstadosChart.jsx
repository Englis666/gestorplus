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

const JornadaEstadosChart = ({ jornadas }) => {
  const agrupado = {};

  jornadas.forEach(({ fecha, estadoJornada }) => {
    if (!agrupado[fecha]) {
      agrupado[fecha] = {
        fecha,
        Corroborada: 0,
        Rechazada: 0,
        Pendiente: 0,
      };
    }

    if (estadoJornada === "Jornada Corroborada") {
      agrupado[fecha].Corroborada++;
    } else if (estadoJornada === "Jornada rechazada") {
      agrupado[fecha].Rechazada++;
    } else {
      agrupado[fecha].Pendiente++;
    }
  });

  const data = Object.values(agrupado).sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="Corroborada"
            stroke="#28a745"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Rechazada"
            stroke="#dc3545"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Pendiente"
            stroke="#ffc107"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JornadaEstadosChart;
