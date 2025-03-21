import React, { useState } from "react";
import { Button, Card, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleConfirmDelete = () => {
    setStep(2);
  };

  const handleSendOTP = async (email: string) => {
    if (!email) {
      message.error("Vui lòng nhập email hợp lệ");
      return;
    }
    try {
      const response = await authService.deleteAccount({ email });
      console.log("Response from deleteAccount:", response);
      if (response?.success) {
        setIsOtpSent(true);
        message.success("OTP đã được gửi đến email của bạn");
      } else {
        message.error(response.result?.message || "Lỗi khi gửi OTP");
      }
    } catch (error) {
      console.error("Error in handleSendOTP:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };
  

  const handleVerifyOTP = async (email: string, otp: string) => {
    if (otp.length !== 6) {
      message.error("Mã OTP không hợp lệ, vui lòng thử lại.");
      return;
    }
  
    try {
      const response = await authService.confirmDeleteAccount({ email, otp });
  
      if (response?.success) {
        message.success("Tài khoản của bạn đã bị xóa");
        navigate("/delete-account/success");
      } else {
        message.error(response.result?.message || "OTP không đúng, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error in handleVerifyOTP:", error);
      message.error("Có lỗi xảy ra khi xác nhận OTP.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900 p-4">
      <Card className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white text-center">
        {step === 1 ? (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
              Do you want to delete your account?
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4">
              We’re sorry to see you go. Please note once your account is deleted:
            </p>
            <ul className="text-gray-700 text-sm sm:text-base text-left mb-4 list-disc pl-5">
              <li>You will lose all records of orders or messages with support.</li>
              <li>Your points and credits will be forfeited.</li>
              <li>You cannot participate in rewards programs.</li>
              <li>You will stop receiving promotional emails.</li>
            </ul>
            <Button
              type="primary"
              className="w-full sm:w-auto bg-green-700 border-none text-white hover:bg-green-600 px-6 py-2"
              onClick={handleConfirmDelete}
            >
              Yes, I’m sure
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
              Verify Your Email
            </h2>
            {!isOtpSent ? (
              <>
                <p className="text-gray-700 text-sm sm:text-base mb-4">
                  Please enter your email to receive a verification OTP.
                </p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
                <Button
                  type="primary"
                  className="w-full sm:w-auto bg-green-700 border-none text-white hover:bg-green-600 px-6 py-2"
                  disabled={!email}
                  onClick={() => handleSendOTP(email)}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-700 text-sm sm:text-base mb-4">
                  Enter the OTP sent to your email.
                </p>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
                <Button
                  type="primary"
                  className="w-full sm:w-auto bg-green-700 border-none text-white hover:bg-green-600 px-6 py-2"
                  disabled={otp.length !== 6}
                  onClick={() => handleVerifyOTP(email, otp)}
                >
                  Verify & Delete Account
                </Button>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default DeleteAccountPage;
