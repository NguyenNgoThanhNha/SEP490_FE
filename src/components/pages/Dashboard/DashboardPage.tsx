import LineChart from "@/components/molecules/LineChart";
import OverallSales from "@/components/molecules/OverallSales";
import SalesSummary from "@/components/molecules/SaleSummary";
import TopItemsTable from "@/components/molecules/TopTable";

const Dashboard = () => {
  const products = [
    { name: "Home Decor Range", popularity: 45, sales: "30%" },
    { name: "Disney Princess Bag", popularity: 25, sales: "20%" },
  ];

  const services = [
    { name: "Bathroom Essentials", popularity: 50, sales: "35%" },
    { name: "Air Conditioner Service", popularity: 40, sales: "25%" },
  ];
  return (
    <div className="p-8 min-h-screen space-y-8">
      <SalesSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <OverallSales />
          <TopItemsTable data={products} />
        </div>
        <div className="space-y-8">
          <LineChart  />
          <TopItemsTable data={services}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
