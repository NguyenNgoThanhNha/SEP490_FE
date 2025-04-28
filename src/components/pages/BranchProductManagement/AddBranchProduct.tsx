import { useEffect, useState } from "react";
import { Modal, Button, Form, Select, Input } from "antd";
import toast from "react-hot-toast";
import productService from "@/services/productService";
import branchProductService from "@/services/branchProductService";
import { TBranchProduct } from "@/types/branchProduct.type";
import { TProduct } from "@/types/product.type";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";

const { Option } = Select;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  onProductAdded: () => void;
}
interface ProductFormValues {
  productId: number;
  status: string;
  stockQuantity: number;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // Hook để sử dụng i18next
  const [form] = Form.useForm();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [availableProduct, setAvailableProducts] = useState<{
    productId: number;
    productName: string;
  }[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableProducts();
    }
  }, [isOpen]);

  const fetchAvailableProducts = async () => {
    try {
      setLoading(true);

      const allProductResponse = await productService.getAllProduct({ page: 1, pageSize: 100 });
      const productBranchResponse = await branchProductService.getAllBranchProduct(branchId, 1, 100);

      if (allProductResponse?.success && productBranchResponse?.success) {
        const allProduct = allProductResponse.result?.data || [];
        const branchProduct = productBranchResponse.result?.data || [];
        const branchProductId = new Set(branchProduct.map((bp: TBranchProduct) => bp.product.productId));
        const availableProduct = allProduct.filter((promo: TProduct) => !branchProductId.has(promo.productId));
        setAvailableProducts(availableProduct);
      } else {
        toast.error(t("fetchProductError")); // Sử dụng khóa dịch
      }
    } catch {
      toast.error(t("fetchProductError")); // Sử dụng khóa dịch
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      const response = await branchProductService.createBranchProduct({
        productId: values.productId,
        branchId: branchId,
        status: "Active",
        stockQuantity: values.stockQuantity,
      });

      if (response?.success) {
        toast.success(t("productAddedSuccess")); // Sử dụng khóa dịch
        onClose();
        form.resetFields();
        onProductAdded();
      } else {
        toast.error(response.result?.message || t("addProductError")); // Sử dụng khóa dịch
      }
    } catch {
      toast.error(t("addProductError")); // Sử dụng khóa dịch
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("addProductToBranch")} // Sử dụng khóa dịch
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={t("selectProduct")} // Sử dụng khóa dịch
          name="productId"
          rules={[{ required: true, message: t("selectProductRequired") }]} // Sử dụng khóa dịch
        >
          <Select placeholder={t("selectProductPlaceholder")}> {/* Sử dụng khóa dịch */}
            {availableProduct.map((product) => (
              <Option key={product.productId} value={product.productId}>
                {product.productName}
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
          <Button type="primary" className="bg-[#516D19]" htmlType="submit" loading={loading}>
            {t("addProduct")} {/* Sử dụng khóa dịch */}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
