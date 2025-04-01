import { useState, useEffect } from "react";
import { Card, Button, Select, message, Typography, Divider, Spin } from "antd";
import { CheckCircleOutlined, CreditCardOutlined, DollarOutlined } from "@ant-design/icons";
import orderService from "@/services/orderService";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;


const paymentOptions = [
    { label: "PayOS (Online Payment)", value: "PayOS", icon: <CreditCardOutlined /> },
    { label: "Cash (Payment at Counter)", value: "Cash", icon: <DollarOutlined /> },
];

const CheckoutPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string>("PayOS");
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, appointmentData } = location.state || {};

    useEffect(() => {
        if (!appointmentData || !orderId) {
            message.error("Bạn chưa đặt lịch! Hãy đặt lịch trước.");
            navigate("/booking-form");
        }
    }, [appointmentData, orderId, navigate]);

    if (!appointmentData || !orderId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const totalAmount = appointmentData.total || 0;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await orderService.confirmAppointment({
                orderId,
                totalAmount: totalAmount.toString(),
                paymentMethod,
            });

            if (response?.success) {
                message.success("Đặt lịch thành công!");
                navigate("/confirmation", { state: { orderId, paymentMethod } });
            } else {
                message.error("Xác nhận thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi xác nhận", error);
            message.error("Đã xảy ra lỗi khi xác nhận đặt lịch.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-lg shadow-lg rounded-lg bg-white p-6">
                <Title level={2} className="text-center">Xác nhận thanh toán</Title>

                <Divider />

                <div className="mb-4">
                    <Text strong>Chi nhánh:</Text> <Text>{appointmentData.branchId || "N/A"}</Text> <br />
                    <Text strong>Nhân viên:</Text> <Text>{appointmentData.staffId?.join(", ") || "N/A"}</Text> <br />
                    <Text strong>Dịch vụ:</Text> <Text>{appointmentData.serviceId?.join(", ") || "N/A"}</Text> <br />
                    <Text strong>Thời gian:</Text> <Text>{appointmentData.appointmentsTime?.join(", ") || "N/A"}</Text> <br />
                    <Text strong>Ghi chú:</Text> <Text>{appointmentData.notes || "Không có"}</Text>
                </div>

                <Divider />

                <Title level={4}>
                    Tổng tiền: <Text type="success">${totalAmount}</Text>
                </Title>

                <div className="mb-4">
                    <Title level={4}>Chọn phương thức thanh toán:</Title>
                    <Select
                        className="w-full mt-2"
                        value={paymentMethod}
                        onChange={setPaymentMethod}
                        options={paymentOptions.map(option => ({
                            label: (
                                <span>
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
                    className="w-full"
                    onClick={handleConfirm}
                    loading={loading}
                >
                    Xác nhận đặt lịch
                </Button>
            </Card>
        </div>
    );
};

export default CheckoutPage;
