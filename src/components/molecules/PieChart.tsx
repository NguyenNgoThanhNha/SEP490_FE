import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type PieChartProps = {
  title: string;
  subtitle?: string;
  labels: string[];
  data: number[];
};

const RechartsPieChart: React.FC<PieChartProps> = ({ title, subtitle, labels, data }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const COLORS = ["#4A3AFF", "#2D5BFF", "#93AAFD"];
  const HOVER_COLORS = ["#ef4444", "#3b82f6", "#10b981"];
  const total = data.reduce((sum, value) => sum + value, 0);

  const chartData = labels.map((label, index) => ({
    name: label,
    value: data[index],
    color: COLORS[index % COLORS.length],
    hoverColor: HOVER_COLORS[index % HOVER_COLORS.length],
  }));

  return (
    <div className="bg-white shadow-md rounded p-4 flex flex-wrap w-full mx-auto">
      <div className="w-full xl:w-1/2 mb-4 sm:mb-0">
        {subtitle && <h3 className="text-sm text-gray-500 mb-2">{subtitle}</h3>}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <ResponsiveContainer width="100%" height={300} minWidth={200} minHeight={200}>
          <PieChart className="p-2">
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={hoverIndex === index ? entry.hoverColor : entry.color}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-2">
        {chartData.map(({ name, value, color }) => (
          <div key={name} className="flex items-center">
            <div
              style={{ backgroundColor: color }}
              className="w-4 h-4 rounded-full mr-2"
            />
            <span className="font-medium text-sm">
              {name} - {((value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechartsPieChart;
