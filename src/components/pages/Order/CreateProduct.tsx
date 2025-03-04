import { useState } from "react";
import ProductForm from "@/components/organisms/ProductForm/ProductForm";
import { ProductType } from "@/schemas/productSchema";
import productService from "@/services/productService";
import toast from "react-hot-toast";


const CreateProductForm = () => {
  const [, setLoading] = useState<boolean>(false);

  const createProduct = async (data: ProductType) => {
    setLoading(true);
    try {
      const response = await productService.createProduct({
        ...data,
        images: data.images || [] 
      });
      if (response.success) {
        toast.success("Product created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create product");
      }
    } catch {
      toast.error("An error occurred while creating the promotion");
    }
  }

  return (
    <div>
      <ProductForm
        mode="create"
        onSubmit={(values) => createProduct(values)}
      />
    </div>
  );
};

export default CreateProductForm;
