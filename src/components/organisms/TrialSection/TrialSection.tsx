import React from 'react';
import map from '@/assets/images/map.jpg';
import { useTranslation } from 'react-i18next';

const TrialSection: React.FC = () => {
  const { t } = useTranslation(); // Hook để sử dụng i18next

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-20 px-6 lg:px-10 bg-[#E8F8F5]">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div
        className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center w-full max-w-5xl mx-auto animate-fadeIn"
        style={{ animation: 'fadeIn 1.5s ease-out' }}
      >
        {/* Left Content Section */}
        <div className="lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0 lg:pr-10">
          <h2 className="text-3xl font-bold text-[#130F49] mb-4">
            {t('trialTitle')} {/* Sử dụng khóa dịch */}
          </h2>
          <p className="text-xl text-[#130F49] mb-4">
            {t('trialDescription1')} {/* Sử dụng khóa dịch */}
          </p>
          <p className="text-lg text-[#130F49] mb-4">
            {t('trialDescription2')} {/* Sử dụng khóa dịch */}
          </p>
          <button
            className="px-6 py-3 bg-[#516D6A] text-white rounded-full text-lg shadow-lg hover:bg-[#425953] transition"
            style={{ animation: 'fadeIn 2s ease-out 0.5s', animationFillMode: 'backwards' }}
          >
            <span>{t('trialButton')}</span> {/* Sử dụng khóa dịch */}
          </button>
        </div>

        {/* Right Content Section (Map Image) */}
        <div
          className="lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0"
          style={{ animation: 'fadeIn 2s ease-out 0.5s', animationFillMode: 'backwards' }}
        >
          <img
            src={map}
            alt={t('trialImageAlt')} // Sử dụng khóa dịch
            className="w-[70%] max-w-xs object-contain opacity-90 rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default TrialSection;
