import { useState, useEffect } from "react";
import { Table, Modal, Select } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { TSlotWorking } from "@/types/staff-calendar.type";
import staffService from "@/services/staffService";

dayjs.locale("vi");

const { Option } = Select;

const shifts = ["Ca sáng", "Ca chiều", "Ca tối"]; 

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]; 

const generateWeekDates = (year: number, weekNumber: number): dayjs.Dayjs[] => {
  const startOfYear = dayjs(`${year}-01-01`);
  const base = startOfYear.add((weekNumber - 1) * 7, "day");
  const monday = base.day() === 0 ? base.subtract(6, "day") : base.startOf("week").add(1, "day");

  return Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));
};

interface ScheduleRow {
  key: string;
  shift: string;
  [date: string]: { employees: string[] } | string;
}

const WeeklySchedule = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [selectedWeek, setSelectedWeek] = useState<number>(dayjs().week());
  const [selectedEvent, setSelectedEvent] = useState<{ employees: string[] } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [scheduleData, setScheduleData] = useState<TSlotWorking[]>([]);

  const weekDates = generateWeekDates(selectedYear, selectedWeek);
  const selectedMonth = weekDates[0].month() + 1; 

  useEffect(() => {
    const fetchData = async () => {
      const response = await staffService.staffWorkingSlot(1, selectedMonth, selectedYear); 
      if (response.success) {
        setScheduleData(response.result?.data);
      }
    };
    fetchData();
  }, [selectedWeek, selectedYear]);

  const dataSource: ScheduleRow[] = shifts.map((shift) => {
    const row: ScheduleRow = { key: shift, shift };
    weekDates.forEach((date) => {
      const dateStr = date.format("YYYY-MM-DD");
      const employees: string[] = [];

      scheduleData.forEach((staff) => {
        staff.slots.forEach((slot) => {
          if (
            slot.shiftName === shift &&
            dayjs(slot.workDate).format("YYYY-MM-DD") === dateStr
          ) {
            employees.push(`${staff.staffName} (${slot.startTime} - ${slot.endTime})`);
          }
        });
      });

      row[date.format("DD/MM")] = { employees };
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
      render: (text: string) => <strong>{text}</strong>,
    },
    ...weekDates.map((date, index) => {
      return {
        title: (
          <div>
            <div>{daysOfWeek[index]}</div> 
            <div>{date.format("DD/MM")}</div>
          </div>
        ),
        dataIndex: date.format("DD/MM"),
        key: date.format("DD/MM"),
        render: (record: { employees: string[] }) => {
          const employeesForDay = record.employees.length
            ? record.employees
            : ["Không có nhân viên"];
  
          return (
            <div
              onClick={() => {
                setSelectedEvent(record);
                setIsModalVisible(true);
              }}
              style={{
                cursor: "pointer",
                padding: "10px",
                background: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              {employeesForDay.map((emp, index) => {
                const [staffName, workTime] = emp.split(" (");
                return (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px", 
                      lineHeight: "1.4", 
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {staffName}
                    </div>
                    {workTime && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888", 
                        }}
                      >
                        {workTime.replace(")", "")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        },
      };
    }),
  ];
  

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
        <Select value={selectedWeek} onChange={setSelectedWeek} style={{ width: 150 }}>
          {Array.from({ length: 52 }, (_, i) => {
            const weekStart = generateWeekDates(selectedYear, i + 1)[0];
            const weekEnd = generateWeekDates(selectedYear, i + 1)[5];
            return (
              <Option key={i + 1} value={i + 1}>
                Tuần {i + 1} ({weekStart.format("DD/MM")} - {weekEnd.format("DD/MM")})
              </Option>
            );
          })}
        </Select>
        <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
          {[2024, 2025, 2026].map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
      </div>
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
      <Modal
        title="Chi tiết lịch làm việc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedEvent && (
          <ul>
            {selectedEvent.employees.map((emp, index) => (
              <li key={index}>
                <strong>{emp.split(" (")[0]}</strong>{" "}
                <span style={{ fontWeight: "bold" }}>
                  ({emp.split(" (")[1].replace(")", "")})
                </span>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default WeeklySchedule;
