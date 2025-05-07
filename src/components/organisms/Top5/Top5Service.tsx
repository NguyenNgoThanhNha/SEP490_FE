import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import serviceService from "@/services/serviceService";
import TopItemsTable from "@/components/molecules/TopTable";

interface TopService {
  serviceId: number;
  name: string;
  price: number;
  duration: string;
}

const Top5Service = () => {
  const { t } = useTranslation();
  const [topServices, setTopServices] = useState<TopService[]>([]);

  const fetchServiceData = async () => {
    try {
      const response = await serviceService.top5Service();
        setTopServices(response.data);
    } catch {
      toast.error(t("apiError"));
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  const columns = [
    {
        header: t("service"),
        accessor: (item: TopService) => item.name,
    },
    {
        header: t("Price"),
        accessor: (item: TopService) => `${item.price.toLocaleString()} VND`,
    },
    {
        header: t("Duration"),
        accessor: (item: TopService) => item.duration,
    },
];
  return (
    <div className="container mx-auto py-6 px-4">
      {topServices.length > 0 ? (
        <TopItemsTable
          data={topServices}
          columns={columns}
        />
      ) : (
        <p className="text-gray-400">{t("No service data available")}</p>
      )}
    </div>
  );
};

export default Top5Service;
