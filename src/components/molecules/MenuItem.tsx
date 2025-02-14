import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  label: string;
  icon: JSX.Element;
  path?: string;
  submenu?: MenuItem[];
}

interface MenuItemComponentProps {
  item: MenuItem;
  isSidebarOpen: boolean;
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  isSidebarOpen,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const hasSubmenu = !!item.submenu;

  const handleToggleSubmenu = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault(); 
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="flex flex-col">
      <Link
        to={item.path || "#"}
        className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
          location.pathname === item.path
            ? "bg-[#516D19] text-white"
            : "text-[#516D19] hover:bg-[#D8EDAD] hover:text-[#516D19] "
        }`}
        onClick={handleToggleSubmenu}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md">
          {React.cloneElement(item.icon, { className: "w-6 h-6" })}
        </div>
        {isSidebarOpen && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
        {hasSubmenu && isSidebarOpen && (
          <span className="ml-auto">
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </span>
        )}
      </Link>

      {hasSubmenu && isOpen && (
        <ul className="ml-6 mt-2 space-y-2">
          {item.submenu?.map((subItem, idx) => (
            <li key={idx}>
              <Link
                to={subItem.path!}
                className={`flex items-center gap-4 p-2 rounded-lg text-[#516D19] hover:bg-[#D8EDAD] ${
                  location.pathname === subItem.path
                    ? "bg-[#516D19] text-white"
                    : "text-[#516D19] hover:bg-[#D8EDAD] hover:text-[#516D19] "
                  }`}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  {React.cloneElement(subItem.icon, { className: "w-5 h-5" })}
                </div>
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{subItem.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
