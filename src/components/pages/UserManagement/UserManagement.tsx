import ActionBar from "@/components/molecules/ActionBar";
import ReusableAreaChart from "@/components/molecules/AreaChart";
import PieChart from "@/components/molecules/PieChart";
import { Table } from "@/components/organisms/Table/Table";
import { customersData } from "@/data/customer";

const CustomerManagementPage = () => {

  const activeUsersData = [
    { label: "Mon", value: 2000 },
    { label: "Tue", value: 1150 },
    { label: "Wed", value: 1800 },
    { label: "Thu", value: 900 },
    { label: "Fri", value: 2100 },
    { label: "Sat", value: 3200 },
    { label: "Sun", value: 2900 },
  ];
  const headers = [
    { label: "User name", key: "name" },
    { label: "Address", key: "address" },
    { label: "Phone number", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Account", key: "status" },
  ];

  const badgeConfig = {
    key: "status",
    values: {
      true: {
        label: "Active",
        color: "bg-green-500",
        textColor: "white", 
      },
      false: {
        label: "Inactive",
        color: "bg-red-500",
        textColor: "white",
      },
    },
  };

  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleImport = (file: File) => {
    console.log("Imported file:", file.name);
  };

  const handleAdd = () => {
  };


  return (
    <div className="p-6 min-h-screen">
      <div className="flex gap-6 mb-8">
        <div className="flex-1">
          <ReusableAreaChart
            title="Active users"
            showTotal={true}
            chartData={activeUsersData}
          />
        </div>
        <div className="flex-1">
          <PieChart
            title="Gender Distribution"
            labels={["Female", "Male", "Others"]}
            data={[59, 20, 21]}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <ActionBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onExport={handleExport}
          onImport={handleImport}
          onAdd={handleAdd}
        />
        <Table
          headers={headers}
          data={customersData}
          selectable
          badgeConfig={badgeConfig}
          actions={
            <div className="flex space-x-2">
              <button className="text-blue-500 hover:underline">Edit</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CustomerManagementPage;
