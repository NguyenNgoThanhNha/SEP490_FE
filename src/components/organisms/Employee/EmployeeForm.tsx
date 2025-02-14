import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { StaffSchema, StaffType } from "@/schemas/staffSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "antd/es/input/TextArea";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface StaffFormProps {
  mode: "create" | "update";
  initialData?: StaffType;
  onSubmit: (data: StaffType) => Promise<void>;
}

const StaffForm: React.FC<StaffFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<StaffType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: initialData || {
      userName: "",
      email: "",
      fullName: "",
      branchId: 1
    },
  });

  const handleFormSubmit = async (data: StaffType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      navigate("/staff-management");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? "Create Staff" : "Update Staff"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-7 gap-6">
            <div className="col-span-4 space-y-6">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter staff name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <TextArea
                        {...field}
                        placeholder="Enter full name"
                        rows={4}
                        className="text-sm font-normal"
                        style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter email"
                        className="text-sm font-normal"
                        style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                      />
                    </FormControl>
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
            onClick={() => navigate("/staff-management")}
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
              mode === "create" ? "Create Staff" : "Update Staff"
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
