import { useState } from "react";
import { Table, Modal, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const { Option } = Select;

const shifts: ReadonlyArray<string> = ["Ca sáng", "Ca trưa", "Ca chiều"];
const daysOfWeek: ReadonlyArray<string> = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

interface ShiftSchedule {
  date: string;
  shift: string;
  technician: string;
  order: string;
}

interface ScheduleRow {
  key: string;
  shift: string;
  [date: string]: { employees: string[] } | string;
}

const generateWeekDates = (year: number, weekNumber: number): dayjs.Dayjs[] => {
  const startOfYear = dayjs(`${year}-01-01`);
  const startDate = startOfYear.add((weekNumber - 1) * 7, "day");
  return daysOfWeek.map((_, index) => startDate.add(index, "day"));
};

const sampleData: ShiftSchedule[] = [
  { date: "27/02", shift: "Ca sáng", technician: "Nguyễn Văn A", order: "Order 101" },
  { date: "27/02", shift: "Ca trưa", technician: "Trần Thị B", order: "Order 102" },
  { date: "28/02", shift: "Ca chiều", technician: "Lê Văn C", order: "Order 103" },
];

const WeeklySchedule: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedWeek, setSelectedWeek] = useState<number>(dayjs().week());
  const [selectedEvent, setSelectedEvent] = useState<{ employees: string[] } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const weekDates = generateWeekDates(selectedYear, selectedWeek);

  const dataSource: ScheduleRow[] = shifts.map((shift) => {
    const row: ScheduleRow = { key: shift, shift };
    weekDates.forEach((date) => {
      const employees = sampleData.filter(
        (item) => item.shift === shift && item.date === date.format("DD/MM")
      );
      row[date.format("DD/MM")] = employees.length
        ? { employees: employees.map((e) => `${e.technician} (${e.order})`) }
        : { employees: [] };
    });
    return row;
  });

  const columns = [
    {
      title: "",
      dataIndex: "shift",
      key: "shift",
      fixed: "left",
      width: 120,
      render: (text: string) => <span style={{ fontSize: "16px", fontWeight: "bold" }}>{text}</span>,
    },
    ...weekDates.map((date, index) => ({
      title: (
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          <div>{daysOfWeek[index]}</div>
          <div>{date.format("DD/MM")}</div>
        </div>
      ),
      dataIndex: date.format("DD/MM"),
      key: date.format("DD/MM"),
      render: (record: { employees: string[] }) => (
        <div
          onClick={() => {
            setSelectedEvent(record);
            setIsModalVisible(true);
          }}
          style={{ cursor: "pointer", padding: "10px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px", fontWeight: "500" }}
        >
          {record.employees.length > 0 ? record.employees.join(", ") : "Không có nhân viên"}
        </div>
      ),
    })),
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: "10px" }}>
        <Select value={selectedWeek} onChange={setSelectedWeek} style={{ width: 150 }}>
          {Array.from({ length: 52 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              Tuần {i + 1} ({generateWeekDates(selectedYear, i + 1)[0].format("DD/MM")} - {generateWeekDates(selectedYear, i + 1)[6].format("DD/MM")})
            </Option>
          ))}
        </Select>
        <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
          {[2024, 2025, 2026].map((year) => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
      <Modal
        title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>Chi tiết lịch làm việc</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedEvent && (
          <div>
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>Nhân viên làm việc:</p>
            <ul style={{ fontSize: "14px" }}>
              {selectedEvent.employees.map((emp, index) => (
                <li key={index}>{emp}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WeeklySchedule;
