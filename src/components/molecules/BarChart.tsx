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
}

const brightPastelColors = [
  "#A8E6CF", "#FFD3B6", "#FF8B94", "#D1C4E9", "#B2EBF2",
  "#E6EE9C", "#F48FB1", "#CE93D8", "#81D4FA", "#C5E1A5",
];

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  const top10Data = data.slice(0, 10);
  const maxValue = Math.max(...top10Data.map((d) => d.value));
  const step = 5;
  const maxDomain = Math.ceil(maxValue / step) * step;

  return (
    <ResponsiveContainer width="100%" height={top10Data.length * 40}>
      <BarChart
        layout="vertical"
        data={top10Data}
        margin={{ top: 30, right: 30, left: 160, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis
          type="number"
          domain={[0, maxDomain]}
          tick={{ fontSize: 14 }}
          tickLine={false}
          axisLine={{ stroke: "#ccc" }}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 14 }}
          tickLine={false}
          axisLine={{ stroke: "#ccc" }}
          width={200}
        />
        <Tooltip />
        <Bar dataKey="value" barSize={35} radius={[8, 8, 0, 0]}>
          {top10Data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={brightPastelColors[index % brightPastelColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
