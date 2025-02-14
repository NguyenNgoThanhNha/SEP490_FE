import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Layout/Header";
import Sidebar from "../organisms/Sidebar/Sidebar";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex bg-[#F9FAFB]">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header />
        <div className="flex-1 p-8 bg-[#F9FAFB]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
