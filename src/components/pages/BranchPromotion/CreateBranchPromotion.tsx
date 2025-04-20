import { useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import branchPromotionService from "@/services/branchPromotionService";
import promotionService from "@/services/promotionService";
import toast from "react-hot-toast";
import { TBranchPromotion } from "@/types/branchPromotion.type";
import { TPromotion } from "@/types/promotion.type";

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
  const [form] = Form.useForm();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [availablePromotions, setAvailablePromotions] = useState<{
    promotionId: number; promotionName: string
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
        toast.error("Failed to fetch promotions.");
      }
    } catch {
      toast.error("Failed to fetch promotions.");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (values: PromotionFormValues) => {
    try {
      if (branchId === null) {
        toast.error("Branch ID is invalid.");
        return;
      }

      setLoading(true);

      const response = await branchPromotionService.createBranchPromotion({
        promotionId: values.promotionId,
        branchId: 1,
        status: "Active",
        stockQuantity: values.stockQuantity,
      });

      if (response?.success) {
        toast.success("Promotion added successfully!");
        onClose();
        form.resetFields();
      } else {
        toast.error(response.result?.message || "Failed to add promotion.");
      }
    } catch {
      toast.error("Error adding promotion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Promotion to Branch"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Select Promotion" name="promotionId" rules={[{ required: true }]}>
          <Select placeholder="Select a promotion">
            {availablePromotions.map((promotion) => (
              <Option key={promotion.promotionId} value={promotion.promotionId}>
                {promotion.promotionName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Stock Quantity" name="stockQuantity" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter stock quantity" />
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-[#516d19]">
            Add Promotion
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPromotionModal;
