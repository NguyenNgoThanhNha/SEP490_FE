import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/atoms/ui/form copy";
import { Input } from "@/components/atoms/ui/input";
import authService from "@/services/authService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface RegisterWithPhoneProps {
  onRegisterSuccess: (userId: number, bonusPoint: number) => void;
}

const RegisterWithPhoneOrEmail: React.FC<RegisterWithPhoneProps> = ({ onRegisterSuccess }) => {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const [showRegisterFields, setShowRegisterFields] = useState(false);

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
        toast.success(t("accountExists"));
        const { userId, bonusPoint } = res.result.data;
        onRegisterSuccess(userId, bonusPoint); 
        setShowRegisterFields(false);
      } else {
        toast(t("accountNotFound"));
        setShowRegisterFields(true);
      }
    } catch {
      toast.error(t("phoneCheckError"));
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    const { userName, phoneNumber } = form.getValues();

    if (!userName || !phoneNumber) {
      toast.error(t("missingFields"));
      return;
    }

    try {
      setChecking(true);
      const createRes = await authService.createAccountWithPhone({
        userName,
        phoneNumber,
        password: "123456",
      });

      if (createRes.success && createRes.result?.data) {
        toast.success(t("accountCreated"));
        const { userId, bonusPoint } = createRes.result.data;
        onRegisterSuccess(userId, bonusPoint); 
        setShowRegisterFields(false);
      } else {
        toast.error(t("accountCreationFailed"));
      }
    } catch {
      toast.error(t("accountCreationError"));
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
              <FormLabel>{t("phoneNumber")}</FormLabel> 
              <FormControl>
                <Input
                  placeholder={t("enterPhoneNumber")}
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
                  <FormLabel>{t("userName")}</FormLabel> 
                  <FormControl>
                    <Input placeholder={t("enterUserName")} {...field} /> 
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailOptional")}</FormLabel> 
                  <FormControl>
                    <Input placeholder={t("enterEmail")} {...field} /> 
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
              {checking ? t("processing") : t("createAccount")} 
            </button>
          </>
        )}

        {checking && <p className="text-sm text-blue-500">{t("checking")}</p>} 
      </form>
    </Form>
  );
};

export default RegisterWithPhoneOrEmail;
