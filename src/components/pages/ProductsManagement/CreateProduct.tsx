import { useState } from "react";
import ProductForm from "@/components/organisms/ProductForm/ProductForm";
import { ProductType } from "@/schemas/productSchema";
import productService from "@/services/productService";
import toast from "react-hot-toast";

const CreateProductForm = () => {
  const [, setLoading] = useState(false);

  const createProduct = async (formData: FormData) => {
    setLoading(true);
  
    try {
      const payload = {
        productName: formData.get("productName")?.toString() || "",
        productDescription: formData.get("productDescription")?.toString() || "",
        price: Number(formData.get("price") || 0),
        quantity: Number(formData.get("quantity") || 0),
        brand: formData.get("brand")?.toString() || "",
        categoryId: Number(formData.get("categoryId") || 0),
        dimension: formData.get("dimension")?.toString() || "",
        images: formData.getAll("images")[0] || new File([], "default"),
        companyId: Number(formData.get("companyId") || 1),
      };
  
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
        onSubmit={(value: FormData)=> createProduct(value)}
      />
    </div>
  );
};

export default CreateProductForm;
    