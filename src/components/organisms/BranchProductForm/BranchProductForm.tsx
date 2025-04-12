import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { BranchProductSchema, BranchProductType } from "@/schemas/branchProductSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import { Switch } from "@/components/atoms/ui/switch";
import { formatPrice } from "@/utils/formatPrice";
import { useNavigate } from "react-router-dom";

interface BranchProductFormProps {
  initialData: {
    name: string;
    description: string;
    price: number;
    dimension: string;
    skinTypeSuitable: string
  } & BranchProductType;
  onSubmit: (data: BranchProductType) => Promise<void>;
}

export default function BranchProductForm({ initialData, onSubmit }: BranchProductFormProps) {
  const navigate = useNavigate();
  const form = useForm<BranchProductType>({
    resolver: zodResolver(BranchProductSchema),
    defaultValues: {
      stockQuantity: 0,
      status: "",
    },
  });
const handleCancel = () => {
  navigate("/branch-product-management");
}
  useEffect(() => {
    form.reset({
      stockQuantity: initialData.stockQuantity,
      status: initialData.status,
    });
  }, [initialData]);

  const handleSubmit = async (values: BranchProductType) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 pt-6">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input value={initialData.name} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input value={initialData.description} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Skin Type Suitable</FormLabel>
              <FormControl>
                <Input value={initialData.skinTypeSuitable} disabled />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input value={formatPrice(initialData.price)} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Dimension</FormLabel>
              <FormControl>
                <Input value={initialData.dimension} disabled />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === "Active"}
                      onCheckedChange={(checked) => field.onChange(checked ? "Active" : "Inactive")}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    {field.value === "Active" ? "Active" : "Inactive"}
                  </span>
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <button type="button"  className="rounded-full border-2 mr-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="relative rounded-full bg-[#6a9727] text-white px-6 py-2 font-semibold hover:bg-[#55841b] transition disabled:opacity-50">Save</button>
        </div>
      </form>
    </Form>
  );
}
