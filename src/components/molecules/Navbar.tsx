import React from 'react';
import logo from '@/assets/images/solace.png';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const handleLogin =() => {
        navigate('/login');
    }
    return (
        <nav className="bg-[#FDFCE5] shadow-lg top-0 left-0 w-full z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="SPA Center Logo" className="w-20 h-15" />
                    <span className="text-2xl font-bold text-primary">Solace</span>
                </div>

                {/* Links Section */}
                <div className="hidden md:flex flex-1 justify-center space-x-6 font-semibold text-[#516D19] hover:text-primary transition">
                    <a href="/about-us">About Us</a>
                    <a href="/our-services">Services</a>
                    <a href="/contact">Contact</a>
                </div>

                {/* Login Button */}
                <button className="px-6 py-2 bg-[#516D19] text-white rounded-full hover:bg-opacity-90 transition" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
