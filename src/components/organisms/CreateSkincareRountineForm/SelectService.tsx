import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/atoms/ui/form";
import { MultiSelect } from "@/components/molecules/MultiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Button } from "@/components/atoms/ui/button";
import productService from "@/services/productService";
import serviceService from "@/services/serviceService";
import { TProduct } from "@/types/product.type";
import { TService } from "@/types/serviceType";

function ServiceProductSelector({ form }: { form: any }) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [addedItems, setAddedItems] = useState<{ serviceId: string, productIds: string[] }[]>([]);

  const handleAddService = () => {
    if (selectedService && selectedProducts.length > 0) {
      setAddedItems([...addedItems, { serviceId: selectedService, productIds: selectedProducts }]);
      setSelectedService(null);
      setSelectedProducts([]);
    }
  };

  // Cập nhật lại field value cho form khi addedItems thay đổi
  React.useEffect(() => {
    const serviceIds = addedItems.map(item => item.serviceId);
    const productIds = addedItems.flatMap(item => item.productIds);

    form.setValue('serviceIds', serviceIds);
    form.setValue('productIds', productIds);
  }, [addedItems, form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select service */}
        <div>
          <FormLabel>Chọn dịch vụ</FormLabel>
          <Select
            value={selectedService || ""}
            onValueChange={(value) => setSelectedService(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              {/* Fetch service options */}
              <ServiceOptions />
            </SelectContent>
          </Select>
        </div>

        {/* MultiSelect product */}
        <div>
          <FormLabel>Chọn sản phẩm</FormLabel>
          <MultiSelect
            label="Chọn sản phẩm"
            fetchOptions={async (keyword) => {
              const res = await productService.elasticSearchProduct(keyword);
              return (
                res?.data?.map((p: TProduct) => ({
                  label: p.productName,
                  value: p.productId,
                })) || []
              );
            }}
            selected={selectedProducts}
            onChange={setSelectedProducts}
          />
        </div>
      </div>

      <Button type="button" onClick={handleAddService} disabled={!selectedService || selectedProducts.length === 0} className="rounded-full">
        Thêm dịch vụ
      </Button>

      {/* Hiển thị danh sách đã thêm */}
      {addedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {addedItems.map((item, index) => (
            <div key={index} className="border p-3 rounded-md">
              <p><strong>Dịch vụ:</strong> {item.serviceId}</p>
              <p><strong>Sản phẩm:</strong> {item.productIds.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceOptions() {
  const [services, setServices] = useState<TService[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await serviceService.elasticSearchService("");
      setServices(res?.result?.data || []);
    })();
  }, []);

  return (
    <>
      {services.map((service) => (
        <SelectItem key={service.serviceId} value={service.serviceId}>
          {service.name}
        </SelectItem>
      ))}
    </>
  );
}

export default ServiceProductSelector;
