import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronUp, ChevronDown, FileDown, FileUp } from 'lucide-react';
import SearchInput from '@/components/atoms/search-input';

interface BadgeConfig<T> {
  key: keyof T;
  values: {
    [key: string]: {
      label: string;
      color: string;
      textColor: string;
    };
  };
}

interface TableProps<T> {
  headers: { label: string; key: keyof T; sortable?: boolean; hiding?: boolean; searchable?: boolean }[];
  data: T[];
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  actions?: (row: T) => ReactNode;
  badgeConfig?: BadgeConfig<T>;
  onSearch?: (query: string) => void;
  filters?: { key: keyof T; values: string[]; type?: 'time' | 'default' }[];
  onAction?: (action: string, row: T) => void;
  onImport?: () => void;
  onExport?: () => void;
}

export const Table = React.memo(<T extends Record<string, unknown>>({
  headers,
  data = [],
  selectable = false,
  onRowSelect = () => { },
  actions,
  badgeConfig,
  onSearch,
  filters = [],
  onAction,
  onImport,
  onExport,
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(
    new Set(headers.filter((header) => header.hiding).map((header) => header.key))
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSort = (key: keyof T, direction?: 'asc' | 'desc') => {
    const nextDirection = direction || (sortConfig?.direction === 'asc' ? 'desc' : 'asc');
    setSortConfig({ key, direction: nextDirection });
  };
  
  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!sortConfig) return data;
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredData = useMemo(() => {
    if (!Array.isArray(sortedData)) return [];
    return sortedData.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [sortedData, searchQuery]);

  const renderBadge = (key: keyof T, value: T[keyof T]) => {
    const badge = badgeConfig?.[key];
    if (!badge) return value;
    const badgeStyle = badge[value as keyof typeof badge];
    return badgeStyle ? <span className={badgeStyle}>{value}</span> : value;
  };

  const handleColumnToggle = (columnKey: keyof T) => {
    const newHiddenColumns = new Set(hiddenColumns);
    if (newHiddenColumns.has(columnKey)) {
      newHiddenColumns.delete(columnKey);
    } else {
      newHiddenColumns.add(columnKey);
    }
    setHiddenColumns(newHiddenColumns);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };
  const renderCellContent = (key: keyof T | string, row: T, render?: (value: any) => ReactNode) => {
    const value = typeof key === "string" ? getNestedValue(row, key) : row[key];
    return render ? render(value) : value;
  };

  return (
    <div className="overflow-x-auto bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <SearchInput 
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              onSearch?.(value);
            }}
          />
          {filters.map((filter) => (
            <div key={String(filter.key)} className="flex items-center space-x-2">
              {filter.type === 'time' ? (
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              ) : (
                <select
                  className="border rounded-lg px-3 py-2"
                  onChange={(e) => setSearchQuery(e.target.value)}
                >
                  <option value="">All</option>
                  {filter.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        {/* Import/Export Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={onImport} className="p-2 hover:bg-indigo-100 rounded-lg">
            <FileDown className="w-5 h-5 text-indigo-600" />
          </button>
          <button onClick={onExport} className="p-2 hover:bg-indigo-100 rounded-lg">
            <FileUp className="w-5 h-5 text-indigo-600" />
          </button>
          <div className="relative">
            <button
              className="bg-gray-100 p-2 rounded-lg"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Display
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10"
              >
                {headers
                  .filter(({ hiding }) => hiding !== true)
                  .map(({ label, key }) => (
                    <div
                      key={String(key)}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenColumns.has(key)}
                        onChange={() => handleColumnToggle(key)}
                        className="mr-2"
                      />
                      <span>{label}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <table className="table-auto w-full text-left text-gray-700 border-collapse">
        <thead className="border-b border-gray-300">
          <tr>
            {selectable && (
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={(e) => {
                    const isSelected = e.target.checked;
                    setSelectedRows(isSelected ? data : []);
                    onRowSelect(isSelected ? data : []);
                  }}
                />
              </th>
            )}
            {headers.map(({ label, key, sortable }) =>
              !hiddenColumns.has(key) && (
                <th key={String(key)} className="p-4 text-sm font-medium cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <span>{label}</span>
                    {sortable && (
                      <button onClick={() => handleSort(key)} className="focus:outline-none">
                        {sortConfig?.key === key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              )
            )}
            {actions && <th className="p-4 text-sm font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${selectedRows.includes(row) ? 'bg-blue-50' : ''} hover:bg-gray-50`}
            >
              {selectable && (
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row)}
                    onChange={() => {
                      const newSelection = selectedRows.includes(row)
                        ? selectedRows.filter((r) => r !== row)
                        : [...selectedRows, row];
                      setSelectedRows(newSelection);
                      onRowSelect(newSelection);
                    }}
                  />
                </td>
              )}
              {headers.map(({ key, render }) =>
                !hiddenColumns.has(key) && (
                  <td key={String(key)} className="p-4 text-sm">
                    {renderCellContent(key, row, render)}
                  </td>
                )
              )}
              {actions && (
                <td className="p-4">
                  {typeof actions === 'function'
                    ? actions(row)
                    : React.Children.map(actions, (action) =>
                      React.cloneElement(action as React.ReactElement, { row, onAction })
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
