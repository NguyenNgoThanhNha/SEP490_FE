import React from 'react';
import service from '@/assets/images/service.png';

const floatSpinAnimation = {
  animation: 'floatSpin 5s ease-in-out infinite',
};

const keyframes = `
@keyframes floatSpin {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}
`;

const ServicesSection: React.FC = () => {
  return (
    <>
      <style>
        {keyframes}
      </style>
      <div className="relative text-center lg:text-left pt-8">
        <h2 className="text-4xl font-bold text-primary my-10 ml-20">
          Explore Our Services
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between relative">
          {/* Floating pastel circles */}
          <div
            style={floatSpinAnimation}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[300px] h-[300px] bg-[#E8F8F5] rounded-full opacity-50 z-0"
          ></div>
          <div
            style={floatSpinAnimation}
            className="absolute top-10 left-1/4 w-[250px] h-[250px] bg-[#F9F6D2] rounded-full opacity-50 z-0"
          ></div>
          <div
            style={floatSpinAnimation}
            className="absolute right-24 w-[200px] h-[200px] bg-[#FAD4D8] rounded-full opacity-50 z-0"
          ></div>

          {/* Left Text Content */}
          <div className="relative z-30 w-full lg:w-1/2 text-left space-y-8 px-4 lg:px-8">
            <ul className="space-y-8">
              <li className="flex items-start">
                <span className="bg-[#FECFD0] text-white p-3 rounded-full mr-4">%</span>
                <div>
                  <p className="font-semibold text-2xl mb-2">Easy and Intuitive Booking Process</p>
                  <p className="text-[#130F49] text-lg">
                    Our app offers a streamlined booking experience, allowing users to schedule their desired services in just a few taps.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-[#FEDFB1] text-white p-3 rounded-full mr-4">🔔</span>
                <div>
                  <p className="font-semibold text-2xl mb-2">Real-Time Availability</p>
                  <p className="text-[#130F49] text-lg">
                    Users can view real-time availability for all services, ensuring they can book appointments that fit their schedules.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Center Image */}
          <div
            style={floatSpinAnimation}
            className="relative w-[50%] max-w-[350px] mx-8 my-10 lg:my-0 flex justify-center"
          >
            <img
              src={service}
              alt="Services"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Right Text Content */}
          <div className="relative z-30 w-full lg:w-1/2 text-left space-y-8 px-4 lg:px-8">
            <ul className="space-y-8">
              <li className="flex items-start">
                <span className="bg-[#FAD4D8] text-white p-3 rounded-full mr-4">🌟</span>
                <div>
                  <p className="font-semibold text-2xl mb-2">Personalized Services</p>
                  <p className="text-[#130F49] text-lg">
                    Tailored experiences for every customer, ensuring satisfaction and a personalized touch.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-[#B0EACD] text-white p-3 rounded-full mr-4">💬</span>
                <div>
                  <p className="font-semibold text-2xl mb-2">Seamless Communication</p>
                  <p className="text-[#130F49] text-lg">
                    Stay informed with notifications and updates, ensuring a smooth service experience.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesSection;
