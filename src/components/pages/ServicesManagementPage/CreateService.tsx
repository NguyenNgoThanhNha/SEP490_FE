import ServiceForm from "@/components/organisms/ServiceForm/ServiceForm";
import { ServiceType } from "@/schemas/serviceSchema";
import serviceService from "@/services/serviceService";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateServiceForm = () => {
  const [, setLoading] = useState<boolean>(false);

  const createService = async (data: ServiceType) => {
    setLoading(true);
    const payload = {
      name: data.name,
      description: data.description,
      price: data.price,
      steps: data.steps || [],
      images:  data.images || [],
      serviceCategoryId: data.serviceCategoryId,
      duration: data.duration,
  }
    try {
      const response = await serviceService.createService(payload);
      if (response.success) {
        toast.success("Service created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create service");
      }
    } catch {
      toast.error("An error occurred while creating the service");
    }
  }

  return (
    <div>
      <ServiceForm
      mode="create"
      onSubmit={(values) => createService(values)}
      />
    </div>
  );
};

export default CreateServiceForm;
