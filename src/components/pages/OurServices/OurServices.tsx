import React from "react";

const OurServices: React.FC = () => {
    const services = [
        {
            id: 1,
            title: "Facial Treatments",
            description:
                "Relax and rejuvenate with our premium facial treatments tailored to your skin type.",
            image: "https://i.pinimg.com/736x/a1/06/87/a106870dd71a16ef554ddc7c8f55fe20.jpg",
        },
        {
            id: 2,
            title: "Body Massages",
            description:
                "Relieve stress and tension with our soothing and therapeutic body massages.",
            image: "https://i.pinimg.com/736x/74/85/35/74853575b3b00c71971bdda716d50a88.jpg",
        },
        {
            id: 3,
            title: "Hair Treatments",
            description: "Revitalize your hair with our luxurious hair care services.",
            image: "https://i.pinimg.com/736x/5a/42/fe/5a42fe7eb8c9df34994a5e187b7cb508.jpg",
        },

    ];

    const serviceSteps = [
        {
            id: 1,
            step: "Choose Your Package",
            description:
                "Select the spa package that best fits your needs from our carefully curated options.",
            image: "https://i.pinimg.com/736x/c3/8b/c1/c38bc1caf4f0c7fe1975c8cfa1e56a06.jpg",
        },
        {
            id: 2,
            step: "Schedule an Appointment",
            description:
                "Pick a convenient time to experience relaxation and rejuvenation.",
            image: "https://i.pinimg.com/736x/ce/b4/cf/ceb4cfe59e2dab21b4bdf535d8231683.jpg",
        },
        {
            id: 3,
            step: "Enjoy Your Service",
            description:
                "Sit back and unwind as our expert therapists provide the ultimate spa experience.",
            image: "https://i.pinimg.com/736x/2f/2e/14/2f2e14230ad0371a0025db99e1745b01.jpg",
        },
    ];

    return (
        <div className="text-white">
            {/* Hero Section */}
            <div
                className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
                style={{     background: "linear-gradient(to right,  #ffffff, #dcede2)" }}
            >
                <div className="bg-green-900 p-8 rounded-xl text-center">
                    <h1 className="text-4xl font-bold mb-4 mx-3">Our Premium Services</h1>
                    <p className="text-lg">
                        Discover the ultimate spa experience with our curated selection of
                        services designed to relax, rejuvenate, and revitalize.
                    </p>
                </div>
            </div>

            {/* Services Section */}
            <div className=" px-4 sm:px-8 md:px-16 lg:px-32">
                <h2 className="text-3xl font-bold text-center mb-12">Highlighted Services</h2>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white text-green-900 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                <p className="text-sm mb-4">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Steps Section */}
            <div className="py-12 px-4 sm:px-8 md:px-16 lg:px-32 bg-gray-100 text-green-900">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {serviceSteps.map((step) => (
                        <div key={step.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={step.image}
                                alt={step.step}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">{step.step}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* App Download Section */}
            <div className="bg-green-800 py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
                <p className="text-lg mb-8">
                    Experience the convenience of booking your favorite spa services anytime, anywhere.
                </p>
                <a
                    href="https://play.google.com/store" // Thay bằng link thực tế của ứng dụng
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/732/732208.png"
                        alt="Download on Google Play"
                        className="h-16 mx-auto"
                    />
                </a>
            </div>
        </div>
    );
};

export default OurServices;
