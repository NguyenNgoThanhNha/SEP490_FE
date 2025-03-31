import StaffForm from "@/components/organisms/Employee/EmployeeForm";
import { StaffType } from "@/schemas/staffSchema";
import staffService from "@/services/staffService";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateEmployeePage = () => {
  const [, setLoading] = useState<boolean>(false);
  const createEmployee = async (data: StaffType) => {
    setLoading(true);

    try {
      const response = await staffService.createStaff(data);
      if (response.success) {
        toast.success("Staff created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create staff");
      }
    } catch {
      toast.error("An error occurred while creating the staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StaffForm
        mode="create"
        onSubmit={(values) => createEmployee(values)}
      />
    </div>
  );
};

export default CreateEmployeePage;
