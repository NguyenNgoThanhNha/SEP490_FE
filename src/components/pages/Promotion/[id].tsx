import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import promotionService from "@/services/promotionService";
import PromotionForm from "@/components/organisms/Promotion/PromotionForm";
import { TPromotion } from "@/types/promotion.type";

export const PromotionDetail = () => {
  const { promotionId } = useParams();
  const [promotionData, setPromotionData] = useState<TPromotion | null>(null);
  const [, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const response = await promotionService.getPromotionDetail({ promotionId: Number(promotionId) });
        if (response.success && response.result) {
          setPromotionData(response.result.data);
        } else {
          toast.error("Failed to fetch promotion details");
        }
      } catch {
        toast.error("An error occurred while fetching promotion details");
      }
    };

    if (promotionId) {
      fetchPromotionDetails();
    }
  }, [promotionId]);

  const updatePromotionApi = async (data: TPromotion) => {
    setLoading(true);
    try {
      const response = await promotionService.updatePromotion(data as TPromotion);


      setLoading(false);
      if (response.success) {
        toast.success("Promotion updated successfully");
      } else {
        toast.error(response?.result?.message || "Failed to update promotion");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while updating the promotion");
    }
  };

  return (
    <div>
      {!promotionData ? (
        <div>Loading...</div>
      ) : (
        <PromotionForm
          mode="update"
          initialData={promotionData}
          onSubmit={(values) =>
            updatePromotionApi({
              ...promotionData,
              ...values,
              promotionId: Number(promotionData?.promotionId) || 0,
              promotionName: promotionData?.promotionName || values.promotionName, 
            })
          }
        />
      )}
    </div>
  );
};
