import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[]; 
  colors?: string[]; 
}

const defaultColors = [
  "#50E3C2",
  "#F5A623",
  "#D0011B",
  "#B8E986",
  "#BD10E0",
  "#7ED321",
  "#4A90E2",
];

const BarChartComponent: React.FC<BarChartProps> = ({ data, colors = defaultColors }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 14 }}
          tickLine={false}
          axisLine={{ stroke: "#ddd" }}
        />
        <YAxis
          tick={{ fontSize: 14 }}
          tickLine={false}
          axisLine={{ stroke: "#ddd" }}
        />
        <Tooltip />
        <Bar dataKey="value" barSize={40} radius={[8, 8, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
