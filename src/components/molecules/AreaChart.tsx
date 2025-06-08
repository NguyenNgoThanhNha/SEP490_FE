import React from "react";
import { useTranslation } from "react-i18next";
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
  chartData: ChartDataPoint[];
  color?: string;
};

const ReusableAreaChart: React.FC<ReusableAreaChartProps> = ({
  title,
  chartData,
  subtitle,
  color = "#516d19",
}) => {
  const { t } = useTranslation();
  const isEmpty = chartData.length === 0;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={false} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`${color}33`}
            strokeWidth={2}
          />

          {isEmpty && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={16}
              fill="#9ca3af"
            >
              {t("noData") || "Không có dữ liệu"}
            </text>
          )}
        </AreaChart>

      </ResponsiveContainer>
    </div>
  );
};

export default ReusableAreaChart;
