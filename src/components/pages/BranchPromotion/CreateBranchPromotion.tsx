import { useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import branchPromotionService from "@/services/branchPromotionService";
import promotionService from "@/services/promotionService";
import toast from "react-hot-toast";
import { TBranchPromotion } from "@/types/branchPromotion.type";
import { TPromotion } from "@/types/promotion.type";
import { useTranslation } from "react-i18next";

const { Option } = Select;

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
}
interface PromotionFormValues {
  promotionId: number;
  status: string;
  stockQuantity: number;
}

const AddPromotionModal: React.FC<AddPromotionModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // Hook để sử dụng i18next
  const [form] = Form.useForm();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [availablePromotions, setAvailablePromotions] = useState<{
    promotionId: number;
    promotionName: string;
  }[]>([]);

  useEffect(() => {
    if (isOpen && branchId) {
      fetchAvailablePromotions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, branchId]);

  const fetchAvailablePromotions = async () => {
    try {
      setLoading(true);

      const allPromotionsResponse = await promotionService.getAllPromotion({ page: 1, pageSize: 100 });

      const branchPromotionsResponse = await branchPromotionService.getAllBranchPromotion({ branchId, page: 1, pageSize: 100 });

      if (allPromotionsResponse?.success && branchPromotionsResponse?.success) {
        const allPromotions = allPromotionsResponse.result?.data || [];
        const branchPromotions = branchPromotionsResponse.result?.data || [];
        const branchPromotionIds = new Set(branchPromotions.map((bp: TBranchPromotion) => bp.promotion.promotionId));
        const availablePromotions = allPromotions.filter((promo: TPromotion) => !branchPromotionIds.has(promo.promotionId));

        setAvailablePromotions(availablePromotions);
      } else {
        toast.error(t("fetchPromotionError")); // Sử dụng khóa dịch
      }
    } catch {
      toast.error(t("fetchPromotionError")); // Sử dụng khóa dịch
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PromotionFormValues) => {
    try {
      if (branchId === null) {
        toast.error(t("invalidBranchId")); // Sử dụng khóa dịch
        return;
      }

      setLoading(true);

      const response = await branchPromotionService.createBranchPromotion({
        promotionId: values.promotionId,
        branchId: branchId,
        status: "Active",
        stockQuantity: values.stockQuantity,
      });

      if (response?.success) {
        toast.success(t("promotionAddedSuccess")); // Sử dụng khóa dịch
        onClose();
        form.resetFields();
      } else {
        toast.error(response.result?.message || t("addPromotionError")); // Sử dụng khóa dịch
      }
    } catch {
      toast.error(t("addPromotionError")); // Sử dụng khóa dịch
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("addPromotionToBranch")} // Sử dụng khóa dịch
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("selectPromotion")} // Sử dụng khóa dịch
          name="promotionId"
          rules={[{ required: true, message: t("selectPromotionRequired") }]} // Sử dụng khóa dịch
        >
          <Select placeholder={t("selectPromotionPlaceholder")}> {/* Sử dụng khóa dịch */}
            {availablePromotions.map((promotion) => (
              <Option key={promotion.promotionId} value={promotion.promotionId}>
                {promotion.promotionName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t("stockQuantity")} // Sử dụng khóa dịch
          name="stockQuantity"
          rules={[{ required: true, message: t("stockQuantityRequired") }]} // Sử dụng khóa dịch
        >
          <Input type="number" placeholder={t("enterStockQuantity")} /> {/* Sử dụng khóa dịch */}
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>{t("cancel")}</Button> {/* Sử dụng khóa dịch */}
          <Button type="primary" htmlType="submit" loading={loading} className="bg-[#516d19]">
            {t("addPromotion")} {/* Sử dụng khóa dịch */}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPromotionModal;
