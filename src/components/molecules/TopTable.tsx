interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface TopItemsTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const TopItemsTable = <T,>({ data, columns }: TopItemsTableProps<T>) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Dịch vụ được ưa chuộng nhất</h2>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((col, idx) => (
              <th key={idx} className="text-left p-2">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="border-b">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="p-2">{col.accessor(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopItemsTable;