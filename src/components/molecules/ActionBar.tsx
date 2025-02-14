import { Download, Filter, Plus, Search, Upload } from "lucide-react";
import React, { useState } from "react";

interface ActionBarProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onAdd: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onSearch,
  onFilter,
  onExport,
  onImport,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 bg-white ">
      <div className="relative flex items-center flex-grow">
        <Search className="absolute left-3 text-gray-500" /> 
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onFilter}
          className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
          title="Filter"
        >
          <Filter className="text-lg" />
        </button>

        <button
          onClick={onExport}
          className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"
          title="Export"
        >
          <Download className="text-lg" />
        </button>

        <label
          className="relative p-2 text-white bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600"
          title="Import"
        >
          <Upload className="text-lg" />
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        <button
          onClick={onAdd}
          className="p-2 text-white bg-purple-500 rounded-full hover:bg-purple-600"
          title="Add"
        >
          <Plus className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
