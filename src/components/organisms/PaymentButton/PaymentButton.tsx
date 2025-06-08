import { Button, Select, message } from "antd";
import { useState } from "react";
import orderService from "@/services/orderService";
import { useTranslation } from "react-i18next";

interface PaymentButtonProps {
  orderId: number;
  totalAmount: number;
  statusPayment: string;
  orderType: string;
  onPaymentSuccess: () => void;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PaymentButton = ({ orderId, totalAmount, statusPayment, orderType, onPaymentSuccess }: PaymentButtonProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const { t } = useTranslation();

  const handlePayment = async () => {
    if (paymentMethod === "payOs") {
      try {
        let amountToPay = totalAmount;
  
        if (statusPayment === "PendingDeposit") {
          amountToPay = totalAmount * 0.7;
        }
  
        const response = await orderService.confirmAppointment({
          orderId,
          totalAmount: amountToPay.toString(),
          request: {
            returnUrl: `${BASE_URL}/payment-success`,
            cancelUrl: `${BASE_URL}/payment-cancel`,
          },
        });
  
        if (response.success) {
          message.success(t("payOsSuccess"));
          window.location.href = response.result?.data;
          // Do NOT call onPaymentSuccess here yet because payment hasn't completed
        } else {
          message.error(t("payOsFailed"));
        }
      } catch {
        message.error(t("payOsError"));
      }
    } else if (paymentMethod === "cash") {
      try {
        // Determine new payment status
        const newStatus =
          statusPayment === "PendingDeposit" ? "PaidDeposit" : "Paid";
  
        const paymentResponse = await orderService.updatePaymentStatus(
          orderId,
          newStatus
        );
  
        if (paymentResponse.success) {
          message.success(t("cashSuccess"));
  
          if (
            (orderType === "Routine" || orderType === "ProductAndService") &&
            newStatus === "Paid"
          ) {
            const orderDetailsIds = await getAllOrderDetailIds(orderId);
            const updateDetailsResponse = await orderService.updateOrderDetail({
              orderDetailsIds,
              status: "Completed",
            });
  
            if (updateDetailsResponse.success) {
              message.success(t("updateOrderStatusSuccess"));
            } else {
              message.error(t("updateOrderStatusFailed"));
            }
          }
  
          onPaymentSuccess();
        } else {
          message.error(t("updatePaymentStatusFailed"));
        }
      } catch {
        message.error(t("cashError"));
      }
    }
  };
  

  const getAllOrderDetailIds = async (orderId: number) => {
    try {
      const response = await orderService.getOrderDetail({ orderId });
      return response.success ? response.result?.data.orderDetails.map((od) => od.orderDetailId) : [];
    } catch {
      message.error(t("getOrderDetailsError"));
      return [];
    }
  };

  if (statusPayment === "Pending" || statusPayment === "PendingDeposit") {
    return (
      <div className="flex justify-end">
        <Select
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={[
            { label: t("payOs"), value: "payOs" },
            { label: t("cash"), value: "cash" },
          ]}
          className="mr-4"
        />
        <Button
          onClick={handlePayment}
          className="bg-[#516d19] text-white rounded-lg px-4 py-2 hover:bg-[#3e5b14]"
          disabled={paymentMethod === ""}
        >
          {t("payment")}
        </Button>
      </div>
    );
  }

  return null; 
};

export default PaymentButton;
