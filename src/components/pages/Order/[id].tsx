import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import orderService from "@/services/orderService";
import { message, Spin } from "antd";
import dayjs from "dayjs";
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

interface Customer {
  userName: string;
  email: string;
  phoneNumber: string;
  address: string | null;
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
    }
  };
  branch: { branchName: string };
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
}

export default function OrderDetailPage() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail({ orderId: Number(orderId) }); // Gọi API với orderId
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

  const handleUpdateStatus = async () => {
    if (!orderDetail) return;

    const orderDetailsIds = orderDetail.orderDetails.map((detail) => detail.orderDetailId);
    setUpdating(true);

    try {
      const response = await orderService.updateOrderDetail({
        orderDetailsIds,
        status: "Shipping",
      });

      if (response.success) {
        message.success(t("updateStatusOrder"));
        setOrderDetail((prev) =>
          prev
            ? {
              ...prev,
              orderDetails: prev.orderDetails.map((detail) => ({
                ...detail,
                status: "Shipping",
              })),
            }
            : null
        );
      } else {
        message.error(t("updateStatusError"));
      }
    } catch {
      message.error(t("orderNotFound"));
    } finally {
      setUpdating(false);
    }
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

  const {
    orderType,
    customer,
    totalAmount,
    status,
    statusPayment,
    paymentMethod,
    orderDetails,
    appointments,
  } = orderDetail;

  const handleBack = () => {
    navigate(-1);
  };

  const allShipping = orderDetails.every((detail) => detail.status === "Shipping");

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t("order")} #{orderId}</h1>
          <Badge className="ml-2">{t(status)}</Badge>
        </div>
        {!allShipping && orderType === "Product" && (
          <Button
            variant="outline"
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            {updating ? t("updatingOrder") : t("updatetoshipping")}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("customerInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <div className="font-medium">{customer?.userName || ""}</div>
              <div className="text-sm text-muted-foreground">{customer?.email || ""}</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer?.phoneNumber || ""}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{customer?.address || ""}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t("paymentInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex justify-between items-center">
              <div className="font-medium">{t("Status")}</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" /> {t(statusPayment) || ""}
              </Badge>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">{t("method")}</div>
              <div className="text-sm">{paymentMethod || ""}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">{t("totalAmount")}</div>
              <div className="text-sm">{totalAmount?.toLocaleString()} VND</div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">{t("orderDetails")}</h2>
        {orderType === "Product" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("products")}</TableHead>
                <TableHead>{t("Quantity")}</TableHead>
                <TableHead>{t("Price")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.map((detail) => (
                <TableRow key={detail.orderDetailId}>
                  <TableCell>{detail.product?.productName || ""}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.subTotal?.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        detail.status === "Shipping"
                          ? "success"
                          : detail.status === "PendingDeposit"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {t(detail.status)} {/* Dịch trực tiếp trạng thái */}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : orderType === "Routine" ? (
          <div>
            <div className="bg-white shadow-md rounded-xl p-6 space-y-3 mt-4 max-w-xl">
              <p><span className="font-semibold text-gray-700">{t("routineName")}:</span> {orderDetail.routine?.name || ""}</p>
              <p><span className="font-semibold text-gray-700">{t("description")}:</span> {orderDetail.routine?.description || ""}</p>
              <p><span className="font-semibold text-gray-700">{t("totalSteps")}:</span> {orderDetail.routine?.totalSteps || ""}</p>
              <p><span className="font-semibold text-gray-700">{t("targetSkinTypes")}:</span> {orderDetail.routine?.targetSkinTypes || ""}</p>
              <p>
                <span className="font-semibold text-gray-700">{t("Price")}:</span>{" "}
                <span className="text-[#516d19] font-bold">
                  {orderDetail.routine?.totalPrice?.toLocaleString() || ""} VND
                </span>
              </p>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("routineAppointment")}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Service")}</TableHead>
                  <TableHead>{t("StaffName")}</TableHead>
                  <TableHead>{t("Branch")}</TableHead>
                  <TableHead>{t("appointmentTime")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.appointmentId}>
                    <TableCell>{appointment.service?.name || ""}</TableCell>
                    <TableCell>{appointment.staff?.staffInfo?.userName || ""}</TableCell>
                    <TableCell>{appointment.branch?.branchName || ""}</TableCell>
                    <TableCell>
                      {dayjs(appointment.appointmentsTime).format("HH:mm DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === "Completed"
                            ? "success"
                            : appointment.status === "Pending Deposit"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {t(appointment.status.replace(" ", "_"))} {/* Dịch trực tiếp trạng thái */}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Service")}</TableHead>
                <TableHead>{t("StaffName")}</TableHead>
                <TableHead>{t("Branch")}</TableHead>
                <TableHead>{t("appointmentTime")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>{appointment.service?.name || ""}</TableCell>
                  <TableCell>{appointment.staff?.staffInfo?.userName || ""}</TableCell>
                  <TableCell>{appointment.branch?.branchName || ""}</TableCell>
                  <TableCell>
                    {dayjs(appointment.appointmentsTime).format("HH:mm DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Completed"
                          ? "success"
                          : appointment.status === "Pending Deposit"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {t(appointment.status.replace(" ", "_"))} {/* Dịch trực tiếp trạng thái */}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
