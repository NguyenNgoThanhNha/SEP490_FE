import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { TBranch } from "@/types/branch.type";
import branchService from "@/services/branchService";
import BranchForm from "@/components/organisms/BranchForm/BranchForm";

const BranchDetailPage = () => {
  const { branchId } = useParams();
  const [, setLoading] = useState(true);
  const [branchData, setBranchData] = useState<TBranch| null>(null);

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await branchService.getBranchById(Number(branchId));
        if (response.success && response.result) {
          setBranchData(response.result.data);
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch {
        toast.error("An error occurred while fetching product details");
      }
    };
    if (branchId) {
      fetchBranchDetails();
    }
  }, [branchId]);

  const updateProduct = async (data: TBranch) => {
    setLoading(true);
    try {
      const response = await branchService.updateBranch(data as TBranch);
      setLoading(false);
      if (response.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(response?.result?.message || "Failed to update product");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while updating the promotion");
    }
  }
  return (
    <div>
      {!branchData ? (
        <div>No data...</div>
      ) : (
        <BranchForm
          mode="update"
          initialData={{
            ...branchData,
            status: branchData.status as "Active" | "Inactive" | "Pending",
          }}
          onSubmit={(values) =>
            updateProduct({
              ...branchData,
              ...values,
              branchId: Number(branchData?.branchId) || 0
            })
          }
        />
      )}
    </div>
  );
};

export default BranchDetailPage;
