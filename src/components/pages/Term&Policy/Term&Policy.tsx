import { termsData } from "@/data/termandpolicy";

const InformationPage = () => {
  return (
    <div className="min-h-screen bg-white mx-12">
      <header className="bg-green-600 text-white text-center py-12">
        <h1 className="text-4xl font-bold">Chính sách & Điều khoản Solace Spa</h1>
        <p className="text-lg mt-4 mx-22">
        Khi sử dụng dịch vụ hoặc mua sản phẩm tại Solace Spa, khách hàng đồng ý với các điều khoản và chính sách dưới đây.
        </p>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {termsData.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-bold text-green-800">{section.title}</h2>
              <p className="ml-6" dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default InformationPage;
