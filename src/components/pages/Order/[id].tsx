import { Badge } from "@/components/atoms/ui/badge";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import orderService from "@/services/orderService";
import { message, Spin } from "antd";
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
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
  staff: { userName: string };
  branch: { branchName: string };
  appointmentsTime: string;
  status: string;
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
}

export default function OrderDetailPage() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null); // State để lưu thông tin đơn hàng
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false); // State để theo dõi trạng thái cập nhật
  const { orderId } = useParams(); // Lấy orderId từ URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail({ orderId: Number(orderId) }); // Gọi API với orderId
        if (response.success && response.result?.data) {
          setOrderDetail(response.result.data); // Lưu dữ liệu vào state
        } else {
          message.error("Không thể lấy thông tin đơn hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        message.error("Đã xảy ra lỗi khi lấy thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!orderDetail) return;

    const orderDetailsIds = orderDetail.orderDetails.map((detail) => detail.orderDetailId); // Lấy tất cả orderDetailsIds
    setUpdating(true);

    try {
      const response = await orderService.updateOrderDetail({
        orderDetailsIds,
        status: "Shipping", // Cập nhật trạng thái thành "Shipping"
      });

      if (response.success) {
        message.success("Cập nhật trạng thái thành công!");
        // Cập nhật trạng thái trong state
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
        message.error("Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Không tìm thấy thông tin đơn hàng.</p>
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
    shipment,
  } = orderDetail;

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // Kiểm tra nếu tất cả orderDetails đã có trạng thái "Shipping"
  const allShipping = orderDetails.every((detail) => detail.status === "Shipping");

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to orders</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Order #{orderId}</h1>
          <Badge className="ml-2">{status}</Badge>
        </div>
        {/* Nút cập nhật trạng thái */}
        {!allShipping && orderType === "Product" && (
          <Button
            variant="outline"
            onClick={handleUpdateStatus}
            disabled={updating} // Vô hiệu hóa nút khi đang cập nhật
          >
            {updating ? "Updating..." : "Update to Shipping"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Thông tin khách hàng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div>
              <div className="font-medium">{customer?.userName || "N/A"}</div>
              <div className="text-sm text-muted-foreground">{customer?.email || "N/A"}</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer?.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{customer?.address || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin thanh toán */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex justify-between items-center">
              <div className="font-medium">Status</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" /> {statusPayment || "N/A"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Method</div>
              <div className="text-sm">{paymentMethod || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Total Amount</div>
              <div className="text-sm">{totalAmount?.toLocaleString()} VND</div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin vận chuyển */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex justify-between">
              <div className="font-medium">Carrier</div>
              <div className="text-sm">{shipment?.shippingCarrier || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Tracking Number</div>
              <div className="text-sm">{shipment?.trackingNumber || "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-medium">Shipping Cost</div>
              <div className="text-sm">{shipment?.shippingCost?.toLocaleString()} VND</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách sản phẩm hoặc chi tiết lịch hẹn */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        {orderType === "Product" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.map((detail) => (
                <TableRow key={detail.orderDetailId}>
                  <TableCell>{detail.product?.productName || "N/A"}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.unitPrice?.toLocaleString()} VND</TableCell>
                  <TableCell>{detail.subTotal?.toLocaleString()} VND</TableCell>
                  <TableCell>
                    <Badge variant={detail.status === "Shipping" ? "success" : "outline"}>
                      {detail.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Appointment Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.appointmentId}>
                  <TableCell>{appointment.service?.name || "N/A"}</TableCell>
                  <TableCell>{appointment.staff?.userName || "N/A"}</TableCell>
                  <TableCell>{appointment.branch?.branchName || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentsTime).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={appointment.status === "Completed" ? "success" : "outline"}>
                      {appointment.status}
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
