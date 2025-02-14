import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartDataPoint = {
  label: string; 
  value: number;
};

type ReusableAreaChartProps = {
  title: string; 
  subtitle?: string; 
  showTotal?: boolean; 
  chartData: ChartDataPoint[]; 
  color?: string; 
};

const ReusableAreaChart: React.FC<ReusableAreaChartProps> = ({
  title,
  showTotal = false,
  chartData,
  color = "#4f46e5", 
}) => {
  const total = chartData.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {showTotal && (
          <p className="text-sm font-medium text-gray-600 mt-1">
            Total: {total.toLocaleString()}
          </p>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`${color}33`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusableAreaChart;
