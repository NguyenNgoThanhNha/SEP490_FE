import orderService from "@/services/orderService";
import { useEffect, useState } from "react";
import { Select } from "antd";
import toast from "react-hot-toast";
import ReusableAreaChart from "@/components/molecules/AreaChart";
import { TBranch } from "@/types/branch.type";
import { useTranslation } from "react-i18next";

export const RevenueByBranch = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState<{ label: string; value: number }[]>([]);
  const { t } = useTranslation();

  const fetchRevenueByBranch = async (month: number, year: number) => {
    try {
      const response = await orderService.revenueByBranch(month, year);
      if (response.success) {
        const chartData = response.result?.data.map((branch: TBranch) => ({
          label: branch.branchName,
          value: branch.totalRevenue,
        }));
        setRevenueData(chartData);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("apiError"));
    }
  };

  const totalRevenue = revenueData.reduce((sum, branch) => sum + branch.value, 0);

  useEffect(() => {
    fetchRevenueByBranch(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          options={Array.from({ length: 12 }, (_, i) => ({
            label: `${t("month")} ${i + 1}`,
            value: i + 1,
          }))}
          style={{ width: 120 }}
        />
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

      <div className="flex-1">
        {revenueData.length > 0 ? (
          <ReusableAreaChart
            title={t("branchRevenueTitle", { month: selectedMonth, year: selectedYear })}
            chartData={revenueData}
            subtitle={`${t("totalRevenue")}: ${totalRevenue.toLocaleString()} VND`}
          />
        ) : (
          <p className="text-center text-gray-500 italic mt-8">
            {t("noDataMessage") || "Không có dữ liệu doanh thu cho tháng này"}
          </p>
        )}
      </div>
    </>
  );
};
