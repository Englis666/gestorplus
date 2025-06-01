import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const EmpleadosPorCargoBarChart = ({ data }) => (
  <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 10 }}>
    <div className="card-body">
      <h5 className="mb-3 text-center text-primary">Empleados por Cargo</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cargo" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default EmpleadosPorCargoBarChart;
