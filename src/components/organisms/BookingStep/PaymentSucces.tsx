import { Button, Card, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { SmileOutlined } from "@ant-design/icons";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/booking-form"); 
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="shadow-lg rounded-2xl w-full max-w-xl">
                <Result
                    icon={<SmileOutlined />}
                    status="success"
                    title="Thanh toán thành công!"
                    subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."
                    extra={[
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={handleBackHome}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            key="back"
                        >
                            Quay lại trang chủ
                        </Button>,
                    ]}
                />
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
