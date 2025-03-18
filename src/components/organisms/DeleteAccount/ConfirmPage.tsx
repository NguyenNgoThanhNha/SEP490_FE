import React from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const ConfirmDeletePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900 p-4">
      <Card className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-white text-center">
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
          onClick={() => navigate("/delete-account/verify")}
        >
          Yes, I’m sure
        </Button>
      </Card>
    </div>
  );
};

export default ConfirmDeletePage;
