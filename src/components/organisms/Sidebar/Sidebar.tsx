import React, { useState } from "react";
import {
  DashboardIcon,
  ArchiveIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { AlignJustify, BookIcon, Calendar, ShoppingBag, SquareMenu, TicketIcon, TicketPercent, TicketPlus } from "lucide-react";
import { MenuItemComponent } from "@/components/molecules/MenuItem";
import { useTranslation } from "react-i18next";
import solace from "@/assets/images/solace.png";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  label: string;
  icon: JSX.Element;
  path?: string;
  submenu?: MenuItem[];
}
const getMenuItemsByRole = (roleID: number, t: (key: string) => string): MenuItem[] => {
  
  switch (roleID) {
    case 1: // Admin
      return [
        { label: t("dashboard"), icon: <DashboardIcon />, path: "/dashboard" },
        {
          label: t("products"),
          icon: <ArchiveIcon />,
          submenu: [
            { label: t("manageProducts"), icon: <ArchiveIcon />, path: "/products-management" },
            { label: t("addProduct"), icon: <ArchiveIcon />, path: "/create-product" },
          ],
        },
        {
          label: t("service"),
          icon: <ShoppingBag />,
          submenu: [
            { label: t("manageServices"), icon: <ShoppingBag />, path: "/services-management" },
            { label: t("addService"), icon: <ShoppingBag />, path: "/create-service" },
          ],
        },
        {
          label: t("employee"),
          icon: <PersonIcon />,
          submenu: [
            { label: t("manageEmployee"), icon: <PersonIcon />, path: "/staffs-management" },
            { label: t("addEmployee"), icon: <PersonIcon />, path: "/create-staff" },
          ],
        },
        // {
        //   label: t("blog"),
        //   icon: <ArchiveIcon />,
        //   submenu: [
        //     { label: t("manageBlog"), icon: <ArchiveIcon />, path: "/blog" },
        //     { label: t("createBlog"), icon: <ArchiveIcon />, path: "/create-blog" },
        //   ],
        // },
        // {
        //   label: t("order"),
        //   icon: <DashboardIcon />,
        //   submenu: [
        //     { label: t("manageOrder"), icon: <DashboardIcon />, path: "/order" },
        //     { label: t("createOrder"), icon: <DashboardIcon />, path: "/create-blog" },
        //   ],
        // },
        { label: t("customer"), icon: <PersonIcon />, path: "/customers-management" },
        {
          label: t("promote"),
          icon: <TicketPercent />,
          submenu: [
            { label: t("promote"), icon: <TicketPercent />, path: "/promotions-management" },
            { label: t("addPromote"), icon: <TicketPercent />, path: "/create-promote" },
          ],
        },
        {
          label: t("branch"),
          icon: <TicketPercent />,
          submenu: [
            { label: t("manageBranch"), icon: <TicketPercent />, path: "/branchs-management" },
            { label: t("addBranch"), icon: <TicketPercent />, path: "/add-branch" },
          ],
        },
        { label: t("manageCateSer"), icon: <SquareMenu />, path: "/service-cate-management" },
        { label: t("manageAppoinment"), icon: <BookIcon />, path: "/appoinments-management" },
        { label: t("manageRoutine"), icon: <BookIcon />, path: "/routine-management" },
        {
          label: t("voucher"),
          icon: <PersonIcon />,
          submenu: [
            { label: t("manageVoucher"), icon: <TicketIcon />, path: "/voucher-management" },
            { label: t("addVoucher"), icon: <TicketPlus />, path: "/add-voucher" },
          ],
        },
        { label: t("settings"), icon: <GearIcon />, path: "/settings" },
        { label: t("signOut"), icon: <ExitIcon />, path: "/sign-out" },
      ];
    case 2: // Manager
      return [
        { label: t("dashboard"), icon: <DashboardIcon />, path: "/dashboard" },
        { label: t("manageOrder"), icon: <ShoppingBag />, path: "/order" },
        { label: t("manageCalendar"), icon: <Calendar />, path: "/staff-calendar" },
        { label: t("manageBranchPromotion"), icon: <ShoppingBag />, path: "/branch-promotion-management" },
        { label: t("manageBranchProduct"), icon: <ShoppingBag />, path: "/branch-product-management" },
        { label: t("manageSchedule"), icon: <BookIcon />, path: "/schedule-management" },
        { label: t("manageChat"), icon: <ChatBubbleIcon />, path: "/chat" },
        { label: t("signOut"), icon: <ExitIcon />, path: "/sign-out" },

      ];
    case 3: // Cashier
      return [
        { label: t("indeskBooking"), icon: <BookIcon />, path: "/booking-form" },
        { label: t("chat"), icon: <BookIcon />, path: "/chat" },
        { label: t("signOut"), icon: <ExitIcon />, path: "/sign-out" },
      ];
    default:
      return [];
  }
};


const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);
  const { t } = useTranslation();
  const roleID = useSelector((state: RootState) => state.auth.user?.roleID);
  const menuItems = getMenuItemsByRole(roleID || 0, t);

  const renderMenuItems = (items: MenuItem[]) => (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="group relative">
          <MenuItemComponent item={item} isSidebarOpen={isSidebarOpen} />
          {!isSidebarOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 hidden px-3 py-1 text-sm text-white bg-gray-800 rounded-md shadow-lg group-hover:block">
              {item.label}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`fixed z-50 m-0 top-0 left-0 h-screen transition-all duration-300  shadow-lg flex flex-col ${isSidebarOpen ? "w-64" : "w-0"
        }`}
    >
      <div className="flex items-center justify-between px-4 py-4 ">
        {isSidebarOpen && (
          <>
            <img src={solace} alt="Solace Spa"
              className="w-10 h-10 object-cover rounded-full"
            />
            <h1 className="text-lg font-semibold text-[#516D19]">Solace Spa</h1>
          </>
        )}
        <button
          className="w-10 h-10 flex items-center justify-center text-[#516D19] hover:bg-gray-100 "
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            toggleSidebar();
          }}
        >
          <AlignJustify />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        {isSidebarOpen && renderMenuItems(menuItems)}
      </div>
    </div>
  );
};

export default Sidebar;
