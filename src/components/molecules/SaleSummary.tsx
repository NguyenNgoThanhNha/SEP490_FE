import { PersonIcon, ArchiveIcon } from "@radix-ui/react-icons";
import InfoCard from "../atoms/info-card";
import {  ScrollText , TagsIcon } from "lucide-react";

const SalesSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8 bg-white p-6 rounded-lg">
      <InfoCard
        title="Total Sales"
        value="$1k"
        description="+8% from yesterday"
        icon={<ArchiveIcon className="size-8" color="white" />}
        bgColor="bg-[#FFE2E5]"
        iconBgColor="bg-[#FA5A7D]"
      />
      <InfoCard
        title="Total Orders"
        value="300"
        description="+15% from yesterday"
        icon={< ScrollText className="size-8" color="white" />}
        bgColor="bg-[#FFF4DE]"
        iconBgColor="bg-[#FF947A]"
      />
      <InfoCard
        title="Products Sold"
        value="5"
        description="+1.2% from yesterday"
        icon={<TagsIcon className="size-8" color="white" />}
        bgColor="bg-[#DCFCE7]"
        iconBgColor="bg-[#3CD856]"
      />
      <InfoCard
        title="Service Sold"
        value="12"
        description="+1.8% from yesterday"
        icon={<TagsIcon className="size-8" color="white"/>}
        bgColor="bg-[#FFDC98]"
        iconBgColor="bg-[#FFCC00]"
      />
        <InfoCard
        title="New Customers"
        value="8"
        description="+0.5% from yesterday"
        icon={<PersonIcon className="size-8" color="white" />}
        bgColor="bg-[#F3E8FF]"
        iconBgColor="bg-[#BF83FF]"
      />
    </div>
  );
};

export default SalesSummary;
