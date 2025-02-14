import { useState } from "react";

interface Item {
  name: string;
  popularity: number;
  sales: string;
}

interface TopItemsTableProps {
  data: Item[];
}

const TopItemsTable = ({ data }: TopItemsTableProps) => {
  const [month, setMonth] = useState<string>("01");
  const [year, setYear] = useState<string>("2024");

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top Items</h2>
        <div className="flex space-x-4">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="p-2 rounded border border-gray-300"
          >
            {[...Array(12)].map((_, index) => {
              const monthValue = (index + 1).toString().padStart(2, "0");
              return (
                <option key={monthValue} value={monthValue}>
                  {monthValue}
                </option>
              );
            })}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 rounded border border-gray-300"
          >
            {Array.from({ length: 5 }, (_, index) => 2020 + index).map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Popularity</th>
            <th className="text-left p-2">Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">
                <div className="relative h-2 bg-gray-200 rounded">
                  <div
                    className="absolute top-0 left-0 h-2 rounded bg-green-500"
                    style={{ width: `${item.popularity}%` }}
                  ></div>
                </div>
              </td>
              <td className="p-2">{item.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopItemsTable;
