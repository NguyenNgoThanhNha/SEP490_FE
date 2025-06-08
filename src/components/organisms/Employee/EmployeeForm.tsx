import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { StaffSchema, StaffType } from "@/schemas/staffSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "antd/es/input/TextArea";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import branchService from "@/services/branchService";
import toast from "react-hot-toast";
import { TBranch } from "@/types/branch.type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { useTranslation } from "react-i18next";

interface StaffFormProps {
  mode: "create" | "update";
  initialData?: StaffType;
  onSubmit: (data: StaffType) => Promise<void>;
}

const StaffForm: React.FC<StaffFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [branchs, setBranchs] = useState<TBranch[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<StaffType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: initialData || {
      userName: "",
      fullName: "",
      email: "",
      branchId: 0,
      roleId: 0,
      avatar: "",
    },
  });

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await branchService.getAllBranch({ page: 1, pageSize: 200, status: "Active" });
        if (response.success) {
          setBranchs(response.result?.data || []);
        } else {
          toast.error("Failed to fetch Branch");
        }
      } catch {
        toast.error("An error occurred while fetching branch");
      }
    };

    fetchBranch();
  }, []);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  const handleFormSubmit = async (data: StaffType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      navigate("/staffs-management");
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
                {mode === "create" ? t("CreateStaff") : t("UpdateStaff")}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-7 gap-6">
            <div className="col-span-4 space-y-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("StaffName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("EnterStaffName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fullname */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("FullName")}</FormLabel>
                    <FormControl>
                      <TextArea
                        {...field}
                        placeholder={t("EnterFullName")}
                        rows={4}
                        className="text-sm font-normal"
                        style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("EnterEmail")}
                        className="text-sm font-normal"
                        style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode === "update" && (
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Avatar URL")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("EnterAvatarURL")}
                          className="text-sm font-normal"
                          style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Branch")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("SelectBranch")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branchs.map((branch) => (
                          <SelectItem key={branch.branchId} value={branch.branchId.toString()}>
                            {branch.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role - chỉ create */}
              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Role")}</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("SelectRole")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3">{t("Specialist")}</SelectItem>
                          <SelectItem value="4">{t("Cashier")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
            {t("Cancel")}
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
              mode === "create" ? t("CreateStaff") : t("UpdateStaff")
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
