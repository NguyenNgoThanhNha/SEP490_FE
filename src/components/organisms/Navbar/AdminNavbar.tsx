import React, { useState } from "react";
import { BellIcon} from "@radix-ui/react-icons";
import i18n from "i18next";

interface NavbarProps {
  title?: string;
  onSearch?: (value: string) => void;
  user?: { name: string; role: string; avatar: string };
  languages?: { code: string; label: string }[];
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  user,
  languages = [],
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);


  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white ">
      {title && <h2 className="text-2xl font-semibold text-[#516D19516D19]">{title}</h2>}

      <div className="flex items-center gap-4">
        {languages.length > 0 && (
          <select
            className="px-3 py-2 text-sm border rounded-lg bg-white border-gray-300 text-gray-800"
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        )}
        <button className="text-gray-500 hover:text-gray-800">
          <BellIcon className="w-6 h-6" />
        </button>
        {user && (
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
              <small className="text-xs text-gray-500">{user.role}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
