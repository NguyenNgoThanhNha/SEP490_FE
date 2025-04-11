import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { BranchProductSchema, BranchProductType } from "@/schemas/branchProductSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import { Card, CardContent } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import { Switch } from "@/components/atoms/ui/switch";
import { Button } from "@/components/atoms/ui/button";

interface BranchProductFormProps {
  initialData: {
    name: string;
    description: string;
    price: number;
    duration: number;
  } & BranchProductType;
  onSubmit: (data: BranchProductType) => Promise<void>;
}

export default function BranchProductForm({ initialData, onSubmit }: BranchProductFormProps) {
  const form = useForm<BranchProductType>({
    resolver: zodResolver(BranchProductSchema),
    defaultValues: {
      stockQuantity: 0,
      status: true,
    },
  });

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
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input value={initialData.price} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input value={initialData.duration} disabled />
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
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
