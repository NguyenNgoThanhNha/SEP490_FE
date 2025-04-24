import orderService from "@/services/orderService";
import { useEffect, useState } from "react";
import { Select } from "antd";
import toast from "react-hot-toast";
import { TBranch } from "@/types/branch.type";
import LineChartRecharts from "@/components/molecules/LineChart";

export const Top3RevenueBranch = () => {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [revenueData, setRevenueData] = useState<{ label: string; value: number }[]>([]);

    const fetchRevenueByBranch = async (month: number, year: number) => {
        try {
            const response = await orderService.top3Revenue(month, year);
            if (response.success) {
                const chartData = response.result?.data.map((branch: TBranch) => ({
                    label: branch.branchName,
                    value: branch.totalRevenue
                }));
                setRevenueData(chartData);
                console.log("Revenue data:", chartData);
            } else {
                toast.error(response.result?.message || "Lỗi khi lấy doanh thu");
            }
        } catch {
            toast.error("Lỗi khi gọi API doanh thu");
        }
    };

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
                        label: `Tháng ${i + 1}`,
                        value: i + 1
                    }))}
                    style={{ width: 120 }}
                />
                <Select
                    value={selectedYear}
                    onChange={(value) => setSelectedYear(value)}
                    options={[2023, 2024, 2025].map((y) => ({ label: `Năm ${y}`, value: y }))}
                    style={{ width: 120 }}
                />
            </div>

            <div className="flex-1">
               <LineChartRecharts/>
            </div>
        </>
    );
};
