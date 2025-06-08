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
  const step = 10;
  const maxDomain = Math.ceil(maxValue / step) * step;
  const truncate = (str: string, maxLength: number) => 
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  return (
    <div>
    <ResponsiveContainer width="100%" height={400}>
  <BarChart
    layout="vertical"
    data={top10Data}
    margin={{ top: 20, right: 30, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis
      type="number"
      domain={[0, maxDomain]}
      tick={{ fontSize: 14 }}
      tickLine={false}
      axisLine={{ stroke: "#ddd" }}
    />
    <YAxis
      dataKey="name"
      type="category"
      tick={{ fontSize: 14 }}
      tickLine={false}
      axisLine={{ stroke: "#ddd" }}
      width={200}
      tickFormatter={(name) => truncate(name, 20)} 
    />
    <Tooltip
     />
    <Bar dataKey="value" barSize={30} radius={[8, 8, 0, 0]}>
      {top10Data.map((_entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={brightPastelColors[index % brightPastelColors.length]}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};

export default BarChartComponent;
