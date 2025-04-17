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
import { useTranslation } from "react-i18next";

interface ProductFormProps {
  mode: "create" | "update";
  initialData?: ProductType;
  onSubmit: (data: ProductType) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<TCate[] | null>(null);
  const [, setImages] = useState<string[]>(initialData?.images || []);
  const {t} = useTranslation();

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
      skintypesuitable: "", 
    },
  });
  const handleFormSubmit = async (data: ProductType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("productDescription", data.productDescription);
      formData.append("price", data.price.toString());
      formData.append("volume", data.volume.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("discount", data.discount.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("companyId", data.companyId.toString());
      formData.append("skintypesuitable", data.skintypesuitable);
  
      if (data.images && data.images.length > 0) {
        formData.append("image", data.images[0]); 
      }
  
      await onSubmit(formData as any); 
      navigate("/products-management");
    } catch {
      toast.error("Error submitting form:");
    } finally {
      setLoading(false);
    }
  };
  
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
  useEffect (() => {
    if(initialData?.images) {
      setImages(initialData.images);
      form.setValue("images", initialData.images);
    }
  }, [initialData]);
  
  const handleImageUpload = (file: File) => {
    setImages([URL.createObjectURL(file)]); 
    form.setValue("images", file); 
  };
  
  console.log("Current images:", form.watch("images"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? t("CreateProduct")  : t("UpdateProduct")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-6">
            <div className="col-span-4 space-y-6">
              <ImageUploadOne onImageUpload={handleImageUpload} multiple={true}  initialData={initialData?.images} />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Product')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enterproductname")} {...field} />
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
                    <FormLabel>{t('productDes')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enterproductdes")} {...field} />
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
                    <FormLabel>{t("Dimension")} (ml)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("Entervolume")}
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
                    <FormLabel>{t("Price")} (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Enterprice")}
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
                    <FormLabel>{t('Quantity')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("Enterquantity")}
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
                    <FormLabel>{t('Discount')} (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("Enterdiscount")}
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
                    <FormLabel>{t('Category')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Selectcategory")} />
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
            onClick={() => navigate("/products-management")}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
           {t('Cancel')} 
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
              mode === "create" ? t("CreateProduct")  : t("UpdateProduct")
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};
export default ProductForm;