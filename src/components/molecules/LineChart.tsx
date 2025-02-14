import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DataPoint = {
  month: string; 
  loyal: number; 
  new: number;
  unique: number; 
};

const LineChartRecharts: React.FC = () => {
  const chartData: DataPoint[] = [
    { month: "Jan", loyal: 200, new: 100, unique: 50 },
    { month: "Feb", loyal: 250, new: 150, unique: 75 },
    { month: "Mar", loyal: 300, new: 200, unique: 100 },
    { month: "Apr", loyal: 350, new: 250, unique: 125 },
    { month: "May", loyal: 400, new: 300, unique: 150 },
    { month: "Jun", loyal: 450, new: 350, unique: 175 },
    { month: "Jul", loyal: 500, new: 400, unique: 200 },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 pb-28">
      <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="loyal"
            stroke="rgba(34, 197, 94, 1)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="new"
            stroke="rgba(244, 63, 94, 1)" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="unique"
            stroke="rgba(59, 130, 246, 1)" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartRecharts;
