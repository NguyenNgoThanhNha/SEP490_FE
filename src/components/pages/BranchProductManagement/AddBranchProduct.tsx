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
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [availableProduct, setAvailableProducts] = useState<{
    productId: number; productName: string
  }[]>([]);

  useEffect(() => {
    if (isOpen && 1) {
      fetchAvailableProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, 1]);

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
        toast.error("Failed to fetch product.");
      }
    } catch {
      toast.error("Failed to fetch product.");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      const response = await branchProductService.createBranchProduct({
        productId: values.productId,
        branchId: 1,
        status: values.status,
        stockQuantity: values.stockQuantity,
      });

      if (response?.success) {
        toast.success("product added successfully!");
        onClose();
        form.resetFields();
        onProductAdded();
      } else {
        toast.error(response.result?.message || "Failed to add product.");
      }
    } catch {
      toast.error("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("addProductToBranch")}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Select Product" name="productId" rules={[{ required: true }]}>
          <Select placeholder="Select a product">
            {availableProduct.map((product) => (
              <Option key={product.productId} value={product.productId}>
                {product.productName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Stock Quantity" name="stockQuantity" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter stock quantity" />
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" className="bg-[#516D19]" htmlType="submit" loading={loading}>
            Add Product
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
