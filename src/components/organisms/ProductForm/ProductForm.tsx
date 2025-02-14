import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import { ProductSchema, ProductType } from "@/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ImageUploadOne from "@/components/atoms/ui/image-upload";
import { Input } from "@/components/atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Loader } from "lucide-react";
import categoryService from "@/services/categoryService";
import { TCate } from "@/types/category.type";
import { formatPrice } from "@/utils/formatPrice";

interface ProductFormProps {
  mode: "create" | "update";
  initialData?: ProductType;
  onSubmit: (data: ProductType) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<TCate[] | null>(null);


  const form = useForm<ProductType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      productName: "",
      productDescription: "",
      price: 0,
      dimension: "",
      volume: 0,
      quantity: 0,
      discount: 0,
      categoryId: 0,
      companyId: 1,
      images: [],
    },
  });
  const handleFormSubmit = async (data: ProductType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      navigate("/products-management");
    } catch {
      toast.error("Error submitting form:");

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCate({ page: 1, pageSize: 10 });
        if (response.success) {
          setCategories(response.result?.data || []);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch {
        toast.error("An error occurred while fetching categories");
      }
    };
    fetchCategories();
  }, []);
  const handleImageUpload = (files: File[]) => {
    form.setValue("images", files.map((file) => URL.createObjectURL(file))); // For preview purposes
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? "Create Product" : "Update Product"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-6">
            <div className="col-span-4 space-y-6">
              <ImageUploadOne onImageUpload={handleImageUpload} multiple={true} />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter volume"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3 space-y-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter price"
                        value={field.value ? formatPrice(field.value) : ''}
                        onChange={(e) => field.onChange(Number(e.target.value.replace(/\D/g, '')))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter discount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="relative rounded-full bg-[#6a9727] text-white px-6 py-2 font-semibold hover:bg-[#55841b] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 text-white" />
              </div>
            ) : (
              mode === "create" ? "Create Product" : "Update Product"
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};
export default ProductForm;