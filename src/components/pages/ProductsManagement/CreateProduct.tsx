import { useState } from "react";
import ProductForm from "@/components/organisms/ProductForm/ProductForm";
import { ProductType } from "@/schemas/productSchema";
import productService from "@/services/productService";
import toast from "react-hot-toast";

const CreateProductForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const createProduct = async (data: ProductType) => {
    setLoading(true);
    try {
      const formData = new FormData();
console.log('====================================');
console.log(data.price);
console.log('====================================');
      // Append form fields
      formData.append("ProductName", data.productName);
      formData.append("ProductDescription", data.productDescription);
      formData.append("Dimension", data.dimension);
      formData.append("price", data.price.toString());
      formData.append("volume", data.volume.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("discount", data.discount.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("companyId", data.companyId.toString());
      formData.append("skintypesuitable", data.skintypesuitable);

      // Append image (only first one if multiple)
      if (data.images && data.images.length > 0) {
        formData.append("Image", data.images[0]); // backend chỉ nhận 1 ảnh
      }

      // ✅ Gọi API và truyền formData
      const response = await productService.createProduct(formData);

      if (response?.success) {
        toast.success("Product created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An error occurred while creating the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductForm
        mode="create"
        onSubmit={(formData: FormData) => createProduct(formData)}
        loading={loading}
      />
    </div>
  );
};

export default CreateProductForm;
    