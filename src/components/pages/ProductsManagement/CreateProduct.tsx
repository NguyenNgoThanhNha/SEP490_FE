import { useState } from "react";
import ProductForm from "@/components/organisms/ProductForm/ProductForm";
import { ProductType } from "@/schemas/productSchema";
import productService from "@/services/productService";
import toast from "react-hot-toast";

const CreateProductForm = () => {
  const [, setLoading] = useState(false);

  const createProduct = async (data: ProductType) => {
    setLoading(true);
      const payload = {
        productName: data.productName,
        productDescription: data.productDescription,
        price: data.price,
        quantity: data.quantity,
        brand: data.brand,
        categoryId: data.categoryId,
        dimension: data.dimension,
        images: data.images?.[0] || new File([], "default"),
        companyId: data.companyId   
    }
    try {
      const response = await productService.createProduct(payload);
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
        onSubmit={(value)=> createProduct(value)}
      />
    </div>
  );
};

export default CreateProductForm;
    