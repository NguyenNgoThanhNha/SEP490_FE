import React, { useEffect, useRef, useState } from 'react';
import product from '@/assets/images/img.png';
import chplay from '@/assets/images/chplay.png';

const fadeInAnimation = {
  animation: 'fadeIn 2s ease-out',
};

const keyframes = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const ProductsSection: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 0.5, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div
        ref={sectionRef}
        className={`flex items-center justify-center bg-yellow-100 transition-all duration-500 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={fadeInAnimation}
      >
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 flex justify-center lg:justify-start mb-10 lg:mb-0 mr-72">
            <div className="relative flex items-center justify-center">
              <div className="absolute items-center"></div>
              <img
                src={product}
                alt="Product"
                className="relative w-full max-w-md mb-20 mt-20 transition-all duration-700"
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2
              className={`text-4xl font-bold text-primary mb-4 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Shop Our Exclusive Products
            </h2>
            <p
              className={`text-lg text-gray-600 max-w-md mb-8 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Discover the transformative power of our premium skincare line, crafted to enhance your natural beauty and promote healthy, radiant skin.
            </p>
            <button className="flex items-center px-6 py-3 bg-[#cce8fd] text-[#130f49] rounded-full text-lg">
              <img src={chplay} alt="CH Play" className="w-4 h-4 mr-2" />
              <div className="text-left">
                <span className="block text-sm font-semibold">Get it on</span>
                <span className="block text-base font-bold">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsSection;
