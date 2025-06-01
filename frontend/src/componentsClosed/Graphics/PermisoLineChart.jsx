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

const PermisosLineChart = ({ data }) => (
  <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 10 }}>
    <div className="card-body">
      <h5 className="mb-3 text-center text-primary">Permisos por Mes</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cantidad"
            stroke="#1976d2"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PermisosLineChart;
