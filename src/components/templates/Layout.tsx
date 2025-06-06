import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../molecules/Navbar";
import Footer from "../organisms/Layout/Footer";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
