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

interface BranchFormProps {
  mode: "create" | "update";
  initialData?: BranchType;
  onSubmit: (data: BranchType) => Promise<void>;
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
    },
  });

  const [provinceId, setProvinceId] = useState<string>(initialData?.province || "");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GHN_TOKEN = "e79a5ca7-014e-11f0-a9a7-7e45b9a2ff31";
  const GOONG_API_KEY = "58y8peA3QXjke7sqZK4DYCiaRvcCbh6Jaffw5qCI";

  useEffect(() => {
    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: GHN_TOKEN },
      })
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.error("Failed to fetch provinces", err));
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
      .catch((err) => console.error("Failed to fetch districts", err));
  }, [provinceId]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "district" && value.district) {
        axios
          .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
            headers: { Token: GHN_TOKEN },
            params: { district_id: value.district },
          })
          .then((res) => setWards(res.data.data))
          .catch((err) => console.error("Failed to fetch wards", err));
      }

      const { branchAddress, district, wardCode } = value;
      const isReady = provinceId && district && wardCode && branchAddress;

      if (isReady) {
        const provinceName = provinces.find(p => p.ProvinceID.toString() === provinceId)?.ProvinceName;
        const districtName = districts.find(d => d.DistrictID === district)?.DistrictName;
        const wardName = wards.find(w => w.WardCode === wardCode)?.WardName;

        if (!provinceName || !districtName || !wardName) return;

        const fullAddress = `${branchAddress}, ${wardName}, ${districtName}, ${provinceName}`;

        axios.get("https://rsapi.goong.io/geocode", {
          params: {
            address: fullAddress,
            api_key: GOONG_API_KEY,
          },
        })
          .then(res => {
            console.log("Goong API response:", res.data);

            const result = res.data.results[0];
            if (result) {
              form.setValue("latAddress", result.geometry.location.lat.toString());
              form.setValue("longAddress", result.geometry.location.lng.toString());
            }
          })
          .catch(err => {
            console.error("Failed to fetch coordinates from Goong", err);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, provinceId, districts, wards, provinces]);

  const handleFormSubmit = async (data: BranchType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(`${mode === "create" ? "Created" : "Updated"} branch successfully`);
      navigate("/branchs-management");
    } catch {
      toast.error("Something went wrong while submitting branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="branchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter branch name" />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter phone number" />
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
              <FormLabel>Province</FormLabel>
              <Select onValueChange={(val) => setProvinceId(val)} value={provinceId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
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
              <FormLabel>District</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
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
              <FormLabel>Ward</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
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
              <FormLabel>Detailed Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 123 Lê Lợi, P. Bến Thành" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
