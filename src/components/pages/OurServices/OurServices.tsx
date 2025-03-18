import React, { useState } from "react";

const servicesData = [
  {
    id: 1,
    category: "Massage",
    name: "Massage Thư Giãn Toàn Thân",
    description:
      "Liệu pháp massage giúp giảm căng thẳng, tăng cường tuần hoàn máu và mang lại cảm giác thư thái tuyệt đối.",
    duration: "60 phút",
    price: "500,000 VND",
    image: "https://i.pinimg.com/736x/8e/7f/f0/8e7ff00dc225dfd482da04a06021b84a.jpg",
  },
  {
    id: 2,
    category: "Facial",
    name: "Chăm Sóc Da Chuyên Sâu",
    description:
      "Liệu trình giúp làn da trở nên tươi sáng, sạch sâu và cấp ẩm hiệu quả với sản phẩm cao cấp.",
    duration: "45 phút",
    price: "400,000 VND",
    image: "https://i.pinimg.com/736x/4b/a6/51/4ba651b4d1b763d8e90b072d12140d7c.jpg",
  },
  {
    id: 3,
    category: "Body Care",
    name: "Tẩy Tế Bào Chết & Dưỡng Ẩm Cơ Thể",
    description:
      "Loại bỏ tế bào chết, làm mềm và cung cấp độ ẩm sâu cho làn da mịn màng, căng bóng.",
    duration: "50 phút",
    price: "550,000 VND",
    image: "https://i.pinimg.com/736x/4a/c4/16/4ac4165c57ae7a33415b83492bc68a33.jpg",
  },
];

const OurServices: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="bg-[#F8F5E9] min-h-screen py-16 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center text-[#5C7848] mb-12">
        Dịch Vụ Của Chúng Tôi
      </h2>

      {/* Danh mục dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            onClick={() =>
              setSelectedService(selectedService === service.id ? null : service.id)
            }
          >
            <img
              src={service.image}
              alt={service.name}
              className="rounded-lg w-full mb-4"
            />
            <h3 className="text-xl font-semibold text-[#5C7848]">{service.name}</h3>
            <p className="text-gray-600">{service.duration} - {service.price}</p>
            {selectedService === service.id && (
              <p className="text-gray-700 mt-4">{service.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Khuyến mãi & Ưu đãi */}
      <section className="py-16 mt-16 bg-[#E3DED3] rounded-lg text-center">
        <h2 className="text-3xl font-bold text-[#5C7848]">Khuyến Mãi Đặc Biệt</h2>
        <p className="text-gray-700 mt-4">
          Nhận ngay ưu đãi giảm giá lên đến <strong>30%</strong> khi đặt lịch trước!
        </p>
        <button className="mt-6 px-6 py-3 bg-[#5C7848] text-white font-semibold rounded-full hover:bg-[#4A6236]">
          Tìm Hiểu Thêm
        </button>
      </section>

      {/* Hướng dẫn đặt lịch */}
      <section className="py-16 mt-16">
        <h2 className="text-3xl font-bold text-[#5C7848] text-center">
          Hướng Dẫn Đặt Lịch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-[#5C7848]">1. Chọn Dịch Vụ</h3>
            <p className="text-gray-700">Duyệt danh sách dịch vụ của chúng tôi và chọn dịch vụ yêu thích.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-[#5C7848]">2. Đặt Lịch Hẹn</h3>
            <p className="text-gray-700">Chọn thời gian phù hợp và điền thông tin để xác nhận đặt chỗ.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-[#5C7848]">3. Thư Giãn & Tận Hưởng</h3>
            <p className="text-gray-700">Đến spa đúng giờ, thư giãn và trải nghiệm dịch vụ tuyệt vời.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurServices;
