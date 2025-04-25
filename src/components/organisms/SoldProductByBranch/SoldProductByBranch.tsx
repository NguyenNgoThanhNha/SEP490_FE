import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import productService from "@/services/productService";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import BarChartComponent from "@/components/molecules/BarChart";

interface TProductSoldByBranch {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

export const SoldProductByBranch = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const { t } = useTranslation();

  const fetchSoldProductByBranch = async () => {
    try {
      const response = await productService.productSoldByBranch(branchId);
      if (response.success) {
        const formattedData = response.result?.data.items.map((product: TProductSoldByBranch) => ({
          name: product.productName,
          value: product.totalQuantitySold,
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
    fetchSoldProductByBranch();
  }, [branchId]);

  return (
    <div>
      <BarChartComponent data={chartData} />
    </div>
  );
};
