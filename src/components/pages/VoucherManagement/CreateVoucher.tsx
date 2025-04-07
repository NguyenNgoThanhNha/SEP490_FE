import VoucherForm from "@/components/organisms/VoucherForm/VoucherForm";
import { VoucherType } from "@/schemas/voucherSchema";
import voucherService from "@/services/voucherService";
import { useState } from "react";
import toast from "react-hot-toast";


const CreateVoucherPage = () => {
  const [, setLoading] = useState<boolean>(false);

  const createVoucher = async (data: VoucherType) => {
    setLoading(true);
    
    try {
      const response = await voucherService.createVoucher(data);
      if (response.success) {
        toast.success("Voucher created successfully!");
      } else {
        toast.error(response?.result?.message || "Failed to create voucher");
      }
    } catch {
      toast.error("An error occurred while creating the voucher");
    }
  }

  return (
    <div>
      <VoucherForm
      mode="create"
      onSubmit={(values) => createVoucher(values)}
      />
    </div>
  );
};

export default CreateVoucherPage;
