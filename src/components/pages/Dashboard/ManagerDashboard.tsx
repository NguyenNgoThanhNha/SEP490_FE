import { RevenueByBranch } from "@/components/organisms/RevenueByBranchChart/RevenueByBranchChart";
import { SoldProductByBranch } from "@/components/organisms/SoldProductByBranch/SoldProductByBranch";
import { useTranslation } from "react-i18next";

const ManagerDashboard = () => {
    const {t} = useTranslation();
  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">{t("revenuebranch")}</h2>
        <RevenueByBranch />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">{t("soldproductbranch")}</h2>
          <SoldProductByBranch />
        </div>
        {/* <div className="bg-white rounded-2xl shadow p-6">...</div> */}
      </div>
    </div>
  );
};

export default ManagerDashboard;
