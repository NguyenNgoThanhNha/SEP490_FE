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
    const location = useLocation();
    const navigate = useNavigate();

    const { orderId, appointmentData } = location.state || {};
    const formatPriceVND = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            currency: "VND",
        }).format(price);
    };

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

    const {
        total: totalPrice = 0,
        branchName,
        customerName,
        serviceDetails = [],
        staffInfo = [],
    } = appointmentData;

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
                    orderService.updatePaymentMethod({ orderId, paymentMethod }),
                ]);
                message.success("Thanh toán thành công!");
                navigate("/payment-success");
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
                        <Text strong>Dịch vụ:</Text>
                        <ul className="list-disc ml-5">
                            {serviceDetails.length > 0 ? (
                                serviceDetails.map((service: any, idx: number) => (
                                    <li key={idx}>{service.serviceName} - {service.duration} phút</li>
                                ))
                            ) : (
                                <li>Không có</li>
                            )}
                        </ul>
                    </Col>

                    <Col span={24}>
                        <Text strong>Nhân viên:</Text>
                        <ul className="list-disc ml-5">
                            {staffInfo.length > 0 ? (
                                staffInfo.map((staff: any, idx: number) => (
                                    <li key={idx}>{staff.staffName}</li>
                                ))
                            ) : (
                                <li>Không có</li>
                            )}
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
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg"
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
