import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#243C1E] text-white min-h-screen">
     
      <section className="py-16 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
            <p className="text-gray-300 leading-relaxed">
              At Solace Spa, we believe in the transformative power of relaxation and self-care. Our luxurious spa treatments 
              are tailored to provide you with a serene escape from the stresses of daily life.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Whether you’re here for a full-body massage, a soothing facial, or a revitalizing body wrap, our experienced 
              therapists are dedicated to making your visit unforgettable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://i.pinimg.com/736x/36/be/1a/36be1a6e1981bd5e9fcbcf16b6e2753c.jpg"
              alt="Spa Interior"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
            <img
              src="https://i.pinimg.com/736x/d7/fd/9b/d7fd9b329f9db40342f675efaf50ccf1.jpg"
              alt="Spa Treatment Room"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
            <img
              src="https://i.pinimg.com/736x/c1/13/e2/c113e2160b79e983c1e6ae9871da608f.jpg"
              alt="Massage Session"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
            <img
              src="https://i.pinimg.com/736x/4d/35/9e/4d359ec88996c435537eb335a657f16f.jpg"
              alt="Premium Spa Products"
              className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Services Highlight Section */}
      <section className="py-16 bg-[#2E4A25]">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Our Premium Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 px-6 md:px-20">
          <div className="space-y-4 text-center">
            <img
              src="https://i.pinimg.com/736x/8e/7f/f0/8e7ff00dc225dfd482da04a06021b84a.jpg"
              alt="Massage"
              className="rounded-lg shadow-lg w-full transform hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-xl font-semibold">Relaxing Massages</h3>
            <p className="text-gray-300">
              Indulge in a variety of massages that release tension and improve circulation.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <img
              src="https://i.pinimg.com/736x/4b/a6/51/4ba651b4d1b763d8e90b072d12140d7c.jpg"
              alt="Facial"
              className="rounded-lg shadow-lg w-full transform hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-xl font-semibold">Rejuvenating Facials</h3>
            <p className="text-gray-300">
              Revitalize your skin with our customized facial treatments.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <img
              src="https://i.pinimg.com/736x/4a/c4/16/4ac4165c57ae7a33415b83492bc68a33.jpg"
              alt="Body Wrap"
              className="rounded-lg shadow-lg w-full transform hover:scale-105 transition-transform duration-500"
            />
            <h3 className="text-xl font-semibold">Luxurious Body Wraps</h3>
            <p className="text-gray-300">
              Detoxify and refresh your body with our luxurious body wraps.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#243C1E]">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Experience the Luxury</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Treat yourself to a day of relaxation and rejuvenation at Solace Spa. Book your appointment today and let us take care of you.
          </p>
          <button className="px-6 py-3 bg-[#6D9801] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#5B7E01] transition-colors duration-300">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
