import OrderPieChart from "@/components/organisms/OrderChart/OrderChart";
import { RevenueByBranch } from "@/components/organisms/RevenueByBranchChart/RevenueByBranchChart";
import Top5Service from "@/components/organisms/Top5/Top5Service";

const Dashboard = () => {

  return (
    <div className="p-8 min-h-screen space-y-8">
         <RevenueByBranch/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
         <OrderPieChart/>
        </div>
        <div className="space-y-8">
          <Top5Service/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
