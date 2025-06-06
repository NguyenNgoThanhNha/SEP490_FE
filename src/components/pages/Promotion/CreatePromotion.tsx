import { useState } from "react";
import toast from "react-hot-toast";
import promotionService from "@/services/promotionService";
import PromotionForm from "@/components/organisms/Promotion/PromotionForm";
import { PromotionType } from "@/schemas/promotionSchema";

export const CreatePromotion = () => {
  const [, setLoading] = useState(false);

  const createPromotion = async (data: PromotionType) => {
    setLoading(true);
    const payload = {
      PromotionName: data.promotionName,
      PromotionDescription: data.promotionDescription,
      StartDate: data.startDate,
      EndDate: data.endDate,
      DiscountPercent: data.discountPercent,
      Status: data.status,
    };
    try {
      const response = await promotionService.createPromotion(payload);

      if (response.success) {
        toast.success("Promotion created successfully");
      } else {
        toast.error(response?.result?.message || "Failed to create promotion");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the promotion");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div>
      <PromotionForm
        mode="create"
        onSubmit={(values) => createPromotion(values)} 
      />
    </div>
  );
};
