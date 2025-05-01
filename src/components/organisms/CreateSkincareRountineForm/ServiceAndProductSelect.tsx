import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { Select, Spin } from "antd";
import { TService } from "@/types/serviceType";
import { TProduct } from "@/types/product.type";
import serviceService from "@/services/serviceService";
import productService from "@/services/productService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type SelectedService = {
  serviceId: number;
  serviceName: string;
  productIds: number[];
};

interface Props {
  onServiceChange: (services: SelectedService[]) => void;
}

export function ServiceAndProductSelect({ onServiceChange }: Props) {
  const [serviceOptions, setServiceOptions] = useState<{ label: string; value: number; data: TService }[]>([]);
  const [fetchingServices, setFetchingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [productOptionsMap, setProductOptionsMap] = useState<Record<number, { label: string; value: number }[]>>({});
  const { t } = useTranslation(); 

  const fetchServices = async (keyword: string) => {
    setFetchingServices(true);
    try {
      const res = await serviceService.elasticSearchService(keyword);
      const data = res?.result?.data || [];
      const options = data.map((s: TService) => ({
        label: s.name,
        value: s.serviceId,
        data: s,
      }));
      setServiceOptions(options);
    } catch (error) {
      console.error("Lỗi khi tìm dịch vụ:", error);
    } finally {
      setFetchingServices(false);
    }
  };

  const fetchProducts = async (keyword: string, serviceId: number) => {
    setFetchingProducts(true);
    try {
      const res = await productService.elasticSearchProduct(keyword);
      const products = res?.data?.map((p: TProduct) => ({
        label: p.productName,
        value: p.productId,
      })) || [];

      setProductOptionsMap((prev) => {
        const updatedMap = {
          ...prev,
          [serviceId]: products,
        };
        return updatedMap;
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tìm kiếm sản phẩm.");
    } finally {
      setFetchingProducts(false);
    }
  };

  const handleAddService = (service: TService) => {
    const exists = selectedServices.some((s) => s.serviceId === service.serviceId);
    if (exists) {
      toast.error("Dịch vụ đã được thêm!");
      return;
    }

    const newService = {
      serviceId: service.serviceId,
      serviceName: service.name,
      productIds: [],
    };
    const updatedServices = [...selectedServices, newService];
    setSelectedServices(updatedServices);
    onServiceChange(updatedServices);
  };

  const handleRemoveService = (serviceId: number) => {
    const updatedServices = selectedServices.filter((s) => s.serviceId !== serviceId);
    setSelectedServices(updatedServices);
    onServiceChange(updatedServices);
  };

  const handleProductChange = (serviceId: number, productIds: number[]) => {
    const updatedServices = selectedServices.map((s) =>
      s.serviceId === serviceId ? { ...s, productIds } : s
    );
    setSelectedServices(updatedServices);
    onServiceChange(updatedServices);
  };

  const resetForm = () => {
    setSelectedServices([]);
    setProductOptionsMap({});
    toast.success("Form đã được reset!");
  };

  return (
    <div className="space-y-6">
      <div>
        <Select
          showSearch
          allowClear
          placeholder={t("searchService")} 
          filterOption={false}
          onSearch={fetchServices}
          notFoundContent={fetchingServices ? <Spin size="small" /> : t("noServiceFound")}
          onSelect={(_, option: { value: number; label: string; data: TService }) => handleAddService(option.data)}
          options={serviceOptions}
          style={{ width: "100%" }}
        />
      </div>

      {selectedServices.length > 0 && (
        <div className="space-y-4">
          {selectedServices.map((service) => (
            <Card key={service.serviceId}>
              <CardHeader>
                <CardTitle>{t("service")}: {service.serviceName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label>{t("applyProducts")}:</label>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder={t("searchAndSelectProducts")} 
                    value={service.productIds}
                    onSearch={(keyword) => {
                      console.log("Search keyword:", keyword);
                      fetchProducts(keyword, service.serviceId);
                    }}
                    onChange={(value) => {
                      console.log("Selected productIds:", value);
                      handleProductChange(service.serviceId, value);
                    }}
                    notFoundContent={fetchingProducts ? <Spin size="small" /> : t("noProductFound")} 
                    options={productOptionsMap[service.serviceId] || []}
                  />
                </div>
                <Button
                  className="mt-2 bg-[#516d19] rounded-full"
                  onClick={() => handleRemoveService(service.serviceId)}
                >
                  {t("removeService")} 
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        className="mt-4 bg-[#516d19] rounded-full"
        onClick={resetForm}
      >
        Hoàn tất
      </Button>
    </div>
  );
}
