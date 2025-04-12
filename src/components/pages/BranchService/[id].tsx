import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { TBranchService } from "@/types/branchService.type";
import serviceBranchService from "@/services/serviceBranchService";
import BranchServiceForm from "@/components/organisms/BranchServiceForm/BranchServiceForm";

const BranchServiceDetail = () => {
    const { branchServiceId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [branchService, setBranchService] = useState<TBranchService| null>(null);
    console.log("branchServiceId", branchServiceId, typeof branchServiceId);

    useEffect(() => {
        const fetchBranchServiceDetail = async () => {
            if (!branchServiceId) return;

            setLoading(true);
            try {
                const response = await serviceBranchService.getBranchServiceDetail(Number(branchServiceId))
                if (response.success){
                    setBranchService(response.data);
                } else {
                    toast.error("Failed to fetch branch product data.");
                }
            } catch (error) {
                console.error("Error fetching branch product:", error);
                toast.error("Something went wrong while fetching branch product.");
            } finally {
                setLoading(false);
            }
        };

        fetchBranchServiceDetail();
    }, [branchServiceId]);

    const handleUpdate = async (values: Partial<TBranchService>) => {
        if (!branchService) return;

        setLoading(true);
        try {
            const response = await serviceBranchService.updateBranchService({
                ...branchService,
                ...values,
                serviceBranchId: branchService.id,
            });

            if (response.success) {
                toast.success("Branch service updated successfully");
                setBranchService((prev) => ({
                    ...prev!,
                    ...values,
                    service: {
                      ...prev!.service,
                      ...values.service,
                    },
                  }));
            } else {
                toast.error(response?.result?.message || "Failed to update branch service");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating branch service");
        } finally {
            setLoading(false);
        }
    };

  return (
  <div className="p-4">
    {loading && (
      <div className="flex justify-center items-center gap-2 text-muted-foreground mb-4">
        <Loader2 className="animate-spin h-4 w-4" />
        Loading...
      </div>
    )}
    {!loading && !branchService && <div>No branch service data found.</div>}

    {branchService && (
      <div>
       

        <BranchServiceForm
          initialData={{
            name: branchService.service?.name ?? "",
            description: branchService.service?.description ?? "",
            price: branchService.service?.price ?? 0,
            duration: branchService.service?.duration?? "",
            status: branchService.status,
            steps: branchService.service.steps ?? ""
          }}
          onSubmit={(values) => handleUpdate(values)}
        />
      </div>
    )}
  </div>
);

};

export default BranchServiceDetail;
