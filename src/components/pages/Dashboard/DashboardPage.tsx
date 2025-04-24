import OverallSales from "@/components/molecules/OverallSales";
import TopItemsTable from "@/components/molecules/TopTable";
import { RevenueByBranch } from "@/components/organisms/RevenueByBranchChart/RevenueByBranchChart";
import { Top3RevenueBranch } from "@/components/organisms/Top3Revenue/Top3RevenueBranch";

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
         <RevenueByBranch/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <OverallSales />
          <TopItemsTable data={products} />
        </div>
        <div className="space-y-8">
          <Top3RevenueBranch/>
          <TopItemsTable data={services}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
