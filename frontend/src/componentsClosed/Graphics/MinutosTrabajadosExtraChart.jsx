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

const MinutosTrabajadosExtraChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <h4 className="text-center">Minutos por Empleado</h4>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4 className="text-center">Minutos por Empleado</h4>
      <ResponsiveContainer>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombres" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="minutos_extra"
            name="Minutos Extra"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="minutos_trabajados"
            name="Minutos Trabajados"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MinutosTrabajadosExtraChart;
