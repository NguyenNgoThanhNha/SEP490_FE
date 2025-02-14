import React from 'react';
import hero from '@/assets/images/hero.png'; // Hero image

const HeroSection: React.FC = () => {
  return (
    <>
      <style>
        {`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes flyIn {
          from {
            transform: translateX(-50%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        `}
      </style>
      <div className="relative flex items-center justify-between overflow-hidden px-8 py-12 ">
        <div
          style={{ animation: 'float 3s ease-in-out infinite' }}
          className="absolute top-0 left-1/3 transform -translate-x-1/2 w-[300px] h-[300px] bg-[#B2E8B2] rounded-full opacity-50 z-0 mt-4"
        ></div>
        <div
          style={{ animation: 'float 3s ease-in-out infinite' }}
          className="absolute bottom-10 right-1/4 w-[250px] h-[250px] bg-[#A1D6A1] rounded-full opacity-30 z-0"
        ></div>
        <div
          style={{ animation: 'float 3s ease-in-out infinite' }}
          className="absolute top-20 right-10 w-[200px] h-[200px] bg-[#79C79D] rounded-full opacity-20 z-0"
        ></div>

        <div
          className="relative lg:w-1/2 flex flex-col justify-center items-start text-left z-10 animate-flyIn"
          style={{ animation: 'flyIn 1.5s ease-out forwards' }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-[#2e294e] leading-tight mb-6">
            Discover Serenity at <span className="text-[#F56A79]">Solace Spa</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-600 mb-6">
            Rejuvenate your mind and body with our premium SPA services designed for ultimate relaxation and wellness.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-[#130F49] text-white rounded-full text-lg shadow-lg hover:bg-[#0e0c3b] transition">
              Book Your Session
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-[#130F49] text-[#130F49] rounded-full text-lg hover:bg-[#130F49] hover:text-white transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div
          className="relative lg:w-1/2 flex justify-center items-center z-10"
          style={{ animation: 'fadeIn 1.5s ease-out forwards', animationDelay: '0.5s' }}
        >
          <img
            src={hero}
            alt="Relaxation"
            className="relative w-[90%] lg:w-[75%] max-w-xl"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
