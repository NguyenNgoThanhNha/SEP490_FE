import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { TBranchProduct } from "@/types/branchProduct.type";
import branchProductService from "@/services/branchProductService";
import BranchProductForm from "@/components/organisms/BranchProductForm/BranchProductForm";
import { Loader2 } from "lucide-react";

const BranchProductDetail = () => {
    const { productBranchId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [branchProduct, setBranchProduct] = useState<TBranchProduct | null>(null);
    console.log("productBranchId", productBranchId, typeof productBranchId);

    useEffect(() => {
        const fetchBranchProductDetail = async () => {
            if (!productBranchId) return;

            setLoading(true);
            try {
                const response = await branchProductService.getBranchProductDetail(Number(productBranchId))
                if (response.success && response.result) {
                    setBranchProduct(response.result.data);
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

        fetchBranchProductDetail();
    }, [productBranchId]);

    const handleUpdate = async (values: Partial<TBranchProduct>) => {
        if (!branchProduct) return;

        setLoading(true);
        try {
            const response = await branchProductService.updateBranchProduct({
                ...branchProduct,
                ...values,
                productBranchId: branchProduct.id,
            });

            if (response.success) {
                toast.success("Branch product updated successfully");
                setBranchProduct((prev) => ({
                    ...prev!,
                    ...values,
                    product: {
                      ...prev!.product,
                      ...values.product,
                    },
                  }));
            } else {
                toast.error(response?.result?.message || "Failed to update branch product");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating branch product");
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
    {!loading && !branchProduct && <div>No branch product data found.</div>}

    {branchProduct && (
      <div>
       

        <BranchProductForm
          initialData={{
            name: branchProduct.product?.productName ?? "",
            description: branchProduct.product?.productDescription ?? "",
            price: branchProduct.product?.price ?? 0,
            dimension: branchProduct.product?.dimension ?? "",
            status: branchProduct.status,
            stockQuantity: branchProduct.stockQuantity,
            skinTypeSuitable: branchProduct.product.skinTypeSuitable ?? ""
          }}
          onSubmit={(values) => handleUpdate(values)}
        />
      </div>
    )}
  </div>
);

};

export default BranchProductDetail;
