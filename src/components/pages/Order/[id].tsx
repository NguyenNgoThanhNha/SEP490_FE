import { Button } from "@/components/atoms/ui/button";
import AppointmentList from "@/components/organisms/OrderDetail/AppointmentInfo";
import CustomerInfo from "@/components/organisms/OrderDetail/CustomerInfo";
import PaymentInfo from "@/components/organisms/OrderDetail/PaymentInfo";
import ProductInfo from "@/components/organisms/OrderDetail/ProductInfo";
import RoutineInfo from "@/components/organisms/OrderDetail/RoutineInfo";
import CreateOrderMore from "@/components/pages/CreateOrderMore/CreateOrderMore";
import orderService from "@/services/orderService";
import { message, Spin, Modal } from "antd";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface Customer {
  userName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  userId?: number;
}

interface Product {
  productName: string;
}

interface OrderDetail {
  orderDetailId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  status: string;
}

interface Shipment {
  shippingCarrier: string;
  trackingNumber: string;
  shippingCost: number;
}

interface Appointment {
  appointmentId: number;
  service: { name: string };
  staff: {
    staffInfo: {
      userName: string;
    };
  };
  appointmentsTime: string;
  status: string;
}

interface Routine {
  name: string;
  description: string;
  totalSteps: number;
  targetSkinTypes: string;
  totalPrice: number;
}

interface OrderDetailData {
  orderCode: string;
  orderType: string;
  customer: Customer;
  totalAmount: number;
  status: string;
  statusPayment: string;
  paymentMethod: string;
  orderDetails: OrderDetail[];
  appointments: Appointment[];
  shipment: Shipment;
  routine?: Routine;
  orderId?: number;
}

const getNextStatus = (orderDetails: OrderDetail[]) => {
  const statuses = orderDetails.map((od) => od.status);

  if (statuses.every((status) => status === "Pending")) {
    return "Shipping";
  }

  if (statuses.every((status) => status === "Shipping")) {
    return "Completed";
  }

  return null; // Không hiển thị nút nếu tất cả đã là "Completed"
};

export default function OrderDetailPage() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateOrderMore, setShowCreateOrderMore] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderDetail({ orderId: Number(orderId) });
      if (response.success && response.result?.data) {
        setOrderDetail(response.result.data);
      } else {
        message.error(t("orderNotFound"));
      }
    } catch {
      message.error(t("orderDetailError"));
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail({ orderId: Number(orderId) });
        if (response.success && response.result?.data) {
          setOrderDetail(response.result.data);
        } else {
          message.error(t("orderNotFound"));
        }
      } catch {
        message.error(t("orderDetailError"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateOrderDetail = async (orderDetailsIds: number[], nextStatus: string) => {
    try {
      const payload = {
        orderDetailsIds,
        status: nextStatus,
      };
  
      const response = await orderService.updateOrderDetail(payload);
      if (response.success) {
        message.success(`Cập nhật trạng thái đơn hàng thành công: ${nextStatus}`);
        setOrderDetail((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            orderDetails: prev.orderDetails.map((od) => ({
              ...od,
              status: nextStatus,
            })),
          };
        });
  
        // Nếu trạng thái mới là "Completed", cập nhật trạng thái thanh toán
        if (nextStatus === "Completed" && orderDetail?.statusPayment !== "Paid") {
          const paymentResponse = await orderService.updatePaymentStatus(Number(orderId), "Paid");
          if (paymentResponse.success) {
            message.success("Cập nhật trạng thái thanh toán thành công!");
            fetchOrderDetails(); // Cập nhật lại thông tin
          } else {
            message.error("Cập nhật trạng thái thanh toán thất bại!");
          }
        }
      } else {
        message.error("Cập nhật trạng thái đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };
  
  

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip={t("findingOrder")} />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>{t("orderNotFound")}</p>
      </div>
    );
  }

  const { orderType, customer, totalAmount, statusPayment, orderDetails, appointments, routine } = orderDetail;
  const userId = customer?.userId;
  const nextStatus = getNextStatus(orderDetails);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        {orderType !== "Product" && orderType !== "Routine" && orderDetail.status !== "Completed" && orderDetail.status !== "Cancelled" && (
          <Button onClick={() => setShowCreateOrderMore(true)} className="bg-[#516d19] rounded-full text-white">
            {t("createOrderMore")}
          </Button>
        )}

      </div>

      <div className="flex justify-end">
        {orderType === "Product" && orderDetail.status !== "Completed" && nextStatus && (
          <div className="flex justify-end">
            <Button
              onClick={() => handleUpdateOrderDetail(orderDetails.map((od) => od.orderDetailId), nextStatus)}
              className="bg-[#516d19] rounded-full text-white"
            >
              {t("updateStatus", { status: nextStatus })}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <CustomerInfo
          userName={customer.userName}
          email={customer.email}
          phoneNumber={customer.phoneNumber}
          address={customer.address}
          orderType={orderType}
          shipment={orderType === "Product" ? orderDetail.shipment : undefined}
        />
        <PaymentInfo
          statusPayment={statusPayment}
          paymentMethod={orderDetail.paymentMethod}
          totalAmount={totalAmount}
          orderType={orderType}
          shipment={orderType === "Product" ? orderDetail.shipment : undefined}
        />
      </div>
      {orderType === "Routine" && routine && <RoutineInfo routine={routine} />}
      {(orderType === "Product" || orderType === "ProductAndService" || orderType === "Routine") && (
        <div>
          <ProductInfo orderDetails={orderDetails} />
        </div>
      )}

      {(orderType === "Appointment" || orderType === "ProductAndService" || orderType === "Routine") && (
        <AppointmentList appointments={appointments} />
      )}
      <Modal
        title={t("createOrderMore")}
        open={showCreateOrderMore}
        onCancel={() => setShowCreateOrderMore(false)}
        footer={null}
        width={800}
      >
        <CreateOrderMore
          branchId={1}
          orderType={orderDetail.orderType as "Appointment" | "ProductAndService"}
          orderId={Number(orderDetail.orderId)}
          userId={Number(userId)}
          onSubmit={async (success) => {
            if (success) {
              message.success(t("createdSubOrder"));
              setShowCreateOrderMore(false);
              await fetchOrderDetails();
            } else {
              message.error(t("createOrderMoreError"));
            }
          }}
        />
      </Modal>
    </div>
  );
}
