import React, { useState } from 'react';
import logo from '@/assets/images/solace.png';
import { Link, useNavigate } from 'react-router-dom';
import i18n from 'i18next';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <nav className="bg-[#FDFCE5] shadow-lg top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="SPA Center Logo" className="w-20 h-15" />
          <span className="text-2xl font-bold text-[#516D19]">Solace</span>
        </Link>
        <div className="hidden md:flex flex-1 justify-center space-x-6 font-semibold text-[#516D19] hover:text-primary transition">
          <a href="/about-us">{i18n.t('aboutUs')}</a>
          <a href="/our-services">{i18n.t('service')}</a>
          <a href="/contact">{i18n.t('contact')}</a>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-4 py-2 text-sm rounded-full bg-[#FDFCE5] border-2 border-[#516D19] text-[#516D19] font-semibold shadow-sm hover:bg-[#f2f1d4] transition"
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>

          <button
            className="px-6 py-2 bg-[#516D19] text-white rounded-full hover:bg-opacity-90 transition"
            onClick={handleLogin}
          >
            {i18n.t('login')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
