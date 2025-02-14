import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "@/services/productService";
import toast from "react-hot-toast";

import { TProduct } from "@/types/product.type";
import ProductForm from "@/components/organisms/ProductForm/ProductForm";


const ProductDetailPage = () => {
  const { productId } = useParams();
  const [, setLoading] = useState(true);
  const [productData, setProductData] = useState<TProduct | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await productService.getProductDetail({ productId: Number(productId) });
        if (response.success && response.result) {
          setProductData(response.result.data);
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch {
        toast.error("An error occurred while fetching product details");
      }
    };
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const updateProduct = async (data: TProduct) => {
    setLoading(true);
    try {
      const response = await productService.updateProduct(data as TProduct);
      setLoading(false);
      if (response.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(response?.result?.message || "Failed to update product");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("An error occurred while updating the promotion");
    }
  }
  return (
    <div>
      {!productData ? (
        <div>No data...</div>
      ) : (
        <ProductForm
          mode="update"
          initialData={productData}
          onSubmit={(values) =>
            updateProduct({
              ...productData,
              ...values,
              productId: Number(productData?.productId) || 0
            })
          }
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
