import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-[#F3F7EC] text-gray-800 min-h-screen">
      <section className="py-16 px-6 md:px-20 text-center bg-[#D7E8BA] rounded-b-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-[#4A6C41]">
          Welcome to Solace Spa
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4">
          A serene escape to rejuvenate your mind, body, and soul. Experience the magic of relaxation.
        </p>
      </section>
      <section className="py-16 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-[#5C7848]">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              At **Solace Spa**, we believe in the transformative power of relaxation. Founded in 2015, our spa is a sanctuary where ancient healing techniques blend with modern luxury.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide a **personalized wellness experience** that nurtures your body and calms your mind.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://i.pinimg.com/736x/d7/fd/9b/d7fd9b329f9db40342f675efaf50ccf1.jpg"
              alt="Spa Relaxation"
              className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#E7F3D4] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#5C7848]">Our Signature Treatments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 px-6 md:px-20">
          {[
            { img: "https://i.pinimg.com/736x/8e/7f/f0/8e7ff00dc225dfd482da04a06021b84a.jpg", title: "Aromatherapy Massage", desc: "A soothing massage with essential oils to calm your mind and relax your muscles." },
            { img: "https://i.pinimg.com/736x/4b/a6/51/4ba651b4d1b763d8e90b072d12140d7c.jpg", title: "Hydrating Facial", desc: "Deep hydration treatment that restores skin radiance and glow." },
            { img: "https://i.pinimg.com/736x/4a/c4/16/4ac4165c57ae7a33415b83492bc68a33.jpg", title: "Detoxifying Body Wrap", desc: "A full-body detox wrap that leaves your skin smooth and refreshed." },
          ].map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-500">
              <img src={service.img} alt={service.title} className="rounded-lg shadow-md w-full mb-4" />
              <h3 className="text-xl font-semibold text-[#4A6C41]">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center text-[#5C7848]">Meet Our Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {[
            { name: "Hồ Thị B", role: "Massage Specialist", img: "https://i.pinimg.com/736x/5e/b4/43/5eb443c26a194f92d7a9b6962eba7a28.jpg" },
            { name: "Daniel Smith", role: "Skincare Expert", img: "https://i.pinimg.com/736x/91/b0/7a/91b07a0d4b6ea6076f165dca5bba9c9a.jpg" },
            { name: "Emily Johnson", role: "Wellness Coach", img: "https://i.pinimg.com/736x/f0/b4/c5/f0b4c5cc4bcd32b815b2880604e4a88a.jpg" },
          ].map((expert, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <img src={expert.img} alt={expert.name} className="rounded-full w-32 h-32 mx-auto shadow-md mb-4" />
              <h3 className="text-lg font-semibold text-[#4A6C41]">{expert.name}</h3>
              <p className="text-gray-600">{expert.role}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 md:px-20 bg-[#E7F3D4] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#5C7848]">
          Our Locations
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Find a Solace Spa near you and enjoy a relaxing retreat.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {[
            {
              img: "https://i.pinimg.com/736x/59/d6/32/59d632e9b70b43c2aaa504e7e5a7ff1f.jpg",
              city: "Hồ Chí Minh",
              address: "123 Đường Lê Lợi, Quận 1",
              phone: "+1 (212) 555-1234",
              hours: "Mon-Sun: 9 AM - 9 PM",
              mapLink: "https://goo.gl/maps/xyz123",
            },
            {
              img: "https://i.pinimg.com/736x/74/39/1d/74391d37d6853a1a977274c5ad770e48.jpg",
              city: "Hồ Chí Minh",
              address: "456 Đường Nguyễn Đình Chiểu, Quận 3",
              phone: "+1 (323) 555-5678",
              hours: "Mon-Sun: 10 AM - 8 PM",
              mapLink: "https://goo.gl/maps/abc456",
            },
            {
              img: "https://i.pinimg.com/736x/48/41/e2/4841e21215adb9b7731dd2ed54c70944.jpg",
              city: "Hồ Chí Minh",
              address: "789 Đường Trần Hưng Đạo, Quận 5",
              phone: "+1 (305) 555-7890",
              hours: "Mon-Sun: 8 AM - 10 PM",
              mapLink: "https://goo.gl/maps/def789",
            },
          ].map((location, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-500"
            >
              <img
                src={location.img}
                alt={location.city}
                className="rounded-lg shadow-md w-full mb-4"
              />
              <h3 className="text-xl font-semibold text-[#4A6C41]">{location.city}</h3>
              <p className="text-gray-600">{location.address}</p>
              <p className="text-gray-600">{location.phone}</p>
              <p className="text-gray-600">{location.hours}</p>
              <a
                href={location.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-[#6D9801] text-white text-sm font-semibold rounded-full shadow-md hover:bg-[#5B7E01] transition-colors duration-300"
              >
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#D7E8BA] text-center rounded-t-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#4A6C41]">Experience Pure Relaxation</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Book your appointment today and embark on a journey of self-care and rejuvenation.
        </p>
        <button className="mt-6 px-6 py-3 bg-[#6D9801] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#5B7E01] transition-colors duration-300">
          Book Now
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
