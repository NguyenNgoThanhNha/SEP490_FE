import ActionBar from "@/components/molecules/ActionBar";

const CustomerManagementPage = () => {

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

      <div className="bg-white shadow-md rounded-lg p-4">
        <ActionBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onExport={handleExport}
          onImport={handleImport}
          onAdd={handleAdd}
        />
        {/* <Table
          headers={headers}
          data={customersData}
          selectable
          badgeConfig={badgeConfig}
          actions={
            <div className="flex space-x-2">
              <button className="text-blue-500 hover:text-blue-700">
                <Edit className="w-5 h-5" />
              </button>
              <button className="text-red-500 hover:text-red-700">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          }
        /> */}
      </div>
    </div>
  );
};

export default CustomerManagementPage;
