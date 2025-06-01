import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#B266FF",
  "#FF6666",
];

const HoraExtraChart = ({ data }) => {
  // data debe ser un array plano
  const datos = Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        nombres: item.nombres || `ID ${item.numDoc || item.num_doc || ""}`,
        horasExtra: Number(item.horasExtra),
      }))
    : [];

  const totalHoras = datos.reduce(
    (acc, curr) => acc + Number(curr.horasExtra),
    0
  );

  if (totalHoras === 0) {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <h4 className="text-center">Distribución de Horas Extra</h4>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[{ name: "Sin horas extra", value: 1 }]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#ccc"
              label
            >
              <Cell fill="#ccc" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h4 className="text-center">Distribución de Horas Extra</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={datos}
            dataKey="horasExtra"
            nameKey="nombres"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {datos.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoraExtraChart;
