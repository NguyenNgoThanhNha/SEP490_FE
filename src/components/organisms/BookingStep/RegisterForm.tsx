import {useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/atoms/ui/form copy";
import { Input } from "@/components/atoms/ui/input";
import authService from "@/services/authService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface RegisterWithPhoneProps {
  onRegisterSuccess: (userId: number) => void;
}

const RegisterWithPhoneOrEmail: React.FC<RegisterWithPhoneProps> = ({ onRegisterSuccess }) => {
  const [checking, setChecking] = useState(false);
  const [showRegisterFields, setShowRegisterFields] = useState(false); // <-- show form khi user chưa có

  const form = useForm({
    defaultValues: {
      userName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const checkPhone = async () => {
    const { phoneNumber } = form.getValues();

    if (!phoneNumber) return;

    try {
      setChecking(true);
      const res = await authService.getUserByPhone({ phone: phoneNumber });

      if (res.success && res.result?.data) {
        toast.success("Tài khoản đã tồn tại!");
        onRegisterSuccess(res.result.data.userId);
        setShowRegisterFields(false);
      } else {
        toast("Chưa có tài khoản, vui lòng nhập thêm thông tin.");
        setShowRegisterFields(true);
      }
    } catch {
      toast.error("Lỗi kiểm tra số điện thoại!");
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    const { userName, phoneNumber } = form.getValues();

    if (!userName || !phoneNumber) {
      toast.error("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    try {
      setChecking(true);
      const createRes = await authService.createAccountWithPhone({
        userName,
        phoneNumber,
        password: "123456",
      });

      if (createRes.success && createRes.result?.data.userId) {
        toast.success("Tạo tài khoản thành công!");
        onRegisterSuccess(createRes.result.data.userId);
        setShowRegisterFields(false);
      } else {
        toast.error("Tạo tài khoản thất bại!");
      }
    } catch  {
      toast.error("Lỗi khi tạo tài khoản.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Phone Number"
                  {...field}
                  onBlur={checkPhone} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showRegisterFields && (
          <>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (nếu có)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <button
              type="button"
              className="px-4 py-2 bg-[#516D19] text-white rounded mt-2"
              onClick={handleRegister}
              disabled={checking}
            >
              {checking ? "Đang xử lý..." : "Tạo tài khoản"}
            </button>
          </>
        )}

        {checking && <p className="text-sm text-blue-500">Đang kiểm tra...</p>}
      </form>
    </Form>
  );
};

export default RegisterWithPhoneOrEmail;
