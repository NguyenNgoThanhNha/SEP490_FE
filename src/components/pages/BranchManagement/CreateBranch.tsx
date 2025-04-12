import BranchForm from "@/components/organisms/BranchForm/BranchForm";
import { BranchType } from "@/schemas/branchSchema";
import branchService from "@/services/branchService";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateBranchPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const CreateBranch = async (data: BranchType) => {
    setLoading(true);
    try {
      const response = await branchService.createBranch(data);
      if (response.success) {
        toast.success("Branch created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create Branch");
      }
    } catch {
      toast.error("An error occurred while creating the Branch");
    }
  }

  return (
    <div>
      <BranchForm
      mode="create"
      onSubmit={CreateBranch}
      loading={loading}
      />
    </div>
  );
};

export default CreateBranchPage;
