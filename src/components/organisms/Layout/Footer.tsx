const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-xl font-bold mb-4">Solace Spa</h3>
          <p className="text-gray-200 mb-4 text-center lg:text-left">
            Experience tranquility and rejuvenation with our premium spa services tailored to your needs.
          </p>
          <p className="text-gray-400">© {new Date().getFullYear()} Solace Spa. All rights reserved.</p>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-center lg:text-left">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">About Us</a></li>
            <li><a href="#" className="hover:text-gray-300">Services</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <p className="mb-2">123 Serenity Street, Peaceville</p>
          <p className="mb-2">Phone: +1 (555) 123-4567</p>
          <p className="mb-6">Email: info@solacespa.com</p>

          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-gray-300">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-start mt-6 lg:mt-0">
          <p className="text-white font-extrabold text-center lg:text-left">
            <a href="/terms" className="hover:text-gray-300">Terms and Policies</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
