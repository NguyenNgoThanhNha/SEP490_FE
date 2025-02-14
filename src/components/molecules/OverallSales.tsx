import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

type SalesData = {
  name: string; 
  Services: number;
  Products: number; 
};

const data: SalesData[] = [
  { name: "Apr 25", Services: 10000, Products: 8000 },
  { name: "Apr 26", Services: 14000, Products: 10000 },
  { name: "Apr 27", Services: 16000, Products: 12000 },
  { name: "Apr 28", Services: 13000, Products: 9000 },
  { name: "Apr 29", Services: 15000, Products: 11000 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const services = payload.find((item) => item.dataKey === "Services")?.value || 0;
    const products = payload.find((item) => item.dataKey === "Products")?.value || 0;

    return (
      <div className="bg-white shadow-md rounded p-2 text-sm">
        <p>{`Services: $${services.toLocaleString()}`}</p>
        <p>{`Products: $${products.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

const OverallSales: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 ">
      <h2 className="text-lg font-semibold mb-4">Overall Sales</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Services" stackId="stack1" fill="rgb(52, 202, 165)" />
          <Bar dataKey="Products" stackId="stack1" fill="rgb(184, 231, 22)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverallSales;
