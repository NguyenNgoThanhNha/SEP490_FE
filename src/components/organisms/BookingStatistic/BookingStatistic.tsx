import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Select } from "antd";
import { RootState } from "@/store";
import appoinmentService from "@/services/appoinmentService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent,CardHeader, CardTitle } from "@/components/atoms/ui/card";

interface MonthlyStatistic {
  month: number;
  totalBookings: number;
  totalServicesBooked: number;
}

interface ChartData {
  month: string;
  totalBookings: number;
  totalServicesBooked: number;
}

export const BookingStatistic = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const { t } = useTranslation();

  const fetchBookingStatistic = async (year: number) => {
    try {
      const response = await appoinmentService.bookingStatistic(branchId, year);
      if (response.success) {
        const monthlyStats: MonthlyStatistic[] = response.result?.data?.monthlyStats || [];
        const formattedData: ChartData[] = monthlyStats.map((item) => ({
          month: `${t("month")} ${item.month}`,
          totalBookings: item.totalBookings,
          totalServicesBooked: item.totalServicesBooked,
        }));
        setChartData(formattedData);
      } else {
        toast.error(response.result?.message || t("error"));
      }
    } catch {
      toast.error(t("error"));
    }
  };

  useEffect(() => {
    fetchBookingStatistic(selectedYear);
  }, [branchId, selectedYear]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={selectedYear}
          onChange={(value) => setSelectedYear(value)}
          options={[2023, 2024, 2025].map((y) => ({
            label: `${t("year")} ${y}`,
            value: y,
          }))}
          style={{ width: 120 }}
        />
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{t("bookingTrend")}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalBookings" fill="#8884d8" name={t("Total Bookings")} radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalServicesBooked" fill="#82ca9d" name={t("Total Services")} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
