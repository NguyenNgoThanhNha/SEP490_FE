import { useState, useEffect } from "react";
import { Card, Button, Select, message, Typography, Divider, Spin, Row, Col } from "antd";
import { CheckCircleOutlined, CreditCardOutlined, DollarOutlined } from "@ant-design/icons";
import orderService from "@/services/orderService";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const paymentOptions = [
  { label: "PayOS (Online Payment)", value: "PayOS", icon: <CreditCardOutlined /> },
  { label: "Cash (Thanh toán tại quầy)", value: "Cash", icon: <DollarOutlined /> },
];

const CheckoutPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("PayOS");
  interface Appointment {
    branch?: { branchName?: string };
    service?: { name?: string; duration?: number; price?: number };
    staff?: { staffInfo?: { fullName?: string; email?: string; phoneNumber?: string } };
  }

  interface AppointmentData {
    appointments?: Appointment[];
    customer?: { fullName?: string; userName?: string };
    totalAmount?: number;
  }

  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  console.log("orderId", orderId);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      try {
        const res = await orderService.getOrderDetail(orderId);
        if (res.success && res.result?.data) {
          setAppointmentData(res.result.data);
        } else {
          message.error("Không thể lấy thông tin đơn hàng.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết order:", err);
        message.error("Có lỗi xảy ra khi lấy thông tin đơn hàng.");
      }
    };

    fetchOrderDetail();
  }, [orderId]);
  useEffect(() => {
    console.log("appointmentData updated:", appointmentData);
  }, [appointmentData]);

  const formatPriceVND = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price);
  };

  if (!appointmentData) {

    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Đang tải thông tin..." />
      </div>
    );
  }
  const branchName = appointmentData?.appointments?.[0]?.branch?.branchName || "N/A";
  const customerName = appointmentData?.customer?.fullName || appointmentData?.customer?.userName || "N/A";
  const totalPrice = appointmentData?.totalAmount || 0;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (paymentMethod === "PayOS") {
        const response = await orderService.confirmAppointment({
          orderId,
          totalAmount: totalPrice.toString(),
          request: {
            returnUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/payment-noti`,
          },
        });

        if (response?.success && response.result?.data) {
          await orderService.updatePaymentMethod({ orderId, paymentMethod });
          message.success("Đang chuyển hướng tới cổng thanh toán...");
          window.location.href = response.result.data;
        } else {
          message.error("Xác nhận thất bại, vui lòng thử lại.");
        }
      } else {
        await Promise.all([
          orderService.updateOrderStatus({ orderId, status: "Completed" }),
          orderService.updatePaymentMethod({ orderId, paymentMethod, note: "Thanh toán bằng tiền mặt" }),
        ]);
        message.success("Thanh toán thành công!");
        navigate("/payment-noti");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận", error);
      message.error("Đã xảy ra lỗi khi xác nhận đặt lịch.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <Card
        className="w-full max-w-2xl shadow-xl rounded-2xl bg-white p-8"
        bordered={false}
      >
        <Title level={2} className="text-center text-green-700 mb-6">
          Xác nhận thanh toán
        </Title>

        <Divider />

        <Row gutter={[16, 12]}>
          <Col span={12}>
            <Text strong>Chi nhánh:</Text>
            <div>{branchName || "N/A"}</div>
          </Col>
          <Col span={12}>
            <Text strong>Khách hàng:</Text>
            <div>{customerName || "N/A"}</div>
          </Col>

          <Col span={24}>
            <Text strong>Dịch vụ và Nhân viên:</Text>
            <ul className="list-disc ml-5">
              {appointmentData?.appointments?.map((appointment: Appointment, idx: number) => {
                const service = appointment?.service;
                const staff = appointment?.staff?.staffInfo;

                return (
                  <li key={idx} className="mb-4">
                    <p className="font-semibold">Dịch vụ: {service?.name || "N/A"}</p>
                    <p>Thời lượng: {service?.duration || "N/A"} phút</p>
                    <p>Giá: {formatPriceVND(service?.price || 0)}</p>
                    <p className="font-semibold mt-2">Nhân viên:</p>
                    <p>Tên: {staff?.fullName || "N/A"}</p>
                    <p>Email: {staff?.email || "N/A"}</p>
                    <p>Số điện thoại: {staff?.phoneNumber || "N/A"}</p>
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>

        <Divider />

        <Title level={4}>
          Tổng tiền: <Text type="success" strong>{formatPriceVND(totalPrice)}VND</Text>
        </Title>

        <div className="mb-6 mt-4">
          <Title level={5}>Phương thức thanh toán</Title>
          <Select
            className="w-full"
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={paymentOptions.map(option => ({
              label: (
                <span className="flex items-center gap-2">
                  {option.icon} {option.label}
                </span>
              ),
              value: option.value,
            }))}
          />
        </div>

        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          className="w-full h-12 bg-[#516d19] hover:bg-green-700 text-white text-lg rounded-lg"
          onClick={handleConfirm}
          loading={loading}
        >
          Xác nhận & Thanh toán
        </Button>
      </Card>
    </div>
  );
};

export default CheckoutPage;
