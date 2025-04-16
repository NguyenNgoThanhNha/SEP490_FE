import * as Popover from "@radix-ui/react-popover";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import { Button } from "@/components/atoms/ui/button";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hook/useDebounce";

export function MultiSelect({
  label,
  fetchOptions,
  selected,
  onChange,
}: {
  label: string;
  fetchOptions: (query: string) => Promise<{ label: string; value: number }[]>;
  selected: number[];
  onChange: (value: number[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedOptions = await fetchOptions(debouncedSearchTerm);
        setOptions(fetchedOptions);
      } catch (err) {
        console.error("Error fetching options:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchTerm]);

  const toggleValue = (val: number) => {
    onChange(selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val]);
  };

  return (
    <div className="space-y-2">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button variant="outline">{label}</Button>
        </Popover.Trigger>
        <Popover.Content className="p-4 bg-white rounded-md shadow w-80 z-50">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          {loading ? (
            <div className="text-sm text-gray-500">Đang tải...</div>
          ) : (
            <>
              {options.length === 0 ? (
                <div className="text-sm text-gray-500">Không có sản phẩm</div>
              ) : (
                <div className="max-h-52 overflow-auto space-y-2">
                  {options.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={selected.includes(option.value)}
                        onCheckedChange={() => toggleValue(option.value)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Popover.Content>
      </Popover.Root>

      {/* Hiển thị các sản phẩm đã chọn */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => (
              <span
                key={opt.value}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
              >
                {opt.label}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
