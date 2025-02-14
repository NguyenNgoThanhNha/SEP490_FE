import ServiceForm from "@/components/organisms/ServiceForm/ServiceForm";
import { ServiceType } from "@/schemas/serviceSchema";
import serviceService from "@/services/serviceService";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateServiceForm = () => {
  const [, setLoading] = useState<boolean>(false);

  const createService = async (data: ServiceType) => {
    setLoading(true);
    
    try {
      const response = await serviceService.createService({
        ...data,
        images: data.images || [] 
      });
      console.log("Form data submitted:", data);

      if (response.success) {
        toast.success("Product created successfully!");
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
