import React, { useEffect, useState } from "react";
import RechartsPieChart from "@/components/molecules/PieChart";
import orderService from "@/services/orderService";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
interface OrderTypeCount {
  orderType: string;
  amount: number;
}

interface OrderResponse {
  success: boolean;
  result?: {
    message?: string;
    orderTypeCounts?: OrderTypeCount[];
  };
}


const OrderPieChart = () => {
  const { t } = useTranslation();
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  const fetchOrderData = async () => {
    try {
      const response = await orderService.getOrderByOrderType() as OrderResponse;
      if (response.success) {
        const orderTypeCounts = response.result?.orderTypeCounts || [];
        const chartLabels = orderTypeCounts.map((item: OrderTypeCount) => t(item.orderType));
        const chartData = orderTypeCounts.map((item: OrderTypeCount) => item.amount);

        setLabels(chartLabels);
        setData(chartData);
      } else {
        toast.error(response.result?.message || t("fetchError"));
      }
    } catch {
      toast.error(t("apiError"));
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <RechartsPieChart
        title={t("orderTypeDistribution")}
        labels={labels}
        data={data}
      />
    </div>
  );
};

export default OrderPieChart;
