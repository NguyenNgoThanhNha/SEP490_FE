import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/atoms/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select";
import axios from "axios";
import { branchSchema, BranchType } from "@/schemas/branchSchema";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { useTranslation } from "react-i18next";
import { AssignManagerToBranch } from "./ManagerForm";

interface BranchFormProps {
  mode: "create" | "update";
  initialData?: BranchType;
  onSubmit: (data: BranchType) => Promise<void>;
  loading?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({ mode, initialData, onSubmit }) => {
  const form = useForm<BranchType>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || {
      branchName: "",
      branchPhone: "",
      branchAddress: "",
      district: 0,
      wardCode: 0,
      longAddress: "",
      latAddress: "",
      status: "Active",
      managerId: 0,
      companyId: 1,
    },
  });

  const [provinceId, setProvinceId] = useState<string>(initialData?.province || "");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const GHN_TOKEN = "e79a5ca7-014e-11f0-a9a7-7e45b9a2ff31";
  const GOONG_API_KEY = "58y8peA3QXjke7sqZK4DYCiaRvcCbh6Jaffw5qCI";

  const handleManagerSelect = (userId: number) => {
    form.setValue("managerId", userId);
  };

  useEffect(() => {
    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: GHN_TOKEN },
      })
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.error(t("fetchProvincesError"), err));
  }, []);

  useEffect(() => {
    if (!provinceId) return;

    form.setValue("province", provinceId);

    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
        headers: { Token: GHN_TOKEN },
        params: { province_id: provinceId },
      })
      .then((res) => setDistricts(res.data.data))
      .catch((err) => console.error(t("fetchDistrictsError"), err));
  }, [provinceId]);

  useEffect(() => {
    const district = form.getValues("district");
    if (!district) return;

    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        headers: { Token: GHN_TOKEN },
        params: { district_id: district },
      })
      .then((res) => setWards(res.data.data))
      .catch((err) => console.error(t("fetchWardsError"), err));
  }, [form.watch("district")]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { branchAddress, district, wardCode } = form.getValues();
      const isReady = provinceId && district && wardCode && branchAddress;

      if (!isReady) return;

      fetchCoordinates(branchAddress, provinceId, district, wardCode);
    }, 800);

    return () => clearTimeout(timeout);
  }, [form.watch("branchAddress"), form.watch("district"), form.watch("wardCode"), provinceId]);

  const fetchCoordinates = async (
    branchAddress: string,
    provinceId: string,
    district: number,
    wardCode: number
  ) => {
    const provinceName = provinces.find((p) => String(p.ProvinceID) === String(provinceId))?.ProvinceName;
    const districtName = districts.find((d) => d.DistrictID === Number(district))?.DistrictName;
    const wardName = wards.find((w) => Number(w.WardCode) === Number(wardCode))?.WardName;

    if (!provinceName || !districtName || !wardName) return;

    const fullAddress = `${branchAddress}, ${wardName}, ${districtName}, ${provinceName}`;
    console.log(t("fullAddress"), fullAddress);

    try {
      const res = await axios.get("https://rsapi.goong.io/geocode", {
        params: {
          address: fullAddress,
          api_key: GOONG_API_KEY,
        },
      });

      const result = res.data.results[0];
      if (result) {
        form.setValue("latAddress", result.geometry.location.lat.toString());
        form.setValue("longAddress", result.geometry.location.lng.toString());
      }
    } catch (err) {
      console.error(t("fetchCoordinatesError"), err);
    }
  };

  const handleFormSubmit = async (data: BranchType) => {
    const payload = {
      BranchName: data.branchName,
      BranchPhone: data.branchPhone,
      BranchAddress: data.branchAddress,
      District: data.district,
      WardCode: data.wardCode,
      LatAddress: data.latAddress,
      LongAddress: data.longAddress,
      Status: data.status,
      ManagerId: data.managerId,
      CompanyId: data.companyId,
    };

    try {
      if (!data.latAddress || !data.longAddress) {
        await fetchCoordinates(data.branchAddress, provinceId, data.district, data.wardCode);
      }

      await onSubmit(payload as any);
      toast.success(
        `${mode === "create" ? t("createBranchSuccess") : t("updateBranchSuccess")}`
      );
      navigate("/branchs-management");
    } catch {
      toast.error(t("submitBranchError"));
    }
  };

  return (
    <Form {...form} className="w-full">
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? t("createbranch") : t("updatebranch")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("branchname")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("Enterbranchname")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("branchphone")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("Enterbranchphone")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={() => (
                <FormItem>
                  <FormLabel>{t("province")}</FormLabel>
                  <Select onValueChange={(val) => setProvinceId(val)} value={provinceId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectprovince")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()}>
                          {p.ProvinceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("district")}</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectdistrict")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.DistrictID} value={d.DistrictID.toString()}>
                          {d.DistrictName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wardCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ward")}</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectward")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((w) => (
                        <SelectItem key={w.WardCode} value={w.WardCode}>
                          {w.WardName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branchAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("branchaddress")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("Enterbranchaddress")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("manager")}</FormLabel>
                  <AssignManagerToBranch onManagerSelect={(id) => field.onChange(id)} />
                  {mode === "update" && initialData?.managerBranch && (
                    <p className="text-sm text-gray-500 mt-2">
                      {t("currentManager")}: {initialData.managerBranch.userName}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#516d19] text-white px-6 py-2 rounded-full hover:bg-green-700"
          >
            {mode === "create" ? t("createbranch") : t("updatebranch")}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
