import { Select } from "antd"

const { Option } = Select

interface MonthSelectorProps {
  selectedMonth: number
  onMonthChange: (month: number) => void
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="month-select" className="font-medium">
        Chọn tháng:
      </label>
      <Select value={selectedMonth} onChange={(value) => onMonthChange(value)} style={{ width: 150 }} id="month-select">
        {Array.from({ length: 12 }, (_, i) => (
          <Option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString("vi", { month: "long" })}
          </Option>
        ))}
      </Select>
    </div>
  )
}
