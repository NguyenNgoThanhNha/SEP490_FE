import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import orderService from "@/services/orderService";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/atoms/ui/select";
import { toast } from "react-hot-toast";
import { formatPrice } from "@/utils/formatPrice";

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation(); 
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("PayOS");

  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) {
        console.error("orderId is missing");
        return;
      }

      try {
        const res = await orderService.getOrderDetail({ orderId: Number(orderId) });
        if (res.success && res.result?.data) {
          setAppointmentData(res.result.data);
        } else {
          toast.error(t("fetchOrderError")); 
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        toast.error(t("unexpectedError")); 
      }
    };

    fetchOrderDetail();
  }, [orderId, t]);


  const handleConfirm = async () => {
    setLoading(true);
    const totalAmount = (
      (Number(appointmentData?.totalAmount) || 0) - (Number(appointmentData?.discountAmount) || 0)
    ).toString();

    try {
      if (paymentMethod === "PayOS") {
        const response = await orderService.confirmAppointment({
          orderId,
          totalAmount: totalAmount,
          request: {
            returnUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/payment-noti`,
          },
        });

        if (response?.success && response.result?.data) {
          await orderService.updatePaymentMethod({ orderId, paymentMethod });
          toast.success(t("redirectingToPayment")); 
          window.location.href = response.result.data;
        } else {
          toast.error(t("confirmationFailed")); 
        }
      } else {
        await Promise.all([
          orderService.updateOrderStatus(orderId, "Completed"),
          orderService.updatePaymentMethod({ orderId, paymentMethod, note: t("cashPaymentNote") }),
        ]);
        toast.success(t("paymentSuccess")); 
        navigate("/payment-noti");
      }
    } catch (error) {
      console.error("Error confirming appointment", error);
      toast.error(t("confirmationError")); 
    } finally {
      setLoading(false);
    }
  };

  if (!appointmentData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg text-gray-500">{t("loadingOrderDetails")}</div> 
      </div>
    );
  }

  const branchName = appointmentData?.appointments?.[0]?.branch?.branchName || t("notAvailable");
  const customerName =
    appointmentData?.customer?.fullName || appointmentData?.customer?.userName || t("notAvailable");
  const totalPrice = (
    (Number(appointmentData?.totalAmount) || 0) - (Number(appointmentData?.discountAmount) || 0)
  ) || 0;
return (
  <div className="flex justify-center items-center min-h-screen p-4">
    <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-[#516d19]">{t("paymentConfirmation")}</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="font-semibold">{t("branch")}:</p>
          <p>{branchName}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">{t("customer")}:</p>
          <p>{customerName}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">{t("servicesAndStaff")}:</p>
          <ul className="list-disc ml-5">
            {appointmentData?.appointments?.map((appointment: { service: { name: string; duration: number }; staff: { staffInfo: { fullName: string } } }, idx: number) => {
              const service = appointment?.service;
              const staff = appointment?.staff?.staffInfo;

              return (
                <li key={idx} className="mb-4">
                  <p>{t("service")}: {service?.name || t("notAvailable")}</p>
                  <p>{t("duration")}: {service?.duration || t("notAvailable")} {t("minutes")}</p>
                  <p>{t("staff")}: {staff?.fullName || t("notAvailable")}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mb-4">
          <p className="font-semibold">{t("totalPrice")}:</p>
          <p className="text-[#516d19] font-bold">{formatPrice(totalPrice)} VND</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold">{t("paymentMethod")}:</p>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectPaymentMethod")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PayOS">{t("payOS")}</SelectItem>
              <SelectItem value="Cash">{t("cash")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#516d19] hover:bg-green-800 text-white"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? t("processing") : t("confirmAndPay")}
        </Button>
      </CardFooter>
    </Card>
  </div>
);
};

export default CheckoutPage;
