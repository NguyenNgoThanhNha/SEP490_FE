import React, { useState } from "react";
import { Button, Card, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleSendOTP = () => {
    if (email) {
      setIsEmailSubmitted(true);
      message.success("OTP has been sent to your email");
    } else {
      message.error("Please enter a valid email address");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      message.success("Account deletion confirmed");
      navigate("/delete-account/success");
    } else {
      message.error("Invalid OTP, please try again");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900 p-4">
      <Card className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4">
          Verify Your Email
        </h2>
        {!isEmailSubmitted ? (
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
              onClick={handleSendOTP}
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
              onClick={handleVerifyOTP}
            >
              Verify & Delete Account
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyOTPPage;