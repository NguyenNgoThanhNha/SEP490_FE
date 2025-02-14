import { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import serviceService from "@/services/serviceService";
import toast from "react-hot-toast";

import { TService } from "@/types/serviceType";
import ServiceForm from "@/components/organisms/ServiceForm/ServiceForm";

const ServiceDetail = () => {
  const [, setLoading] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<TService | null>(null);
  const { serviceId } = useParams();


  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (serviceId) {
        setLoading(true);
        try {
          const response = await serviceService.getServiceDetail({ serviceId: Number(serviceId) });
          setLoading(false);
          if (response.success && response.result) {
            setServiceData(response?.result.data);
          } else {
            toast.error("Failed to fetch service data.");
          }
        } catch (error) {
          setLoading(false);
          console.error("Error fetching service:", error);
          toast.error("Something went wrong");
        }
      }
    };
    fetchServiceDetail();
  }, [serviceId]);

  const updateService = async (data: TService) => {
    setLoading(true);
    try {
      const response = await serviceService.updateService (data as TService);
      setLoading(false);
      if (response.success) {
        toast.success("Service updated successfully");
      } else {
        toast.error(response?.result?.message || "Failed to update Service");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while updating the promotion");
    }
  }
  return (
    <div>
    {!serviceData ? (
      <div>No data...</div>
    ) : (
      <ServiceForm
        mode="update"
        initialData={serviceData}
        onSubmit={(values) =>
          updateService({
            ...serviceData,
            ...values,
            serviceId: Number(serviceData?.serviceId) || 0
          })
        }
      />
    )}
  </div>
    );
};

export default ServiceDetail;