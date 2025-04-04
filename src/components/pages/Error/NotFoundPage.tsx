import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <img
        src="https://i.pinimg.com/736x/8f/33/87/8f3387d2948d6e1eec4753ffd667eb1f.jpg"
        alt="Mike Wazowski"
        className="w-1/5 mb-6"
      />
      <h1 className="text-3xl font-bold text-[#516D19]">OOPS! PAGE NOT FOUND.</h1>
      <p className="text-gray-600 mt-2">
        You must have picked the wrong door because I haven't been able to lay my eye on the page you've been searching for.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-6 py-3 bg-[#516D19] text-white rounded-full shadow-md hover:bg-green-700 hover:text-white transition"
      >
        BACK TO HOME
      </Link>
    </div>
  );
};

export default NotFoundPage;
